import { API, ApiConfiguration, HTTPHeaders } from './Abstract';
import { hashParams } from '../utils/hashParams';
import { charsParams } from '../utils/charsParams';
import type { ParameterObject } from '../../types';
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
	test?: boolean;
	siteId?: string;
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
		[paramHash: string]: {
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

		const response = await this.request({
			path: '/api/personalized-recommendations/profile.json',
			method: 'GET',
			headers: headerParameters,
			query: queryParameters,
		});

		return response.json();
	}

	async batchRecommendations(parameters: RecommendRequestModel): Promise<RecommendResponseModel> {
		const { tags, ...otherParams } = parameters;
		const [tag] = tags || [];

		if (!tag) return;

		const paramHash = hashParams(otherParams as ParameterObject);
		this.batches[paramHash] = this.batches[paramHash] || { timeout: null, request: { tags: [], ...otherParams }, deferreds: [] };
		const paramBatch = this.batches[paramHash];

		const deferred = new Deferred();

		paramBatch.request.tags.push(tag);

		paramBatch.deferreds.push(deferred);
		window.clearTimeout(paramBatch.timeout);

		paramBatch.timeout = window.setTimeout(async () => {
			// TODO change to get as default
			let requestMethod = 'postRecommendations';
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

			delete this.batches[paramHash];
		}, BATCH_TIMEOUT);

		return deferred.promise;
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
