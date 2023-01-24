import deepmerge from 'deepmerge';

import { AbstractController } from '../Abstract/AbstractController';
import { StorageStore, StorageType, ErrorType } from '@searchspring/snap-store-mobx';
import { getSearchParams } from '../utils/getParams';
import { ControllerTypes } from '../types';

import type { BeaconEvent } from '@searchspring/snap-tracker';
import type { SearchStore } from '@searchspring/snap-store-mobx';
import type { SearchControllerConfig, BeforeSearchObj, AfterSearchObj, AfterStoreObj, ControllerServices, ContextVariables } from '../types';
import type { Next } from '@searchspring/snap-event-manager';
import type { SearchRequestModel, SearchResponseModelResult, SearchRequestModelSearchRedirectResponseEnum } from '@searchspring/snapi-types';

const HEIGHT_CHECK_INTERVAL = 50;

const defaultConfig: SearchControllerConfig = {
	id: 'search',
	globals: {},
	settings: {
		redirects: {
			merchandising: true,
			singleResult: true,
		},
		facets: {
			trim: true,
			pinFiltered: true,
			storeRange: true,
			autoOpenActive: true,
		},
	},
};

type SearchTrackMethods = {
	product: {
		click: (e: MouseEvent, result: any) => BeaconEvent | undefined;
	};
};

export class SearchController extends AbstractController {
	public type = ControllerTypes.search;
	declare store: SearchStore;
	declare config: SearchControllerConfig;
	storage: StorageStore;
	private previousResults: Array<SearchResponseModelResult> = [];

	constructor(
		config: SearchControllerConfig,
		{ client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices,
		context?: ContextVariables
	) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker }, context);

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);

		if (this.config.settings?.infinite && typeof this.config.settings.infinite.restorePosition == 'undefined') {
			this.config.settings.infinite.restorePosition = true;
		}

		this.store.setConfig(this.config);

		this.storage = new StorageStore({
			type: StorageType.SESSION,
			key: `ss-controller-${this.config.id}`,
		});

		// set last params to undefined for compare in search
		this.storage.set('lastStringyParams', undefined);

		// add 'beforeSearch' middleware
		this.eventManager.on('beforeSearch', async (search: BeforeSearchObj, next: Next): Promise<void | boolean> => {
			search.controller.store.loading = true;

			await next();
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (search: AfterSearchObj, next: Next): Promise<void | boolean> => {
			const config = search.controller.config as SearchControllerConfig;
			const redirectURL = search.response?.merchandising?.redirect;
			const searchStore = search.controller.store as SearchStore;
			if (redirectURL && config?.settings?.redirects?.merchandising && !search?.response?.filters?.length && !searchStore.loaded) {
				window.location.replace(redirectURL);
				return false;
			}

			if (
				config?.settings?.redirects?.singleResult &&
				search?.response?.search?.query &&
				search?.response?.pagination?.totalResults === 1 &&
				!search?.response?.filters?.length
			) {
				window.location.replace(search?.response.results[0].mappings.core.url);
				return false;
			}

			await next();
		});

		this.eventManager.on('afterStore', async (search: AfterStoreObj, next: Next): Promise<void | boolean> => {
			await next();

			search.controller.store.loading = false;

			// save last params
			this.storage.set('lastStringyParams', JSON.stringify(search.request));

			const storableRequestParams = getStorableRequestParams(search.request);

			const stringyParams = JSON.stringify(storableRequestParams);
			const infiniteSettings = this.config.settings?.infinite;
			if (infiniteSettings?.restorePosition) {
				const scrollMap = this.storage.get('scrollMap') || {};
				// interval we ony need to keep checking until the page height > than our stored value
				const scrollToPosition = scrollMap[stringyParams];

				if (scrollToPosition) {
					let checkCount = 0;
					const offset = () => {
						window.scrollBy(0, infiniteSettings?.restorePositionOffset!);
					};
					const checker = window.setInterval(() => {
						//selector or coordinates?
						if (infiniteSettings?.restorePositionSelector) {
							const elem = document.querySelector(`${infiniteSettings?.restorePositionSelector} a[href="${scrollToPosition}"]`);
							if (elem) {
								//delayed?
								if (infiniteSettings?.restorePositionDelay) {
									setTimeout(() => {
										elem.scrollIntoView();
										if (infiniteSettings?.restorePositionOffset) {
											offset();
										}
									}, infiniteSettings?.restorePositionDelay);
								} else {
									elem.scrollIntoView();
								}
								this.log.debug('scrolling to: ', elem);
								window.clearInterval(checker);
							}
						} else {
							if (document.documentElement.scrollHeight >= scrollToPosition) {
								if (infiniteSettings?.restorePositionDelay) {
									setTimeout(() => {
										window.scrollTo(0, scrollToPosition);
										if (infiniteSettings?.restorePositionOffset) {
											offset();
										}
									}, infiniteSettings?.restorePositionDelay);
								} else {
									window.scrollTo(0, scrollToPosition);
								}

								this.log.debug('scrolling to: ', scrollMap[stringyParams]);
								window.clearInterval(checker);
							}
						}

						if (infiniteSettings?.restorePositionOffset && !infiniteSettings.restorePositionDelay) {
							offset();
						}

						if (checkCount > 2000 / HEIGHT_CHECK_INTERVAL) {
							window.clearInterval(checker);
						}
						checkCount++;
					}, HEIGHT_CHECK_INTERVAL);
				}
			}
		});

		// attach config plugins and event middleware
		this.use(this.config);
	}

	track: SearchTrackMethods = {
		product: {
			click: (e: MouseEvent, result): BeaconEvent | undefined => {
				// store scroll position
				if (this.config.settings?.infinite) {
					let stringyParams = this.storage.get('lastStringyParams');
					stringyParams = JSON.parse(stringyParams);

					const storableRequestParams = getStorableRequestParams(stringyParams);
					stringyParams = JSON.stringify(storableRequestParams);

					const scrollMap: any = {};
					if (this.config.settings?.infinite?.restorePositionSelector) {
						//lets check for the href in the target first.
						if ((e.currentTarget as HTMLAnchorElement)?.attributes['href' as any]?.value) {
							scrollMap[stringyParams] = (e.currentTarget as HTMLAnchorElement)?.attributes['href' as any]?.value;
						} else {
							//couldnt find it in the target? we can grab it from the result mappings.
							scrollMap[stringyParams] = result.mappings.core.url;
						}
					} else {
						scrollMap[stringyParams] = window.scrollY;
					}
					this.storage.set('scrollMap', scrollMap);
				}

				// track
				const { intellisuggestData, intellisuggestSignature } = result.attributes;
				const target = e.target as HTMLAnchorElement;
				const href = target?.href || result.mappings.core?.url || undefined;

				const event = this.tracker.track.product.click({
					intellisuggestData,
					intellisuggestSignature,
					href,
				});

				this.eventManager.fire('track.product.click', { controller: this, event: e, result, trackEvent: event });
				return event;
			},
		},
	};

	get params(): SearchRequestModel {
		const params: SearchRequestModel = deepmerge({ ...getSearchParams(this.urlManager.state) }, this.config.globals || {});

		// redirect setting
		if (!this.config.settings?.redirects?.merchandising || this.store.loaded) {
			params.search = params.search || {};
			params.search.redirectResponse = 'full' as SearchRequestModelSearchRedirectResponseEnum;
		}

		params.tracking = params.tracking || {};
		params.tracking.domain = window.location.href;

		const userId = this.tracker.getUserId();
		if (userId) {
			params.tracking.userId = userId;
		}

		const sessionId = this.tracker.getContext().sessionId;
		if (sessionId) {
			params.tracking.sessionId = sessionId;
		}

		const pageId = this.tracker.getContext().pageLoadId;
		if (pageId) {
			params.tracking.pageLoadId = pageId;
		}

		if (!this.config.globals?.personalization?.disabled) {
			const cartItems = this.tracker.cookies.cart.get();
			if (cartItems.length) {
				params.personalization = params.personalization || {};
				params.personalization.cart = cartItems.join(',');
			}

			const lastViewedItems = this.tracker.cookies.viewed.get();
			if (lastViewedItems.length) {
				params.personalization = params.personalization || {};
				params.personalization.lastViewed = lastViewedItems.join(',');
			}

			const shopperId = this.tracker.getShopperId();
			if (shopperId) {
				params.personalization = params.personalization || {};
				params.personalization.shopper = shopperId;
			}
		}

		return params;
	}

	search = async (): Promise<void> => {
		if (!this.initialized) {
			await this.init();
		}

		const params = this.params;

		try {
			try {
				await this.eventManager.fire('beforeSearch', {
					controller: this,
					request: params,
				});
			} catch (err: any) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'beforeSearch' middleware cancelled`);
					return;
				} else {
					this.log.error(`error in 'beforeSearch' middleware`);
					throw err;
				}
			}

			const stringyParams = JSON.stringify(params);
			const prevStringyParams = this.storage.get('lastStringyParams');
			if (stringyParams == prevStringyParams) {
				// no param change - not searching
				return;
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			let meta: any;
			let response: any;

			// infinite functionality
			// if params.page > 1 and infinite setting exists we should append results
			if (this.config.settings?.infinite && params.pagination?.page! > 1) {
				const preventBackfill =
					this.config.settings.infinite?.backfill && !this.store.results.length && params.pagination?.page! > this.config.settings.infinite.backfill;
				const dontBackfill = !this.config.settings.infinite?.backfill && !this.store.results.length && params.pagination?.page! > 1;
				//if the page is higher than the backfill setting redirect back to page 1
				if (preventBackfill || dontBackfill) {
					this.storage.set('scrollMap', {});
					this.urlManager.set('page', 1).go();
					return;
				}

				// if no results fetch results...
				let previousResults = this.previousResults;
				const backfills = [];

				let pageSize = params.pagination?.pageSize || this.store.pagination.pageSize || this.store.pagination.defaultPageSize;
				if (this.config.settings?.infinite.backfill && !previousResults.length) {
					// figure out how many pages of results to backfill and wait on all responses
					if (!pageSize) {
						//unfortunatly we need to fetch meta to know the default pagesize before we can continue.
						const meta = await this.client.meta();
						pageSize = meta.pagination?.defaultPageSize!;
					}

					let pagesNeeded1 =
						params.pagination?.page && params.pagination?.page > this.config.settings?.infinite.backfill
							? this.config.settings?.infinite.backfill
							: params.pagination?.page;
					let totalResultsNeeded = pageSize * (pagesNeeded1 || 1);

					const apiLimit = 500;
					// our search api is limited to a certain amount per request.
					//so we will need to make more than one request if totalresultsneeded is greater.
					if (totalResultsNeeded < apiLimit) {
						const backfillParams = deepmerge({ ...params }, { pagination: { pageSize: totalResultsNeeded, page: 1 } });
						backfills.push(this.client.search(backfillParams));
					} else {
						//how many pages are needed?
						let pagesNeeded = Math.ceil(totalResultsNeeded / apiLimit);
						// we dont want to get the full apiLimit # of results on the last page, so lets find out how many are left.
						let lastPageCount = apiLimit - (pagesNeeded * apiLimit - totalResultsNeeded);

						for (let i = 1; i <= pagesNeeded; i++) {
							const backfillParams = deepmerge({ ...params }, { pagination: { pageSize: i < pagesNeeded ? apiLimit : lastPageCount, page: i } });
							backfills.push(this.client.search(backfillParams));
						}
					}
				}

				//infinite backfill and prev results
				// use the previous results and only make request for new result
				if (backfills && backfills.length) {
					let backfillResults: any = [];
					const backfillResponses = await Promise.all(backfills);
					backfillResponses.map(([Bmeta, Bresponse]) => {
						if (!meta) {
							meta = Bmeta;
						}
						if (!response) {
							response = Bresponse;
							backfillResults = response.results;
						} else {
							backfillResults = backfillResults.concat(Bresponse.results!);
						}
					});

					if (!response.meta) {
						/**
						 * MockClient will overwrite the client search() method and use
						 * SearchData to return mock data which already contains meta data
						 */
						// @ts-ignore
						response.meta = meta;
					}

					//we need to overwrite the pagination params so the ui doesnt get confused.
					response.pagination.pageSize = pageSize;
					response.pagination.totalPages = Math.ceil(response.pagination.totalResults / response.pagination.pageSize);
					response.pagination.page = params.pagination?.page;

					//set the response results after all backfill promises are resolved.
					response.results = backfillResults;
				} else {
					// infinite with no backfills.
					[meta, response] = await this.client.search(params);
					// @ts-ignore
					if (!response.meta) {
						/**
						 * MockClient will overwrite the client search() method and use
						 * SearchData to return mock data which already contains meta data
						 */
						// @ts-ignore
						response.meta = meta;
					}
					//append new results to previous results
					response.results = [...previousResults, ...(response.results || [])];
				}
			} else {
				//standard.
				[meta, response] = await this.client.search(params);
				// @ts-ignore
				if (!response.meta) {
					/**
					 * MockClient will overwrite the client search() method and use
					 * SearchData to return mock data which already contains meta data
					 */
					// @ts-ignore
					response.meta = meta;
				}
			}

			searchProfile.stop();
			this.log.profile(searchProfile);

			const afterSearchProfile = this.profiler.create({ type: 'event', name: 'afterSearch', context: params }).start();

			try {
				await this.eventManager.fire('afterSearch', {
					controller: this,
					request: params,
					response,
				});
			} catch (err: any) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterSearch' middleware cancelled`);
					afterSearchProfile.stop();
					return;
				} else {
					this.log.error(`error in 'afterSearch' middleware`);
					throw err;
				}
			}

			afterSearchProfile.stop();
			this.log.profile(afterSearchProfile);

			// store previous results for infinite usage
			if (this.config.settings?.infinite) {
				this.previousResults = JSON.parse(JSON.stringify(response.results));
			}

			// update the store
			this.store.update(response);

			const afterStoreProfile = this.profiler.create({ type: 'event', name: 'afterStore', context: params }).start();

			try {
				await this.eventManager.fire('afterStore', {
					controller: this,
					request: params,
					response,
				});
			} catch (err: any) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterStore' middleware cancelled`);
					afterStoreProfile.stop();
					return;
				} else {
					this.log.error(`error in 'afterStore' middleware`);
					throw err;
				}
			}

			afterStoreProfile.stop();
			this.log.profile(afterStoreProfile);
		} catch (err) {
			if (err) {
				switch (err) {
					case 429:
						this.store.error = {
							code: 429,
							type: ErrorType.WARNING,
							message: 'Too many requests try again later',
						};
						this.log.warn(this.store.error);
						break;
					case 500:
						this.store.error = {
							code: 500,
							type: ErrorType.ERROR,
							message: 'Invalid Search Request or Service Unavailable',
						};
						this.log.error(this.store.error);
						break;
					default:
						this.log.error(err);
						break;
				}
				this.store.loading = false;
				this.handleError(err);
			}
		}
	};
}

export function getStorableRequestParams(request: SearchRequestModel): SearchRequestModel {
	return {
		siteId: request.siteId,
		sorts: request.sorts,
		search: {
			query: {
				string: request?.search?.query?.string || '',
			},
			subQuery: request?.search?.subQuery || '',
		},
		filters: request.filters,
		pagination: request.pagination,
		facets: request.facets,
		merchandising: {
			landingPage: request.merchandising?.landingPage || '',
		},
	};
}
