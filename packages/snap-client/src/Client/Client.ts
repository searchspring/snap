import 'whatwg-fetch';

import {
	LegacyAPI,
	HybridAPI,
	SuggestAPI,
	RecommendAPI,
	TrendingRequestModel,
	TrendingResponseModel,
	RecommendRequestModel,
	RecommendCombinedRequestModel,
	RecommendCombinedResponseModel,
	ApiConfiguration,
	ProfileRequestModel,
} from './apis';

import type { ClientGlobals, ClientConfig } from '../types';

import type {
	MetaRequestModel,
	MetaResponseModel,
	SearchRequestModel,
	SearchResponseModel,
	AutocompleteRequestModel,
	AutocompleteResponseModel,
} from '@searchspring/snapi-types';

import deepmerge from 'deepmerge';

const defaultConfig: ClientConfig = {
	meta: {
		prefetch: true,
		ttl: 300000,
	},
	search: {
		api: {
			// host: 'https://snapi.kube.searchspring.io',
			// path: '/api/v1/search',
		},
	},
	autocomplete: {
		api: {
			// host: 'https://snapi.kube.searchspring.io',
			// path: '/api/v1/autocomplete',
		},
	},
	recommend: {
		api: {
			// host: 'https://snapi.kube.searchspring.io',
			// path: '/api/v1/recommend',
		},
	},
	suggest: {
		api: {
			// host: 'https://snapi.kube.searchspring.io',
			// path: '/api/v1/recommend',
		},
	},
};

type Cache = {
	[siteId: string]: {
		meta?: {
			data?: MetaResponseModel;
			promise?: Promise<MetaResponseModel>;
			created?: number;
		};
	};
};

// TODO: expire meta data
const cache: Cache = {};

export class Client {
	private globals: ClientGlobals;
	private config: ClientConfig;
	private requesters: {
		autocomplete: HybridAPI;
		meta: HybridAPI;
		search: HybridAPI;
		recommend: RecommendAPI;
		suggest: SuggestAPI;
	};

	constructor(globals: ClientGlobals, config: ClientConfig = {}) {
		if (!globals?.siteId) {
			throw 'no siteId specified!';
		}

		this.globals = globals;
		this.config = deepmerge(defaultConfig, config);

		cache[this.globals.siteId] = cache[this.globals.siteId] || {};

		this.requesters = {
			autocomplete: new HybridAPI(
				new ApiConfiguration({
					basePath: this.config.autocomplete?.api?.host,
					siteId: this.globals.siteId,
				})
			),
			meta: new HybridAPI(
				new ApiConfiguration({
					basePath: this.config.meta?.api?.host,
					siteId: this.globals.siteId,
				})
			),
			recommend: new RecommendAPI(
				new ApiConfiguration({
					basePath: this.config.recommend?.api?.host,
					siteId: this.globals.siteId,
				})
			),
			search: new HybridAPI(
				new ApiConfiguration({
					basePath: this.config.search?.api?.host,
					siteId: this.globals.siteId,
				})
			),
			suggest: new SuggestAPI(
				new ApiConfiguration({
					basePath: this.config.suggest?.api?.host,
					siteId: this.globals.siteId,
				})
			),
		};

		if (this.config.meta.prefetch && !cache[this.globals.siteId].meta) {
			this.fetchMeta();
		}
	}

	get meta(): MetaResponseModel {
		return cache[this.globals.siteId].meta?.data;
	}

	fetchMeta(params?: MetaRequestModel): Promise<MetaResponseModel> {
		const defaultParams: MetaRequestModel = { siteId: this.globals.siteId };
		params = deepmerge(defaultParams, params || {});
		cache[params.siteId] = cache[params.siteId] || {};
		cache[params.siteId].meta = {};
		const metaCache = cache[params.siteId].meta;

		metaCache.promise = this.requesters.meta.getMeta(params);

		metaCache.promise
			.then((data) => {
				metaCache.data = data;
				metaCache.created = Date.now();
			})
			.catch((err) => {
				console.error(`Failed to fetch meta data for '${params.siteId}'.`);
				console.error(err);
			});

		return metaCache.promise;
	}

	async autocomplete(params: AutocompleteRequestModel = {}): Promise<[AutocompleteResponseModel, MetaResponseModel]> {
		if (!params.search?.query?.string) {
			throw 'query string parameter is required';
		}

		params = deepmerge(this.globals, params);

		!cache[params.siteId]?.meta && this.fetchMeta({ siteId: params.siteId });

		return Promise.all([this.requesters.autocomplete.getAutocomplete(params), cache[params.siteId].meta.promise]);
	}

	async search(params: SearchRequestModel = {}): Promise<[SearchResponseModel, MetaResponseModel]> {
		params = deepmerge(this.globals, params);

		!cache[params.siteId]?.meta && this.fetchMeta({ siteId: params.siteId });

		return Promise.all([this.requesters.search.getSearch(params), cache[params.siteId].meta.promise]);
	}

	async trending(params: Partial<TrendingRequestModel>): Promise<TrendingResponseModel> {
		params = deepmerge({ siteId: this.globals.siteId }, params || {});

		return this.requesters.suggest.getTrending(params as TrendingRequestModel);
	}

	async recommend(params: RecommendCombinedRequestModel): Promise<RecommendCombinedResponseModel> {
		// TODO - batching

		const { tag, ...otherParams } = params;
		if (!tag) {
			throw 'tag parameter is required';
		}

		const profileParams: ProfileRequestModel = {
			tag,
			siteId: params.siteId || this.globals.siteId,
		};

		if (otherParams.branch) {
			profileParams.branch = otherParams.branch;
			delete otherParams.branch;
		}

		const recommendParams: RecommendRequestModel = {
			tags: [tag],
			...otherParams,
		};

		const [profile, recommendations] = await Promise.all([
			this.requesters.recommend.getProfile(profileParams),
			this.requesters.recommend.batchRecommendations(recommendParams),
		]);

		return {
			...profile,
			results: recommendations[0].results,
		};
	}
}
