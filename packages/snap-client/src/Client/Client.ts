import { AppMode } from '@searchspring/snap-toolbox';
import { HybridAPI, SuggestAPI, RecommendAPI, ApiConfiguration } from './apis';

import type {
	ClientGlobals,
	ClientConfig,
	TrendingRequestModel,
	TrendingResponseModel,
	ProfileRequestModel,
	ProfileResponseModel,
	RecommendResponseModel,
	RecommendRequestModel,
} from '../types';

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
	mode: AppMode.production,
	meta: {
		cache: {
			purgeable: false,
		},
	},
	search: {
		// origin: 'https://snapi.kube.athoscommerce.io'
	},
	autocomplete: {
		// origin: 'https://snapi.kube.athoscommerce.io'
	},
	recommend: {
		// origin: 'https://snapi.kube.athoscommerce.io'
	},
	finder: {
		// origin: 'https://snapi.kube.athoscommerce.io'
	},
	suggest: {
		// origin: 'https://snapi.kube.athoscommerce.io'
	},
};

export class Client {
	private mode = AppMode.production;
	private globals: ClientGlobals;
	private config: ClientConfig;
	private requesters: {
		autocomplete: HybridAPI;
		meta: HybridAPI;
		search: HybridAPI;
		recommend: RecommendAPI;
		suggest: SuggestAPI;
		finder: HybridAPI;
	};

	constructor(globals: ClientGlobals, config: ClientConfig = {}) {
		if (!globals?.siteId) {
			throw 'no siteId specified!';
		}

		this.globals = globals;
		this.config = deepmerge(defaultConfig, config);

		if (Object.values(AppMode).includes(this.config.mode as AppMode)) {
			this.mode = this.config.mode! as AppMode;
		}

		this.requesters = {
			autocomplete: new HybridAPI(
				new ApiConfiguration({
					fetchApi: this.config.fetchApi,
					initiator: this.config.initiator,
					mode: this.mode,
					origin: this.config.autocomplete?.origin,
					headers: this.config.autocomplete?.headers,
					cache: this.config.autocomplete?.cache,
					globals: this.config.autocomplete?.globals,
				}),
				this.config.autocomplete?.requesters
			),
			meta: new HybridAPI(
				new ApiConfiguration({
					fetchApi: this.config.fetchApi,
					initiator: this.config.initiator,
					mode: this.mode,
					origin: this.config.meta?.origin,
					headers: this.config.meta?.headers,
					cache: this.config.meta?.cache,
					globals: this.config.meta?.globals,
				})
			),
			recommend: new RecommendAPI(
				new ApiConfiguration({
					fetchApi: this.config.fetchApi,
					initiator: this.config.initiator,
					mode: this.mode,
					origin: this.config.recommend?.origin,
					secondaryOrigin: this.config.recommend?.secondaryOrigin,
					headers: this.config.recommend?.headers,
					cache: this.config.recommend?.cache,
					globals: this.config.recommend?.globals,
				})
			),
			search: new HybridAPI(
				new ApiConfiguration({
					fetchApi: this.config.fetchApi,
					initiator: this.config.initiator,
					mode: this.mode,
					origin: this.config.search?.origin,
					headers: this.config.search?.headers,
					cache: this.config.search?.cache,
					globals: this.config.search?.globals,
				})
			),
			finder: new HybridAPI(
				new ApiConfiguration({
					fetchApi: this.config.fetchApi,
					initiator: this.config.initiator,
					mode: this.mode,
					origin: this.config.finder?.origin,
					headers: this.config.finder?.headers,
					cache: this.config.finder?.cache,
					globals: this.config.finder?.globals,
				})
			),
			suggest: new SuggestAPI(
				new ApiConfiguration({
					fetchApi: this.config.fetchApi,
					initiator: this.config.initiator,
					mode: this.mode,
					origin: this.config.suggest?.origin,
					headers: this.config.suggest?.headers,
					cache: this.config.suggest?.cache,
					globals: this.config.suggest?.globals,
				})
			),
		};
	}

	async meta(params?: MetaRequestModel): Promise<MetaResponseModel> {
		const defaultParams: MetaRequestModel = { siteId: this.globals.siteId };
		params = deepmerge(defaultParams, params || {});

		return this.requesters.meta.getMeta(params);
	}

	async autocomplete(params: AutocompleteRequestModel = {}): Promise<{ meta: MetaResponseModel; search: AutocompleteResponseModel }> {
		if (!params.search?.query?.string) {
			throw 'query string parameter is required';
		}

		params = deepmerge(this.globals, params);

		const [meta, search] = await Promise.all([this.meta({ siteId: params.siteId || '' }), this.requesters.autocomplete.getAutocomplete(params)]);
		return { meta, search };
	}

	async search(params: SearchRequestModel = {}): Promise<{ meta: MetaResponseModel; search: SearchResponseModel }> {
		params = deepmerge(this.globals, params);

		const [meta, search] = await Promise.all([this.meta({ siteId: params.siteId || '' }), this.requesters.search.getSearch(params)]);
		return { meta, search };
	}

	async finder(params: SearchRequestModel = {}): Promise<{ meta: MetaResponseModel; search: SearchResponseModel }> {
		params = deepmerge(this.globals, params);

		const [meta, search] = await Promise.all([this.meta({ siteId: params.siteId || '' }), this.requesters.finder.getFinder(params)]);
		return { meta, search };
	}

	async trending(params: Partial<TrendingRequestModel>): Promise<TrendingResponseModel> {
		params = deepmerge({ siteId: this.globals.siteId }, params || {});

		return this.requesters.suggest.getTrending(params as TrendingRequestModel);
	}

	async recommend(
		params: RecommendRequestModel
	): Promise<{ meta: MetaResponseModel; profile: ProfileResponseModel; recommend: RecommendResponseModel }> {
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

		const recommendParams = {
			tag: tag,
			...otherParams,
			siteId: params.siteId || this.globals.siteId,
		};

		const [meta, profile, recommend] = await Promise.all([
			this.meta(params.siteId ? { siteId: params.siteId } : undefined),
			this.requesters.recommend.getProfile(profileParams),
			this.requesters.recommend.batchRecommendations(recommendParams),
		]);

		return {
			meta,
			profile,
			recommend,
		};
	}
}
