/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */

import ApiClient from "../ApiClient";
import AutocompleteRequestModel from '../model/AutocompleteRequestModel';
import AutocompleteResponseModel from '../model/AutocompleteResponseModel';

/**
* Autocomplete service.
* @module api/AutocompleteApi
* @version 0.1.13
*/
export default class AutocompleteApi {

    /**
    * Constructs a new AutocompleteApi. 
    * @alias module:api/AutocompleteApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }



    /**
     * autocomplete
     * autocomplete search
     * @param {Object} opts Optional parameters
     * @param {module:model/AutocompleteRequestModel} opts.autocompleteRequestModel search parameters
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/AutocompleteResponseModel} and HTTP response
     */
    postAutocompleteWithHttpInfo(opts) {
      opts = opts || {};
      // let postBody = opts['autocompleteRequestModel'];
			let postBody = opts;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = AutocompleteResponseModel;
      return this.apiClient.callApi(
        '/autocomplete', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * autocomplete
     * autocomplete search
     * @param {Object} opts Optional parameters
     * @param {module:model/AutocompleteRequestModel} opts.autocompleteRequestModel search parameters
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/AutocompleteResponseModel}
     */
    postAutocomplete(opts) {
      return this.postAutocompleteWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


}
