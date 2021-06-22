import { API, HTTPHeaders } from './Abstract';
import { SearchResponseModelResult } from '@searchspring/snapi-types';

export type RecommendRequestModel = {
	tags: string[];
	product?: string;
	shopper?: string;
	categories?: string[];
	cart?: string[];
	lastViewed?: string[];
	test?: boolean;
	siteId?: string;
};

export type RecommendResponseModel = {
	profile: {
		tag: string;
	};
	results: SearchResponseModelResult[];
}[];

export type ProfileRequestModel = {
	siteId: string;
	tag: string;
	branch?: string;
};

export type ProfileResponseModel = {
	profile: {
		tag: string;
		placement: string;
		display: {
			threshold: number;
			template: {
				name: string;
				uuid: string;
				markup?: string;
				styles?: string;
				component?: string;
				branch?: string;
				group?: string;
			};
			templateParameters: {
				[any: string]: unknown;
			};
		};
	};
};

export type RecommendCombinedRequestModel = {
	tag: string;
	product?: string;
	shopper?: string;
	categories?: string[];
	cart?: string[];
	lastViewed?: string[];
	limit?: number;
	test?: boolean;
	siteId?: string;
	branch?: string;
};

export type RecommendCombinedResponseModel = ProfileResponseModel & { results: SearchResponseModelResult[] };

export class RecommendAPI extends API {
	// generic batched function?
	// if cart items use POST otherwise use GET

	async getProfile(queryParameters: ProfileRequestModel): Promise<ProfileResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const response = await this.request({
			path: '/api/personalized-recommendations/profile.json',
			method: 'GET',
			headers: headerParameters,
			query: queryParameters,
		});

		return response.json();
	}

	async getRecommendations(queryParameters: RecommendRequestModel): Promise<RecommendResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const siteId = queryParameters.siteId;
		delete queryParameters.siteId;

		const response = await this.request({
			path: `/boost/${siteId || this.configuration.getSiteId()}/recommend`,
			method: 'GET',
			headers: headerParameters,
			query: queryParameters,
		});

		return response.json();
	}

	async postRecommendations(requestParameters: RecommendRequestModel): Promise<RecommendResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const siteId = requestParameters.siteId;
		delete requestParameters.siteId;

		const response = await this.request({
			path: `/boost/${siteId || this.configuration.getSiteId()}/recommend`,
			method: 'POST',
			headers: headerParameters,
			body: requestParameters,
		});

		return response.json();
	}
}
