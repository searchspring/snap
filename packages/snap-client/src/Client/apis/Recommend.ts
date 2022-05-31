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
	limits?: number | number[];
	order?: number;
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
	resolve: any;
	reject: any;

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
			request: any;
			deferreds?: Deferred[];
		};
	};
	requests: any = [];
	timeout: undefined | number = undefined;

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
		let { tags, limits, categories, ...otherParams } = parameters;

		//set up batch keys and deferred promises
		let key = hashParams(otherParams as RecommendRequestModel);
		if ('batched' in otherParams) {
			if (otherParams.batched) {
				key = otherParams.siteId;
			}
		}

		this.batches[key] = this.batches[key] || { request: { tags: [], limits: [] }, deferreds: [] };

		const deferred = new Deferred();

		//add each request to the list
		this.requests.push({ ...parameters });

		this.batches[key].deferreds?.push(deferred);

		//wait for all of the requests to come in
		window.clearTimeout(this.timeout);
		this.timeout = window.setTimeout(async () => {
			const reorderRequests = (a: RecommendRequestModel, b: RecommendRequestModel) => {
				//undefined order goes last
				if (a.order == undefined && b.order == undefined) {
					return 0;
				}
				if (a.order == undefined && b.order != undefined) {
					return 1;
				}
				if (b.order == undefined && a.order != undefined) {
					return -1;
				}
				if (a.order! < b.order!) {
					return -1;
				}
				if (a.order! > b.order!) {
					return 1;
				}
				return 0;
			};

			//reorder the requests by order value in context.
			const sortedRequests = this.requests.sort(reorderRequests);

			//now that the requests are in proper order, map through them
			//and build out the batches
			sortedRequests.map((request: RecommendRequestModel) => {
				let { tags, limits, categories, ...otherParams } = request;

				if (!limits) limits = 20;
				const [tag] = tags || [];

				let key = hashParams(otherParams as RecommendRequestModel);
				if ('batched' in otherParams) {
					if (otherParams.batched) {
						key = otherParams.siteId;
					}
					delete otherParams.batched; // remove from request parameters
				}

				delete otherParams.order; // remove from request parameters

				let paramBatch = this.batches[key];

				paramBatch.request.tags.push(tag);

				if (categories) {
					if (!paramBatch.request.categories) {
						paramBatch.request.categories = categories;
					} else {
						paramBatch.request.categories = paramBatch.request.categories.concat(categories);
					}
				}

				paramBatch.request.limits = (paramBatch.request.limits as number[]).concat(limits);
				paramBatch.request = { ...paramBatch.request, ...otherParams };
			});

			//fetch and return each batch
			Object.keys(this.batches).forEach(async (batchKey: string) => {
				let batch = this.batches[batchKey];

				//get or post?
				if (charsParams(batch.request) > 1024) {
					//post request needs products as a string.
					if (batch.request['product']) {
						batch.request['product'] = batch.request['product'].toString();
					}
				}

				try {
					let response: RecommendResponseModel;
					if (charsParams(batch.request) > 1024) {
						response = await this.postRecommendations(batch.request);
					} else {
						response = await this.getRecommendations(batch.request);
					}

					batch.deferreds?.forEach((def, index) => {
						def.resolve([response[index]]);
					});
				} catch (err) {
					batch.deferreds?.forEach((def) => {
						def.reject(err);
					});
				}
				delete this.batches[batchKey];
			});
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
