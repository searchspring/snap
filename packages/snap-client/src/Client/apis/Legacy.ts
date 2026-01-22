import { MetaRequestModel, MetaResponseModel } from '@searchspring/snapi-types';

import { API, HTTPQuery } from '.';
import { HTTPHeaders } from '../../types';
import { BEACON_PARAM } from '../transforms';

export class LegacyAPI extends API {
	private async getEndpoint(queryParameters: any, path = '/api/search/search.json') {
		queryParameters.resultsFormat = 'native';
		const headerParameters: HTTPHeaders = {};

		// remove pageLoadId from cache key query params
		const cacheParameters = { ...queryParameters };
		delete cacheParameters[BEACON_PARAM];
		delete cacheParameters.pageLoadId;
		delete cacheParameters.domain;
		// autocomplete only params
		delete cacheParameters.input;

		const legacyResponse = await this.request(
			{
				path,
				method: 'GET',
				headers: headerParameters,
				query: queryParameters,
			},
			JSON.stringify(cacheParameters)
		);

		return legacyResponse;
	}

	async postMeta(requestParameters: MetaRequestModel): Promise<MetaResponseModel> {
		const headerParameters: HTTPHeaders = {};

		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request(
			{
				path: '/api/meta/meta.json',
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			JSON.stringify(requestParameters)
		);

		return response as MetaResponseModel;
	}

	async getMeta(queryParameters: MetaRequestModel): Promise<MetaResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const response = await this.request(
			{
				path: '/api/meta/meta.json',
				method: 'GET',
				headers: headerParameters,
				query: queryParameters as unknown as HTTPQuery,
			},
			JSON.stringify(queryParameters)
		);

		return response as MetaResponseModel;
	}

	async getSearch(queryParameters: any): Promise<any> {
		queryParameters.ajaxCatalog = 'Snap';
		return this.getEndpoint(queryParameters, '/api/search/search.json');
	}

	async getCategory(queryParameters: any): Promise<any> {
		queryParameters.ajaxCatalog = 'Snap';
		return this.getEndpoint(queryParameters, '/api/search/category.json');
	}

	async getAutocomplete(queryParameters: any): Promise<any> {
		queryParameters.ajaxCatalog = 'Snap';
		return this.getEndpoint(queryParameters, '/api/search/autocomplete.json');
	}

	async getFinder(queryParameters: any): Promise<any> {
		queryParameters.ajaxCatalog = 'Snap';
		return this.getEndpoint(queryParameters, '/api/search/finder.json');
	}
}
