/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */

import ApiClient from '../ApiClient';
import SearchRequestModel from '../model/SearchRequestModel';
import SearchResponseModel from '../model/SearchResponseModel';

/**
 * Search service.
 * @module api/SearchApi
 * @version 0.1.13
 */
export default class SearchApi {
	/**
	 * Constructs a new SearchApi.
	 * @alias module:api/SearchApi
	 * @class
	 * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
	 * default to {@link module:ApiClient#instance} if unspecified.
	 */
	constructor(apiClient) {
		this.apiClient = apiClient || ApiClient.instance;
	}

	/**
	 * search
	 * standard search
	 * @param {Object} opts Optional parameters
	 * @param {module:model/SearchRequestModel} opts.searchRequestModel search parameters
	 * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/SearchResponseModel} and HTTP response
	 */
	postSearchWithHttpInfo(opts) {
		opts = opts || {};
		// let postBody = opts['searchRequestModel'];
		let postBody = opts;

		let pathParams = {};
		let queryParams = {};
		let headerParams = {};
		let formParams = {};

		let authNames = [];
		let contentTypes = ['application/json'];
		let accepts = ['application/json'];
		let returnType = SearchResponseModel;
		return this.apiClient.callApi(
			'/search',
			'POST',
			pathParams,
			queryParams,
			headerParams,
			formParams,
			postBody,
			authNames,
			contentTypes,
			accepts,
			returnType,
			null
		);
	}

	/**
	 * search
	 * standard search
	 * @param {Object} opts Optional parameters
	 * @param {module:model/SearchRequestModel} opts.searchRequestModel search parameters
	 * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/SearchResponseModel}
	 */
	postSearch(opts) {
		return this.postSearchWithHttpInfo(opts).then(function (response_and_data) {
			return response_and_data.data;
		});
	}
}
