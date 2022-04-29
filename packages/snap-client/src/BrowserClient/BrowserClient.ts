import MiniSearch from 'minisearch';
import ItemsJS from 'itemsjs';
import deepmerge from 'deepmerge';

import { transformSearchResponse, transformSearchRequest } from './transforms';

import { ApiConfiguration, SuggestAPI, TrendingRequestModel, TrendingResponseModel } from '../Client/apis';

import type { ClientGlobals, SnapApiConfig, CacheConfig } from '../types';
import type { SearchResult, MerchandisingFeed } from './types';

import type {
	AutocompleteRequestModel,
	AutocompleteResponseModel,
	MetaRequestModel,
	MetaResponseModel,
	MetaResponseModelFacetList,
	MetaResponseModelFacetListMultipleEnum,
	SearchRequestModel,
	SearchResponseModel,
	SearchResponseModelResult,
} from '@searchspring/snapi-types';

// const CORE_FIELDS = [
// 	'uid',
// 	'sku',
// 	'name',
// 	'url',
// 	'addToCartUrl',
// 	'price',
// 	'msrp',
// 	'imageUrl',
// 	'secureImageUrl',
// 	'thumbnailImageUrl',
// 	'secureThumbnailImageUrl',
// 	'rating',
// 	'ratingCount',
// 	'description',
// 	'stockMessage',
// 	'brand',
// 	'popularity',
// 	'caption',
// ];

type BrowserData = {
	products?: SearchResponseModelResult[];
	meta?: MetaResponseModel;
	searchableFields?: string[];
	fields?: string[];
	merch?: MerchandisingFeed;
};

type BrowserConfig = {
	feed?: {
		products?: string;
		fields?: string;
		searchableFields?: string;
		meta?: string;
		merch?: string;
	};
	miniSearch?: {};
	itemsJs?: {};
	suggest?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
	};
	options: {
		defaultPageSize: number;
	};
};

class Deferred {
	promise: Promise<any>;
	resolve;
	reject;

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}
}

export class BrowserClient {
	private requesters: {
		suggest: SuggestAPI;
	};

	private globals: ClientGlobals;
	private config: BrowserConfig;
	private miniSearch: MiniSearch;
	private miniSearchAc: MiniSearch;
	private itemsJs: ItemsJS;
	private data: BrowserData = {};
	private ready: Deferred;

	constructor(globals: ClientGlobals, config: Partial<BrowserConfig> = {}) {
		if (!globals?.siteId) {
			throw 'no siteId specified!';
		}

		this.globals = globals;
		this.config = deepmerge(this.defaultConfig, config);

		this.requesters = {
			suggest: new SuggestAPI(
				new ApiConfiguration({
					origin: this.config.suggest?.api?.origin,
					cache: this.config.suggest.cache,
				})
			),
		};

		this.init();
	}

	get defaultConfig(): BrowserConfig {
		return {
			miniSearch: {},
			itemsJs: {},
			suggest: {
				api: {
					// origin: 'https://snapi.kube.searchspring.io',
				},
			},
			options: {
				defaultPageSize: 20,
			},
		};
	}

	private async init() {
		this.ready = new Deferred();

		// load from localStorage or fetch
		const storageKey = `ss-data-${this.globals.siteId}`;
		const stored = window.localStorage.getItem(storageKey);
		const storedData: BrowserData = stored && JSON.parse(stored);

		// TODO: expire this at some set time
		if (storedData) {
			this.data = storedData;
		} else {
			const data = await this.fetchData();
			this.data = data;
			localStorage.setItem(storageKey, JSON.stringify(data));
		}

		try {
			// setup minisearch and itemsjs
			this.miniSearch = new MiniSearch({
				fields: this.data.searchableFields,
			});
			this.miniSearch.addAll(this.data.products);

			this.miniSearchAc = new MiniSearch({
				fields: ['name'],
			});
			// TODO: bad to store products twice
			this.miniSearchAc.addAll(this.data.products);

			const supportedDisplayTypes = ['list', 'palette', 'grid'];
			const aggregations = {};
			Object.keys(this.data.meta?.facets).forEach((field) => {
				const facet = this.data.meta?.facets[field] as MetaResponseModelFacetList;
				if (supportedDisplayTypes.includes(facet?.display)) {
					aggregations[field] = {
						title: facet.label,
						conjunction: facet.multiple != ('or' as MetaResponseModelFacetListMultipleEnum.Or),
						size: 100,
					};
				}
			});

			const sortings = {};
			this.data.meta?.sortOptions.forEach((sort) => {
				const sortingsKey = sort.field + '_' + sort.direction;
				if (sort.type === 'field') {
					sortings[sortingsKey] = {
						field: sort.field,
						order: sort.direction,
					};
				}
			});

			const itemJSConfiguration = {
				native_search_enabled: false,
				aggregations: aggregations,
				searchableFields: this.data.searchableFields,
				sortings: sortings,
			};

			this.itemsJs = ItemsJS(this.data.products, itemJSConfiguration);

			this.ready.resolve();
		} catch (err) {
			console.error(err);
			this.ready.reject();
		}
	}

	private async fetchData() {
		const fetchProducts = window.fetch(this.config.feed.products);
		const fetchSearchableFields = window.fetch(this.config.feed.searchableFields);
		const fetchFields = window.fetch(this.config.feed.fields);
		const fetchMeta = window.fetch(this.config.feed.meta);
		const fetchMerch = window.fetch(this.config.feed.merch);

		const [productsResponse, searchableFieldsResponse, fieldsResponse, metaResponse, merchResponse] = await Promise.all([
			fetchProducts,
			fetchSearchableFields,
			fetchFields,
			fetchMeta,
			fetchMerch,
		]);

		const [products, searchableFields, fields, meta, merch] = await Promise.all([
			productsResponse.json(),
			searchableFieldsResponse.json(),
			fieldsResponse.json(),
			metaResponse.json(),
			merchResponse.json(),
		]);

		return {
			products: products.results,
			searchableFields,
			fields,
			meta,
			merch,
		};
	}

	async meta(params?: MetaRequestModel): Promise<MetaResponseModel> {
		await this.ready.promise;

		return this.data.meta;
	}

	async trending(params: Partial<TrendingRequestModel>): Promise<TrendingResponseModel> {
		params = deepmerge({ siteId: this.globals.siteId }, params || {});
		return this.requesters.suggest.getTrending(params as TrendingRequestModel);
	}

	async autocomplete(params: AutocompleteRequestModel = {}): Promise<[MetaResponseModel, AutocompleteResponseModel]> {
		if (!params.search?.query?.string) {
			throw 'query string parameter is required';
		}

		console.log('-- autocomplete start --');

		params = deepmerge(this.globals, params);

		// get suggestions from minisearch
		let query = params.search?.query?.string;
		let suggested;
		let alternatives;
		let suggestions = this.miniSearchAc.autoSuggest(params.search?.query?.string, {});
		suggestions = suggestions
			.sort((a, b) => {
				return a.suggestion.length - b.suggestion.length;
			})
			.sort((a, b) => {
				if (query === a.suggestion) {
					return -1;
				}
				return 1;
			})
			.slice(0, params.suggestions?.count || 5);

		if (suggestions.length != 0) {
			suggested = {
				text: suggestions[0].suggestion,
			};
			alternatives = suggestions.slice(1).map((alt) => {
				return {
					text: alt.suggestion,
				};
			});
			params.search.query.string = suggested.text;
		}

		// return results from itemsjs with search from first suggestion
		const [meta, searchResponse] = await this.search(params);
		const response = {
			autocomplete: {
				query,
				suggested,
				alternatives,
			},
			...searchResponse,
		};

		return Promise.all([meta, response]);
	}

	async search(params: SearchRequestModel = {}): Promise<[MetaResponseModel, SearchResponseModel]> {
		// need to ensure that miniSearch and itemsJs are ready
		await this.ready.promise;

		params = deepmerge(this.globals, params);

		const query = params?.search?.query?.string;
		let productIds: string[];

		// handle merchandising
		const merchandising = this.getCampaign(params);
		const elevations = merchandising?.elevations;

		// TODO 'refine query'
		if (query) {
			productIds = this.miniSearch.search(query, this.config.miniSearch).map((item) => item.id);
		} else {
			productIds = this.data.products.map((product) => product.id);
		}

		if (productIds?.length && elevations.length && !params.sorts?.length) {
			// elevate searchItems
			elevations.reverse().forEach((elevation) => {
				const index = productIds.indexOf(elevation);
				productIds.splice(index, 0);
				productIds.unshift(elevation);
			});
		}

		console.log('productIds', productIds);
		const transformedRequest = transformSearchRequest(params, this.config.options);
		const itemsJsRequest = {
			ids: productIds,
			isExactSearch: false,
			removeStopWordFilter: true,
			is_all_filtered_items: true,
			...transformedRequest,
		};

		const itemsJsResponse = this.itemsJs.search(itemsJsRequest);

		console.log('---- itemJs request: ', itemsJsRequest);
		console.log('---- itemJs response: ', itemsJsResponse);

		const response = {
			...transformSearchResponse(itemsJsResponse, params, this.config.options),
			merchandising,
		};

		console.log('---- search request: ', params);
		console.log('---- search response: ', response);

		return Promise.all([this.meta(), response]);
	}

	private getCampaign(request) {
		// Create new deep copy of campaigns
		let results = [];
		for (let i = 0; i < this.data.merch?.length; i++) {
			results.push(Object.assign({}, this.data.merch[i]));
		}

		results.forEach((campaign) => {
			campaign.score = 0;

			if (campaign.queryMatch && !request?.search?.query) {
				// If the campaign has a query but the request does not it's not a match
				campaign.score = 0;
			} else if (campaign.filters && !request.filters) {
				// If campaign has filters but request does not it's not a match
				campaign.score = 0;
			} else {
				if (campaign.filters) {
					let campaignFilters = campaign.filters.map((f) => f.field + ':' + f.value);
					let reqFilters = request.filters.map((f) => f.field + ':' + f.value);
					// If a campaign has filters the query needs to have all of those filters (possibly more)
					let diff = campaignFilters.filter((filter) => {
						return !reqFilters.includes(filter);
					});

					if (diff.length === 0) {
						campaign.score = 1000 * campaign.filters.length;
					}
				}

				if (campaign.queryMatch) {
					let q = cleanQuery(campaign.queryMatch.q);

					if (campaign.queryMatch.type === 'exact' && q == request?.search?.query?.string) {
						campaign.score += q.length * 10;
					}

					if (campaign.queryMatch.type === 'contains' && request?.search?.query?.string.includes(q)) {
						campaign.score += q.length;
					}
				}
			}
		});

		results = results.filter((campaign) => campaign.score > 0).sort((a, b) => b.score - a.score);

		let merchandising = {
			content: {
				header: [],
				banner: [],
				footer: [],
				left: [],
				inline: [],
			},
			redirect: '',
			elevations: [],
		};

		results.forEach((campaign) => {
			if (campaign.merchandising?.content) {
				Object.keys(campaign.merchandising.content).forEach((position) => {
					if (merchandising.content[position].length == 0) {
						merchandising.content[position] = campaign.merchandising.content[position];
					}
				});
			}
			if (campaign.merchandising.elevations && merchandising.elevations.length == 0) {
				merchandising.elevations = campaign.merchandising.elevations;
			}
			if (campaign.merchandising.redirect) {
				merchandising.redirect = campaign.merchandising.redirect;
			}
		});

		return merchandising;
	}
}

function cleanQuery(q) {
	return q.toLowerCase().replace(/[^a-z0-9]/g, '-');
}
