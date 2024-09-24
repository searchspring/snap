import { API } from './Abstract';
import { HTTPHeaders, SuggestRequestModel, SuggestResponseModel, TrendingRequestModel, TrendingResponseModel } from '../../types';

export class SuggestAPI extends API {
	async getSuggest(queryParameters: SuggestRequestModel): Promise<SuggestResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const response = await this.request<SuggestResponseModel>(
			{
				path: '/api/suggest/query',
				method: 'GET',
				headers: headerParameters,
				query: queryParameters,
			},
			JSON.stringify(queryParameters)
		);

		return response;
	}

	async postSuggest(requestParameters: SuggestRequestModel): Promise<SuggestResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request<SuggestResponseModel>(
			{
				path: '/api/suggest/query',
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			JSON.stringify(requestParameters)
		);

		return response;
	}

	async getTrending(queryParameters: TrendingRequestModel): Promise<TrendingResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const response = await this.request<TrendingResponseModel>(
			{
				path: '/api/suggest/trending',
				method: 'GET',
				headers: headerParameters,
				query: queryParameters,
			},
			JSON.stringify(queryParameters)
		);

		return response;
	}

	async postTrending(requestParameters: TrendingRequestModel): Promise<TrendingResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request<TrendingResponseModel>(
			{
				path: '/api/suggest/trending',
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			JSON.stringify(requestParameters)
		);

		return response;
	}
}
