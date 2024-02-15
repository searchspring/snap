import { API, ApiConfiguration } from './Abstract';
import { HTTPHeaders, PostRecommendRequestFiltersModel, PostRecommendRequestModel, GetRecommendRequestModel } from '../../types';
import { AppMode, charsParams } from '@searchspring/snap-toolbox';
import { transformRecommendationFiltersGet, transformRecommendationFiltersPost } from '../transforms';
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

type BatchEntry = {
	request: RecommendRequestModel;
	deferred: Deferred;
};

const BATCH_TIMEOUT = 150;
export class RecommendAPI extends API {
	private batches: {
		[key: string]: {
			timeout: number;
			request: Partial<RecommendRequestModel>;
			entries: BatchEntry[];
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
		// set up batch key and deferred promises
		const key = parameters.batched ? parameters.siteId : `${Math.random()}`;
		const batch = (this.batches[key] = this.batches[key] || { timeout: null, request: { tags: [], limits: [] }, entries: [] });
		const deferred = new Deferred();

		// add each request to the list
		batch.entries.push({ request: parameters, deferred: deferred });

		// wait for all of the requests to come in
		window.clearTimeout(batch.timeout);
		batch.timeout = window.setTimeout(async () => {
			// delete the batch so a new one can take its place
			delete this.batches[key];

			// reorder the requests by order value in context.
			batch.entries.sort(sortBatchEntries);

			// now that the requests are in proper order, map through them
			// and build out the batches
			batch.entries.map((entry) => {
				const { tags, categories, brands, ...otherParams } = entry.request;
				let limits = entry.request.limits;

				if (!limits) {
					limits = 20;
				}
				const [tag] = tags || [];

				delete otherParams.batched; // remove from request parameters
				delete otherParams.order; // remove from request parameters
				delete otherParams.limits;

				batch.request.tags!.push(tag);

				if (categories) {
					if (!batch.request.categories) {
						batch.request.categories = Array.isArray(categories) ? categories : [categories];
					} else {
						batch.request.categories = batch.request.categories.concat(categories);
					}
				}

				if (brands) {
					if (!batch.request.brands) {
						batch.request.brands = Array.isArray(brands) ? brands : [brands];
					} else {
						batch.request.brands = batch.request.brands.concat(brands);
					}
				}

				batch.request.limits = (batch.request.limits as number[]).concat(limits);
				batch.request = { ...batch.request, ...otherParams };

				// combine product data if both 'product' and 'products' are used
				if (batch.request.product && Array.isArray(batch.request.products)) {
					batch.request.products = batch.request.products.concat(batch.request.product);

					delete batch.request.product;
				}
			});

			try {
				if (this.configuration.mode == AppMode.development) {
					batch.request.test = true;
				}

				let response: RecommendResponseModel;
				if (charsParams(batch.request) > 1024) {
					if (batch.request['product']) {
						batch.request['product'] = batch.request['product'].toString();
					}

					//transform filters here
					if (batch.request.filters) {
						(batch.request as PostRecommendRequestModel)['filters'] = transformRecommendationFiltersPost(
							batch.request.filters
						) as PostRecommendRequestFiltersModel[];
					}

					response = await this.postRecommendations(batch.request as PostRecommendRequestModel);
				} else {
					if (batch.request.filters) {
						const filters = transformRecommendationFiltersGet(batch.request.filters);
						if (filters) {
							Object.keys(filters).map((filter) => {
								const _filter = filter as `filter.${string}`;
								(batch.request as GetRecommendRequestModel)[_filter] = filters[_filter as keyof typeof filters];
							});
						}
					}

					delete batch.request.filters;
					response = await this.getRecommendations(batch.request as GetRecommendRequestModel);
				}

				batch.entries?.forEach((entry, index) => {
					entry.deferred.resolve([response[index]]);
				});
			} catch (err) {
				batch.entries?.forEach((entry) => {
					entry.deferred.reject(err);
				});
			}
		}, BATCH_TIMEOUT);

		return deferred.promise;
	}

	async getRecommendations(queryParameters: GetRecommendRequestModel): Promise<RecommendResponseModel> {
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

	async postRecommendations(requestParameters: PostRecommendRequestModel): Promise<RecommendResponseModel> {
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

function sortBatchEntries(a: BatchEntry, b: BatchEntry) {
	// undefined order goes last
	if (a.request.order == undefined && b.request.order == undefined) {
		return 0;
	}
	if (a.request.order == undefined && b.request.order != undefined) {
		return 1;
	}
	if (b.request.order == undefined && a.request.order != undefined) {
		return -1;
	}
	if (a.request.order! < b.request.order!) {
		return -1;
	}
	if (a.request.order! > b.request.order!) {
		return 1;
	}
	return 0;
}
