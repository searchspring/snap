import { API, ApiConfiguration, HTTPHeaders } from './Abstract';
import { hashParams } from '../utils/hashParams';
import { charsParams } from '@searchspring/snap-toolbox';
import { SearchResponseModelResult } from '@searchspring/snapi-types';

export type RecommendRequestModel = {
	tags: string[];
	siteId: string;
	product?: string;
	shopper?: string;
	categories?: string[];
	cart?: string[];
	lastViewed?: string[];
	test?: boolean;
	batched?: boolean;
	limits?: number[];
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
	siteId: string;
	product?: string;
	shopper?: string;
	categories?: string[];
	cart?: string[];
	lastViewed?: string[];
	test?: boolean;
	branch?: string;
};

class Deferred {
	promise: Promise<any>;
	resolve;
	reject;

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}
}

export type RecommendCombinedResponseModel = ProfileResponseModel & { results: SearchResponseModelResult[] };

const BATCH_TIMEOUT = 150;
export class RecommendAPI extends API {
	batches: {
		[key: string]: {
			timeout: number;
			request: any;
			deferreds?: Deferred[];
		};
	};

	constructor(config: ApiConfiguration) {
		super(config);
		this.batches = {};
	}

	async getProfile(queryParameters: ProfileRequestModel): Promise<ProfileResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const response = await this.request(
			{
				path: '/api/personalized-recommendations/profile.json',
				method: 'GET',
				headers: headerParameters,
				query: queryParameters,
			},
			'/api/personalized-recommendations/profile.json' + JSON.stringify(queryParameters)
		);

		return response as unknown as ProfileResponseModel;
	}

	async batchRecommendations(parameters: RecommendRequestModel): Promise<RecommendResponseModel> {
		const { tags, limits, ...otherParams } = parameters;
		const [tag] = tags || [];

		if (!tag) return;

		let key = hashParams(otherParams as RecommendRequestModel);
		if ('batched' in otherParams) {
			if (otherParams.batched) {
				key = otherParams.siteId;
			}
			delete otherParams.batched; // remove from request parameters
		}
		this.batches[key] = this.batches[key] || { timeout: null, request: { tags: [], limits: [], ...otherParams }, deferreds: [] };
		const paramBatch = this.batches[key];

		const deferred = new Deferred();

		paramBatch.request.tags.push(tag);
		paramBatch.request.limits.push(limits);

		paramBatch.deferreds.push(deferred);
		window.clearTimeout(paramBatch.timeout);

		paramBatch.timeout = window.setTimeout(async () => {
			let requestMethod = 'getRecommendations';
			if (charsParams(paramBatch.request) > 1024) {
				requestMethod = 'postRecommendations';
			}

			try {
				const response = await this[requestMethod](paramBatch.request);

				paramBatch.deferreds.forEach((def, index) => {
					def.resolve([response[index]]);
				});
			} catch (err) {
				paramBatch.deferreds.forEach((def) => {
					def.reject(err);
				});
			}

			delete this.batches[key];
		}, BATCH_TIMEOUT);

		return deferred.promise;
	}

	async getRecommendations(queryParameters: RecommendRequestModel): Promise<RecommendResponseModel> {
		const headerParameters: HTTPHeaders = {};

		const siteId = queryParameters.siteId;
		const path = `/boost/${siteId}/recommend`;

		const response = await this.request(
			{
				path,
				method: 'GET',
				headers: headerParameters,
				query: queryParameters,
			},
			path + JSON.stringify(queryParameters)
		);

		return response as unknown as RecommendResponseModel;
	}

	async postRecommendations(requestParameters: RecommendRequestModel): Promise<RecommendResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const siteId = requestParameters.siteId;
		const path = `/boost/${siteId}/recommend`;

		const response = await this.request(
			{
				path,
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			path + JSON.stringify(requestParameters)
		);

		return response as unknown as RecommendResponseModel;
	}
}
