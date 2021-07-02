import { MetaRequestModel, MetaResponseModel } from '@searchspring/snapi-types';

import { API, HTTPHeaders, HTTPQuery } from '.';

export class LegacyAPI extends API {
	private async getEndpoint(queryParameters: any, path = '/api/search/search.json') {
		queryParameters.resultsFormat = 'native';
		const headerParameters: HTTPHeaders = {};

		const legacyResponse = await this.request({
			path,
			method: 'GET',
			headers: headerParameters,
			query: queryParameters,
		});

		return legacyResponse.json();
	}

	async postMeta(requestParameters: MetaRequestModel): Promise<MetaResponseModel> {
		const headerParameters: HTTPHeaders = {};

		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request({
			path: '/api/meta/meta.json',
			method: 'POST',
			headers: headerParameters,
			body: requestParameters,
		});

		return response.json();
	}

	async getMeta(queryParameters: MetaRequestModel): Promise<MetaResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const response = await this.request({
			path: '/api/meta/meta.json',
			method: 'GET',
			headers: headerParameters,
			query: queryParameters as unknown as HTTPQuery,
		});

		return response.json();
	}

	async getSearch(queryParameters: any): Promise<any> {
		return this.getEndpoint(queryParameters, '/api/search/search.json');
	}

	async getAutocomplete(queryParameters: any): Promise<any> {
		return this.getEndpoint(queryParameters, '/api/search/autocomplete.json');
	}

	async getFinder(queryParameters: any): Promise<any> {
		return this.getEndpoint(queryParameters, '/api/search/finder.json');
	}
}
