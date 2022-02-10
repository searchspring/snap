import { API, HTTPHeaders } from './Abstract';
import { charsParams } from '../utils/charsParams';

export type PreflightRequestModel = {
	userId: string;
	siteId: string;
	shopper?: string;
	cart?: string[];
	lastViewed?: string[];
};

export class PersonalizationAPI extends API {
	async preflightCache(params: PreflightRequestModel): Promise<Response> {
		let requestMethod = 'getPreflightCache';
		if (charsParams(params) > 1024) {
			requestMethod = 'postPreflightCache';
		}
		const response = await this[requestMethod](params);
		return response;
	}

	async getPreflightCache(queryParameters: PreflightRequestModel): Promise<Response> {
		const headerParameters: HTTPHeaders = {};
		const path = `/api/personalization/preflightCache`;

		const response = await this.request({
			path,
			method: 'GET',
			headers: headerParameters,
			query: queryParameters,
		});

		return response;
	}

	async postPreflightCache(requestParameters: PreflightRequestModel): Promise<Response> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';
		const path = `/api/personalization/preflightCache`;

		const response = await this.request({
			path,
			method: 'POST',
			headers: headerParameters,
			body: requestParameters,
		});

		return response;
	}
}
