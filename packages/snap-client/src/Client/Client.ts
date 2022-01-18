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
		cache: {
			purgable: false,
		},
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

export class Client {
	private globals: ClientGlobals;
	private config: ClientConfig;
	private context: any;
	private requesters: {
		autocomplete: HybridAPI;
		meta: HybridAPI;
		search: HybridAPI;
		recommend: RecommendAPI;
		suggest: SuggestAPI;
	};

	constructor(globals: ClientGlobals, config: ClientConfig = {}, context?: any) {
		if (!globals?.siteId) {
			throw 'no siteId specified!';
		}

		this.globals = globals;
		this.config = deepmerge(defaultConfig, config);
		this.context = context;

		this.requesters = {
			autocomplete: new HybridAPI(
				new ApiConfiguration({
					basePath: this.config.autocomplete?.api?.host,
					cacheSettings: this.config.autocomplete.cache,
				})
			),
			meta: new HybridAPI(
				new ApiConfiguration({
					basePath: this.config.meta?.api?.host,
					cacheSettings: this.config.meta.cache,
				})
			),
			recommend: new RecommendAPI(
				new ApiConfiguration({
					basePath: this.config.recommend?.api?.host,
					cacheSettings: this.config.recommend.cache,
				})
			),
			search: new HybridAPI(
				new ApiConfiguration({
					basePath: this.config.search?.api?.host,
					cacheSettings: this.config.search.cache,
				})
			),
			suggest: new SuggestAPI(
				new ApiConfiguration({
					basePath: this.config.suggest?.api?.host,
					cacheSettings: this.config.suggest.cache,
				})
			),
		};
	}

	async meta(params?: MetaRequestModel): Promise<MetaResponseModel> {
		const defaultParams: MetaRequestModel = { siteId: this.globals.siteId };
		params = deepmerge(defaultParams, params || {});

		return this.requesters.meta.getMeta(params);
	}

	async autocomplete(params: AutocompleteRequestModel = {}): Promise<[MetaResponseModel, AutocompleteResponseModel]> {
		if (!params.search?.query?.string) {
			throw 'query string parameter is required';
		}

		params = deepmerge(this.globals, params);

		return Promise.all([this.meta({ siteId: params.siteId }), this.requesters.autocomplete.getAutocomplete(params)]);
	}

	async search(params: SearchRequestModel = {}): Promise<[MetaResponseModel, SearchResponseModel]> {
		params = deepmerge(this.globals, params);

		return Promise.all([this.meta({ siteId: params.siteId }), this.requesters.search.getSearch(params)]);
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
			siteId: params.siteId || this.globals.siteId,
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
