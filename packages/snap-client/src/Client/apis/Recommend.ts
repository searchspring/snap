import { API, ApiConfiguration, HTTPHeaders } from './Abstract';
import { hashParams } from '../utils/hashParams';
import { charsParams } from '@searchspring/snap-toolbox';

import { ProfileRequestModel, ProfileResponseModel, RecommendRequestModel, RecommendResponseModel } from '../../types';

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

const BATCH_TIMEOUT = 150;
export class RecommendAPI extends API {
	private batches: {
		[key: string]: {
			timeout: number;
			request: any;
			requests: any[];
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
		let { tags, limits, categories, ...otherParams } = parameters;

		const getKey = (parameters: RecommendRequestModel) => {
			let key = hashParams(parameters as RecommendRequestModel);
			if ('batched' in parameters) {
				if (parameters.batched) {
					key = parameters.siteId;
				}
			}
			return key;
		};

		// set up batch keys and deferred promises
		const key = getKey(otherParams as RecommendRequestModel);
		const batch = (this.batches[key] = this.batches[key] || { timeout: null, request: { tags: [], limits: [] }, requests: [], deferreds: [] });
		const deferred = new Deferred();

		// add each request to the list
		batch.requests.push({ ...parameters });
		batch.deferreds?.push(deferred);

		//wait for all of the requests to come in
		window.clearTimeout(batch.timeout);
		batch.timeout = window.setTimeout(async () => {
			//reorder the requests by order value in context.
			const batchedRequests = batch.requests.sort(sortRequests);

			//now that the requests are in proper order, map through them
			//and build out the batches
			batchedRequests.map((request: RecommendRequestModel) => {
				let { tags, limits, categories, ...otherParams } = request;

				if (!limits) limits = 20;
				const [tag] = tags || [];

				delete otherParams.batched; // remove from request parameters
				delete otherParams.order; // remove from request parameters

				batch.request.tags.push(tag);

				if (categories) {
					if (!batch.request.categories) {
						batch.request.categories = categories;
					} else {
						batch.request.categories = batch.request.categories.concat(categories);
					}
				}

				batch.request.limits = (batch.request.limits as number[]).concat(limits);
				batch.request = { ...batch.request, ...otherParams };
			});

			try {
				let response: RecommendResponseModel;
				if (charsParams(batch.request) > 1024) {
					if (batch.request['product']) {
						batch.request['product'] = batch.request['product'].toString();
					}
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

function sortRequests(a: RecommendRequestModel, b: RecommendRequestModel) {
	// undefined order goes last
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
}
