import MiniSearch from 'minisearch';
import ItemsJS from 'itemsjs';
import deepmerge from 'deepmerge';

import { transformSearchResponse, transformSearchRequest } from './transforms';

import type { ClientGlobals } from '../types';
import type { SearchResult } from './types';

import type {
	MetaRequestModel,
	MetaResponseModel,
	MetaResponseModelFacetList,
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
};

type BrowserConfig = {
	feed?: {
		products?: string;
		fields?: string;
		searchableFields?: string;
		meta?: string;
	};
	miniSearch?: {};
	itemsJs?: {};
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
	private globals: ClientGlobals;
	private config: BrowserConfig;
	private miniSearch: MiniSearch;
	private itemsJs: ItemsJS;
	private data: BrowserData = {};
	private ready: Deferred;

	constructor(globals: ClientGlobals, config: Partial<BrowserConfig> = {}) {
		console.log('constructor');
		if (!globals?.siteId) {
			throw 'no siteId specified!';
		}

		this.globals = globals;
		this.config = deepmerge(this.defaultConfig, config);

		this.init();
	}

	get defaultConfig(): BrowserConfig {
		return {
			miniSearch: {},
			itemsJs: {},
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

			const aggregations = {};
			Object.keys(this.data.meta?.facets).forEach((field) => {
				const facet = this.data.meta?.facets[field] as MetaResponseModelFacetList;
				if (facet?.display == 'list') {
					aggregations[field] = {
						title: facet.label,
						conjunctive: true,
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

		const [productsResponse, searchableFieldsResponse, fieldsResponse, metaResponse] = await Promise.all([
			fetchProducts,
			fetchSearchableFields,
			fetchFields,
			fetchMeta,
		]);

		const [products, searchableFields, fields, meta] = await Promise.all([
			productsResponse.json(),
			searchableFieldsResponse.json(),
			fieldsResponse.json(),
			metaResponse.json(),
		]);

		return {
			products: products.results,
			searchableFields,
			fields,
			meta,
		};
	}

	async meta(params?: MetaRequestModel): Promise<MetaResponseModel> {
		await this.ready.promise;

		return this.data.meta;
	}

	async search(params: SearchRequestModel = {}): Promise<[MetaResponseModel, SearchResponseModel]> {
		// need to ensure that miniSearch and itemsJs are ready
		await this.ready.promise;

		params = deepmerge(this.globals, params);

		const query = params?.search?.query?.string;
		let searchItems: SearchResult[];

		// TODO 'refine query'
		if (query) {
			searchItems = this.miniSearch.search(query, this.config.miniSearch);
		}

		const transformedRequest = transformSearchRequest(params, this.config.options);
		const itemsJsRequest = {
			ids: searchItems?.map((v) => v.id) || undefined,
			isExactSearch: false,
			removeStopWordFilter: true,
			is_all_filtered_items: true,
			...transformedRequest,
		};

		const itemsJsResponse = this.itemsJs.search(itemsJsRequest);

		console.log('---- itemJs request: ', itemsJsRequest);
		console.log('---- itemJs response: ', itemsJsResponse);

		const response = transformSearchResponse(itemsJsResponse, params, this.config.options);

		console.log('---- search request: ', params);
		console.log('---- search response: ', response);

		return Promise.all([this.meta(), response]);
	}
}
