import { AutocompleteApi, MetaApi, SearchApi } from './apis';
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
		apiHost: '',
	},
	search: {
		apiHost: '',
	},
	autocomplete: {
		apiHost: '',
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
		autocomplete: AutocompleteApi;
		meta: MetaApi;
		search: SearchApi;
	};

	constructor(globals: SnapClientGlobals, config?: SnapClientConfig) {
		this.globals = globals || {};
		this.config = deepmerge(defaultConfig, config);

		if (!this.globals.siteId) {
			throw 'no siteId specified!';
		}

		cache[this.globals.siteId] = cache[this.globals.siteId] || {};

		this.requesters = {
			autocomplete: new AutocompleteApi(),
			meta: new MetaApi(),
			search: new SearchApi(),
		};

		if (this.config.meta.prefetch && !cache[this.globals.siteId].meta) {
			this.fetchMeta();
		}
	}

	get meta(): MetaResponseModel {
		return cache[this.globals.siteId].meta?.data;
	}

	fetchMeta(params?: MetaRequestModel): void {
		const defaultParams: MetaRequestModel = { siteId: this.globals.siteId };
		cache[this.globals.siteId].meta = {};
		const metaCache = cache[this.globals.siteId].meta;
		params = deepmerge(params || {}, defaultParams);

		metaCache.promise = this.requesters.meta.postMeta(params);

		metaCache.promise
			.then((data) => {
				metaCache.data = data;
			})
			.catch((err) => {
				console.error(`Failed to fetch meta data for '${this.globals.siteId}'.`);
				console.error(err);
			});
	}

	async autocomplete(params: AutocompleteRequestModel = {}): Promise<AutocompleteResponseModel> {
		params = deepmerge(this.globals, params);

		!cache[this.globals.siteId].meta && this.fetchMeta();

		const [results] = await Promise.all([this.requesters.autocomplete.postAutocomplete(params), cache[params.siteId].meta.promise]);

		return results;
	}

	async search(params: SearchRequestModel = {}): Promise<SearchResponseModel> {
		params = deepmerge(this.globals, params);

		!cache[this.globals.siteId].meta && this.fetchMeta();

		const [results] = await Promise.all([this.requesters.search.postSearch(params), cache[params.siteId].meta.promise]);

		return results;
	}
}
