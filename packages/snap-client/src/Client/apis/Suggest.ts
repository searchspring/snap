import { API, HTTPHeaders } from './Abstract';

export type SuggestRequestModel = {
	siteId: string;
	query: string;
	language?: string;
	suggestionCount?: number;
	productCount?: number;
	disableSpellCorrect?: boolean;
};

export type SuggestResponseModelSuggestion = {
	text: string;
	type?: string;
	source?: string;
	popularity?: number;
	completed?: {
		token: string;
		query: string;
		type: string;
	}[];
};

export type SuggestResponseModel = {
	query: string;
	'corrected-query'?: string;
	suggested?: SuggestResponseModelSuggestion;
	alternatives?: SuggestResponseModelSuggestion[];
};

export type TrendingRequestModel = {
	siteId: string;
	limit?: number;
};

export type TrendingResponseModel = {
	trending: {
		queries: {
			popularity: number;
			searchQuery: string;
		}[];
	};
};

export class SuggestAPI extends API {
	async getSuggest(queryParameters: SuggestRequestModel): Promise<SuggestResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const response = await this.request(
			{
				path: '/api/suggest/query',
				method: 'GET',
				headers: headerParameters,
				query: queryParameters,
			},
			'/api/suggest/query' + JSON.stringify(queryParameters)
		);

		return response as unknown as SuggestResponseModel;
	}

	async postSuggest(requestParameters: SuggestRequestModel): Promise<SuggestResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request(
			{
				path: '/api/suggest/query',
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			'/api/suggest/query' + JSON.stringify(requestParameters)
		);

		return response as unknown as SuggestResponseModel;
	}

	async getTrending(queryParameters: TrendingRequestModel): Promise<TrendingResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const response = await this.request(
			{
				path: '/api/suggest/trending',
				method: 'GET',
				headers: headerParameters,
				query: queryParameters,
			},
			'/api/suggest/trending' + JSON.stringify(queryParameters)
		);

		return response as unknown as TrendingResponseModel;
	}

	async postTrending(requestParameters: TrendingRequestModel): Promise<TrendingResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request(
			{
				path: '/api/suggest/trending',
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			'/api/suggest/trending' + JSON.stringify(requestParameters)
		);

		return response as unknown as TrendingResponseModel;
	}
}
