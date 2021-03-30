/**
 *
 * snAPI
 * Searchspring Snap Search API
 *
 * Built from SNAPI spec v0.1.13
 *
 */

import ApiClient from "../ApiClient";
import MetaRequestParameterModel from '../model/MetaRequestParameterModel';
import MetaResponseModel from '../model/MetaResponseModel';

/**
* Meta service.
* @module api/MetaApi
* @version 0.1.13
*/
export default class MetaApi {

    /**
    * Constructs a new MetaApi. 
    * @alias module:api/MetaApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }



    /**
     * meta data (post)
     * Retrieve the meta data for the account.
     * @param {Object} opts Optional parameters
     * @param {module:model/MetaRequestParameterModel} opts.metaRequestParameterModel 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/MetaResponseModel} and HTTP response
     */
    postMetaWithHttpInfo(opts) {
      opts = opts || {};
      // let postBody = opts['metaRequestParameterModel'];
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
      let returnType = MetaResponseModel;
      return this.apiClient.callApi(
        '/meta', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null
      );
    }

    /**
     * meta data (post)
     * Retrieve the meta data for the account.
     * @param {Object} opts Optional parameters
     * @param {module:model/MetaRequestParameterModel} opts.metaRequestParameterModel 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/MetaResponseModel}
     */
    postMeta(opts) {
      return this.postMetaWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


}
