import { API, ApiConfiguration } from './Abstract';
import { HTTPHeaders, filtersObj, PostRecommendRequestModel, filter, GetRecommendRequestModel } from '../../types';
import { AppMode, charsParams } from '@searchspring/snap-toolbox';

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
				const { tags, categories, ...otherParams } = entry.request;
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

				batch.request.limits = (batch.request.limits as number[]).concat(limits);
				batch.request = { ...batch.request, ...otherParams };
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

					// //transform filters here
					if (batch.request.filters) {
						(batch.request as PostRecommendRequestModel)['filters'] = this.transformFilters(batch.request.filters, 'POST') as filtersObj[];
					}

					response = await this.postRecommendations(batch.request as PostRecommendRequestModel);
				} else {
					if (batch.request.filters) {
						const filters = this.transformFilters(batch.request.filters, 'GET');
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

	transformFilters(filters: filter[], type: 'POST' | 'GET') {
		if (type == 'POST') {
			const filterArray: filtersObj[] = [];
			filters.map((filter) => {
				if (filter.type == 'value') {
					//check if filterArray contains a filter for this value already
					const i = filterArray.findIndex((_filter) => _filter.field == filter.field);
					if (i > -1) {
						//if so just push another value to the already existing obj
						(filterArray[i].values as string[]).push(filter.value);
					} else {
						//else create a new one
						const val = {
							field: filter.field,
							type: '=' as const,
							values: [filter.value],
						};

						filterArray.push(val);
					}
				} else if (filter.type == 'range') {
					//low
					if (typeof filter.value.low == 'number') {
						const low = {
							field: filter.field,
							type: '>=' as const,
							values: [filter.value.low as number],
						};
						filterArray.push(low);
					}
					//high
					if (typeof filter.value.high == 'number') {
						const high = {
							field: filter.field,
							type: '<=' as const,
							values: [filter.value.high as number],
						};
						filterArray.push(high);
					}
				}
			});

			return filterArray;
		} else if (type == 'GET') {
			const filterArray: {
				[filter: `filter.${string}`]: string | number | string[] | number[];
			} = {};

			filters.map((filter) => {
				if (filter.type == 'value') {
					//check if filterArray contains a filter for this value already
					if (filterArray[`filter.${filter.field}`]) {
						// is the existing filter an array already? or just a single value
						if (typeof filterArray[`filter.${filter.field}`] == 'string') {
							filterArray[`filter.${filter.field}`] = [filterArray[`filter.${filter.field}`] as string, filter.value];
						} else {
							(filterArray[`filter.${filter.field}`] as string[]).push(filter.value);
						}
					} else {
						//else create a new one
						filterArray[`filter.${filter.field}`] = filter.value;
					}
				} else if (filter.type == 'range') {
					if (typeof filter.value.low == 'number') {
						filterArray[`filter.${filter.field}.low`] = filter.value.low;
					}
					if (typeof filter.value.high == 'number') {
						filterArray[`filter.${filter.field}.high`] = filter.value.high;
					}
				}
			});
			return filterArray;
		}
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
