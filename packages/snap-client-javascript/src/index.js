/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */

import deepmerge from 'deepmerge';
import ApiClient from './ApiClient';
import AutocompleteApi from './api/AutocompleteApi';
import AutocompleteRequestModel from './model/AutocompleteRequestModel';
import AutocompleteResponseModel from './model/AutocompleteResponseModel';
import MetaApi from './api/MetaApi';
import MetaRequestParameterModel from './model/MetaRequestParameterModel';
import MetaResponseModel from './model/MetaResponseModel';
import SearchApi from './api/SearchApi';
import SearchRequestModel from './model/SearchRequestModel';
import SearchResponseModel from './model/SearchResponseModel';

let meta = {
	cache: {},
	promises: {},
};

export default class SnapClient {
	#global;
	#config;
	#apiClient;
	#requesters;

	constructor(global, config) {
		this.#global = global || {};
		this.#config = config || {};

		if (!this.#global.siteId) {
			throw 'no siteId specified!';
		}

		this.#apiClient = new ApiClient(this.#config.apiHost);

		this.#requesters = {
			autocomplete: new AutocompleteApi(this.#apiClient),
			meta: new MetaApi(this.#apiClient),
			search: new SearchApi(this.#apiClient),
		};

		if (config && config.meta && config.meta.prefetch && !meta.cache[this.#global.siteId]) {
			this.#fetchMeta();
		}
	}

	get meta() {
		return meta.cache[this.#global.siteId];
	}

	#fetchMeta(params) {
		let constructedParams;
		let defaultParams = { siteId: this.#global.siteId };

		try {
			constructedParams = MetaRequestParameterModel.constructFromObject(params || defaultParams);
		} catch (err) {
			console.error('Invalid SNAPI meta request parameters.');
			constructedParams = defaultParams;
		}

		meta.promises[this.#global.siteId] = this.#requesters.meta
			.postMeta(constructedParams)
			.then((data) => {
				meta.cache[this.#global.siteId] = data;
			})
			.catch((err) => {
				console.error(`Failed to fetch meta data for '${this.#global.siteId}'.`);
			});
	}

	async autocomplete(params) {
		let constructedParams;

		try {
			constructedParams = AutocompleteRequestModel.constructFromObject(deepmerge(this.#global, params || {}));
		} catch (err) {
			console.error('Invalid SNAPI autocomplete request parameters.');
			// fall back to blank search
			constructedParams = { siteId: this.#global.siteId };
		}

		!meta.cache[constructedParams.siteId] && this.#fetchMeta();

		const [results] = await Promise.all([this.#requesters.autocomplete.postAutocomplete(constructedParams), meta.promises[constructedParams.siteId]]);

		return results;
	}

	async search(params) {
		let constructedParams;

		try {
			constructedParams = SearchRequestModel.constructFromObject(deepmerge(this.#global, params || {}));
		} catch (err) {
			console.error('Invalid SNAPI search request parameters.');
			// fall back to blank search
			constructedParams = { siteId: this.#global.siteId };
		}

		!meta.cache[constructedParams.siteId] && this.#fetchMeta();

		const [results] = await Promise.all([this.#requesters.search.postSearch(constructedParams), meta.promises[constructedParams.siteId]]);

		return results;
	}
}
