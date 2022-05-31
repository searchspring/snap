import { AppMode } from '@searchspring/snap-toolbox';

import {
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
	mode: AppMode.production,
	meta: {
		cache: {
			purgeable: false,
		},
	},
	search: {
		api: {
			// origin: 'https://snapi.kube.searchspring.io',
		},
	},
	autocomplete: {
		api: {
			// origin: 'https://snapi.kube.searchspring.io',
		},
	},
	recommend: {
		api: {
			// origin: 'https://snapi.kube.searchspring.io',
		},
	},
	suggest: {
		api: {
			// origin: 'https://snapi.kube.searchspring.io',
		},
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
					mode: this.mode,
					origin: this.config.autocomplete?.api?.origin,
					cache: this.config.autocomplete?.cache,
				})
			),
			meta: new HybridAPI(
				new ApiConfiguration({
					mode: this.mode,
					origin: this.config.meta?.api?.origin,
					cache: this.config.meta?.cache,
				})
			),
			recommend: new RecommendAPI(
				new ApiConfiguration({
					mode: this.mode,
					origin: this.config.recommend?.api?.origin,
					cache: this.config.recommend?.cache,
				})
			),
			search: new HybridAPI(
				new ApiConfiguration({
					mode: this.mode,
					origin: this.config.search?.api?.origin,
					cache: this.config.search?.cache,
				})
			),
			suggest: new SuggestAPI(
				new ApiConfiguration({
					mode: this.mode,
					origin: this.config.suggest?.api?.origin,
					cache: this.config.suggest?.cache,
				})
			),
		};
	}

	public setMode(mode: keyof typeof AppMode): void {
		if (Object.values(AppMode).includes(mode as AppMode)) {
			this.mode = mode as AppMode;

			for (const [name, requester] of Object.entries(this.requesters)) {
				requester.setMode(this.mode);
			}
		}
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

		return Promise.all([this.meta({ siteId: params.siteId || '' }), this.requesters.autocomplete.getAutocomplete(params)]);
	}

	async search(params: SearchRequestModel = {}): Promise<[MetaResponseModel, SearchResponseModel]> {
		params = deepmerge(this.globals, params);

		return Promise.all([this.meta({ siteId: params.siteId || '' }), this.requesters.search.getSearch(params)]);
	}

	async trending(params: Partial<TrendingRequestModel>): Promise<TrendingResponseModel> {
		params = deepmerge({ siteId: this.globals.siteId }, params || {});

		return this.requesters.suggest.getTrending(params as TrendingRequestModel);
	}

	async recommend(params: RecommendCombinedRequestModel): Promise<RecommendCombinedResponseModel> {
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
			siteId: params.siteId || this.globals.siteId,
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
