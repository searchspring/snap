import { API, ApiConfiguration } from './Abstract';
import { HTTPHeaders, PostRecommendRequestFiltersModel } from '../../types';
import { AppMode } from '@searchspring/snap-toolbox';
import { transformRecommendationFiltersPost } from '../transforms';
import {
	ProfileRequestModel,
	ProfileResponseModel,
	RecommendResponseModel,
	RecommendRequestModel,
	TransformedRequestModel,
	PostRecommendAPISpec,
} from '../../types';

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

type CombinedIncoming = Partial<RecommendRequestModel> & Partial<TransformedRequestModel>;
type BatchEntry = {
	request: CombinedIncoming;
	deferred: Deferred;
};

const BATCH_TIMEOUT = 150;
export class RecommendAPI extends API {
	private batches: {
		[key: string]: {
			timeout: number | NodeJS.Timeout;
			request: PostRecommendAPISpec;
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
		const key = parameters.batched ? `${parameters.siteId}:${parameters.groupId}` : `${Math.random()}:${parameters.groupId}`;
		const batch = (this.batches[key] = this.batches[key] || { timeout: null, request: { profiles: [] }, entries: [] });
		const deferred = new Deferred();

		const { tag, limits, limit, searchTerm, filters, profileFilters, dedupe, categories, brands } = parameters;

		const newParams = {
			...parameters,
			profiles: [
				{
					tag: tag,
					categories,
					brands,
					limit: limit ? limit : limits ? (typeof limits == 'number' ? limits : limits[0]) : undefined,
					searchTerm,
					filters: profileFilters,
					dedupe,
				},
			],
			filters,
		};

		// add each request to the list
		batch.entries.push({ request: newParams, deferred: deferred });

		// wait for all of the requests to come in
		const timeoutClear = typeof window !== 'undefined' ? window.clearTimeout : clearTimeout;
		const timeoutSet = typeof window !== 'undefined' ? window.setTimeout : setTimeout;
		timeoutClear && timeoutClear(batch.timeout);
		batch.timeout = timeoutSet(async () => {
			// delete the batch so a new one can take its place
			delete this.batches[key];

			//resort batch entries based on order
			batch.entries.sort(sortBatchEntries);

			// now that the requests are in proper order, map through them
			// and build out the batches
			batch.entries.map((entry) => {
				const { profiles } = entry.request;

				if (profiles) {
					profiles.forEach((profile) => {
						if (!profile.limit) {
							profile.limit = 20;
						}

						let transformedFilters;
						if (profile.filters) {
							transformedFilters = transformRecommendationFiltersPost(profile.filters) as PostRecommendRequestFiltersModel[];
						}

						batch.request.profiles?.push({ ...profile, filters: transformedFilters });
					});
				}

				batch.request = {
					...batch.request,
					siteId: parameters.siteId,
					product: parameters.product,
					products: parameters.products,
					blockedItems: parameters.blockedItems,
					test: parameters.test,
					cart: parameters.cart,
					lastViewed: parameters.lastViewed,
					shopper: parameters.shopper,
				} as PostRecommendAPISpec;

				// combine product data if both 'product' and 'products' are used
				if (batch.request.product && Array.isArray(batch.request.products) && batch.request.products.indexOf(batch.request.product) == -1) {
					batch.request.products = batch.request.products.concat(batch.request.product);

					delete batch.request.product;
				}

				// transform global filters here
				if (entry.request.filters) {
					const globalFiltersToAdd = transformRecommendationFiltersPost(entry.request.filters!) as PostRecommendRequestFiltersModel[];
					batch.request['filters'] = globalFiltersToAdd;
				}
			});

			try {
				if (this.configuration.mode == AppMode.development) {
					batch.request.test = true;
				}

				if (batch.request['product']) {
					batch.request['product'] = batch.request['product'].toString();
				}

				const response = await this.postRecommendations(batch.request as PostRecommendAPISpec);

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

	async postRecommendations(requestParameters: PostRecommendAPISpec): Promise<RecommendResponseModel> {
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
	const one = a.request as RecommendRequestModel;
	const two = b.request as RecommendRequestModel;

	// undefined order goes last
	if (one.order == undefined && two.order == undefined) {
		return 0;
	}
	if (one.order == undefined && two.order != undefined) {
		return 1;
	}
	if (two.order == undefined && one.order != undefined) {
		return -1;
	}
	if (one.order! < two.order!) {
		return -1;
	}
	if (one.order! > two.order!) {
		return 1;
	}
	return 0;
}
