import { API, ApiConfiguration } from './Abstract';
import { HTTPHeaders, RecommendPostRequestProfileModel } from '../../types';
import { AppMode } from '@searchspring/snap-toolbox';
import { transformRecommendationFiltersPost } from '../transforms';
import { ProfileRequestModel, ProfileResponseModel, RecommendResponseModel, RecommendRequestModel, RecommendPostRequestModel } from '../../types';

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
			timeout: number | NodeJS.Timeout;
			request: RecommendPostRequestModel;
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
			JSON.stringify(queryParameters)
		);

		return response as unknown as ProfileResponseModel;
	}

	async batchRecommendations(parameters: RecommendRequestModel): Promise<RecommendResponseModel> {
		const batchId = parameters.batchId || 1;

		// set up batch key and deferred promises
		const key = parameters.batched ? `${parameters.profile?.siteId || parameters.siteId}:${batchId}` : `${Math.random()}:${batchId}`;
		const batch = (this.batches[key] = this.batches[key] || { timeout: null, request: { profiles: [] }, entries: [] });
		const deferred = new Deferred();

		// add each request to the list
		batch.entries.push({ request: parameters, deferred: deferred });

		// wait for all of the requests to come in
		const timeoutClear = typeof window !== 'undefined' ? window.clearTimeout : clearTimeout;
		const timeoutSet = typeof window !== 'undefined' ? window.setTimeout : setTimeout;
		timeoutClear && timeoutClear(batch.timeout);
		batch.timeout = timeoutSet(async () => {
			// delete the batch so a new one can take its place
			delete this.batches[key];

			// resort batch entries based on order
			batch.entries.sort(sortBatchEntries);

			// now that the requests are in proper order, map through them and build out the batches
			batch.entries.map((entry) => {
				// use products request only and combine when needed
				if (entry.request.product) {
					if (Array.isArray(entry.request.products) && entry.request.products.indexOf(entry.request.product) == -1) {
						entry.request.products = entry.request.products.concat(entry.request.product);
					} else {
						entry.request.products = [entry.request.product];
					}
				}

				// build profile specific parameters
				if (entry.request.profile) {
					const {
						tag,
						profile: { categories, brands, blockedItems, limit, query, filters, dedupe },
					} = entry.request;

					const profile: RecommendPostRequestProfileModel = {
						tag,
						...defined({
							categories,
							brands,
							blockedItems,
							limit: limit,
							searchTerm: query,
							filters: transformRecommendationFiltersPost(filters),
							dedupe,
						}),
					};

					batch.request.profiles?.push(profile);
				} else {
					const { tag, categories, brands, limit, query, dedupe } = entry.request;

					const profile: RecommendPostRequestProfileModel = {
						tag,
						...defined({
							categories,
							brands,
							limit: limit,
							searchTerm: query,
							dedupe,
						}),
					};

					batch.request.profiles?.push(profile);
				}

				// parameters used globally
				const { products, blockedItems, filters, test, cart, lastViewed, shopper } = entry.request;
				batch.request = {
					...batch.request,
					...defined({
						siteId: entry.request.profile?.siteId || entry.request.siteId,
						products,
						blockedItems,
						filters: transformRecommendationFiltersPost(filters),
						test,
						cart,
						lastViewed,
						shopper,
					}),
				};
			});

			try {
				if (this.configuration.mode == AppMode.development) {
					batch.request.test = true;
				}

				const response = await this.postRecommendations(batch.request as RecommendPostRequestModel);

				batch.entries?.forEach((entry, index) => {
					entry.deferred.resolve(response[index]);
				});
			} catch (err) {
				batch.entries?.forEach((entry) => {
					entry.deferred.reject(err);
				});
			}
		}, BATCH_TIMEOUT);

		return deferred.promise;
	}

	async postRecommendations(requestParameters: RecommendPostRequestModel): Promise<RecommendResponseModel[]> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'text/plain';

		const siteId = requestParameters.siteId;
		const path = `/boost/${siteId}/recommend`;

		const response = await this.request(
			{
				path,
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			JSON.stringify(requestParameters)
		);

		return response as unknown as RecommendResponseModel[];
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

type DefinedProps = {
	[key: string]: any;
};

export function defined(properties: Record<string, any>): DefinedProps {
	const definedProps: DefinedProps = {};

	Object.keys(properties).map((key) => {
		if (properties[key] !== undefined) {
			definedProps[key] = properties[key];
		}
	});

	return definedProps;
}
