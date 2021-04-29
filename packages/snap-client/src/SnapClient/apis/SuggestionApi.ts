import { AbstractApi, HTTPHeaders } from './AbstractApi';

export class SuggestionApi extends AbstractApi {
	async postMeta(requestParameters: any): Promise<any> {
		const queryParameters: any = {};

		const headerParameters: HTTPHeaders = {};

		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request({
			path: `/search.json`,
			method: 'POST',
			headers: headerParameters,
			query: queryParameters,
			body: requestParameters,
		});

		return response.json();
	}
}
