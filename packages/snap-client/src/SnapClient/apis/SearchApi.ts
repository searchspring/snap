import { AbstractApi, HTTPHeaders } from './AbstractApi';
import { SearchRequestModel, SearchResponseModel } from '@searchspring/snapi-types';

export class SearchApi extends AbstractApi {
	async postSearch(requestParameters: SearchRequestModel): Promise<SearchResponseModel> {
		const queryParameters: any = {};

		const headerParameters: HTTPHeaders = {};

		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request({
			path: `/search`,
			method: 'POST',
			headers: headerParameters,
			query: queryParameters,
			body: requestParameters,
		});

		return response.json();
	}
}
