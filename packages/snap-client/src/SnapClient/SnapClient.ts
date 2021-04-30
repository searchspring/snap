import { LegacyAPI, SnapAPI, HybridAPI, SuggestAPI, TrendingRequestModel, TrendingResponseModel, ApiConfiguration } from './apis';
import { SnapClientGlobals, SnapClientConfig } from '../types';

import {
	MetaRequestModel,
	MetaResponseModel,
	SearchRequestModel,
	SearchResponseModel,
	AutocompleteRequestModel,
	AutocompleteResponseModel,
} from '@searchspring/snapi-types';

import deepmerge from 'deepmerge';

const defaultConfig: SnapClientConfig = {
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
	trending: {
		prefetch: false,
		ttl: 86400000,
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

const cache: Cache = {};

export class SnapClient {
	private globals: SnapClientGlobals;
	private config: SnapClientConfig;
	private requesters: {
		autocomplete: HybridAPI;
		meta: LegacyAPI;
		search: HybridAPI;
		trending: SuggestAPI;
	};

	constructor(globals: SnapClientGlobals, config: SnapClientConfig = {}) {
		if (!globals?.siteId) {
			throw 'no siteId specified!';
		}

		this.globals = globals;
		this.config = deepmerge(defaultConfig, config);

		const apiHost = `https://${this.globals.siteId}.a.searchspring.io`;

		cache[this.globals.siteId] = cache[this.globals.siteId] || {};

		this.requesters = {
			autocomplete: new HybridAPI(new ApiConfiguration({ basePath: this.config.autocomplete.api?.host || apiHost })),
			meta: new LegacyAPI(new ApiConfiguration({ basePath: this.config.meta.api?.host || apiHost })),
			search: new HybridAPI(new ApiConfiguration({ basePath: this.config.search.api?.host || apiHost })),
			trending: new SuggestAPI(new ApiConfiguration({ basePath: this.config.trending.api?.host || apiHost })),
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
		cache[this.globals.siteId].meta = {};
		const metaCache = cache[this.globals.siteId].meta;
		params = deepmerge(params || {}, defaultParams);

		metaCache.promise = this.requesters.meta.getMeta(params);

		metaCache.promise
			.then((data) => {
				metaCache.data = data;
			})
			.catch((err) => {
				console.error(`Failed to fetch meta data for '${this.globals.siteId}'.`);
				console.error(err);
			});

		return metaCache.promise;
	}

	async autocomplete(params: AutocompleteRequestModel = {}): Promise<AutocompleteResponseModel> {
		if (!params.search?.query?.string) {
			throw 'query string parameter is required';
		}

		params = deepmerge(this.globals, params);

		!cache[this.globals.siteId].meta && this.fetchMeta();

		const [results] = await Promise.all([this.requesters.autocomplete.getAutocomplete(params), cache[params.siteId].meta.promise]);

		return results;
	}

	async search(params: SearchRequestModel = {}): Promise<SearchResponseModel> {
		params = deepmerge(this.globals, params);

		!cache[this.globals.siteId].meta && this.fetchMeta();

		const [results] = await Promise.all([this.requesters.search.getSearch(params), cache[params.siteId].meta.promise]);

		return results;
	}

	async trending(params: TrendingRequestModel): Promise<TrendingResponseModel> {
		params = deepmerge({ siteId: this.globals.siteId }, params || {});

		return this.requesters.trending.getTrending(params);
	}
}
