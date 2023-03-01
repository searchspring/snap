import deepmerge from 'deepmerge';

import { AbstractController } from '../Abstract/AbstractController';
import { StorageStore, StorageType, ErrorType } from '@searchspring/snap-store-mobx';
import { getSearchParams } from '../utils/getParams';
import { ControllerTypes } from '../types';

import type { BeaconEvent } from '@searchspring/snap-tracker';
import type { SearchStore } from '@searchspring/snap-store-mobx';
import type {
	SearchControllerConfig,
	BeforeSearchObj,
	AfterSearchObj,
	AfterStoreObj,
	ControllerServices,
	ContextVariables,
	RestorePositionObj,
	PositionObj,
} from '../types';
import type { Next } from '@searchspring/snap-event-manager';
import type { SearchRequestModel, SearchResponseModelResult, SearchRequestModelSearchRedirectResponseEnum } from '@searchspring/snapi-types';

const HEIGHT_CHECK_INTERVAL = 50;
const API_LIMIT = 500;

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

		// set restorePosition to be enabled by default when using infinite (if not provided)
		if (this.config.settings?.infinite && typeof this.config.settings.restorePosition == 'undefined') {
			this.config.settings.restorePosition = { enabled: true };
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

			const nonBackgroundFilters = search?.request?.filters?.filter((filter) => !filter.background);
			if (
				config?.settings?.redirects?.singleResult &&
				search?.response?.search?.query &&
				search?.response?.pagination?.totalResults === 1 &&
				!nonBackgroundFilters?.length &&
				!(search.controller as SearchController).previousResults.length
			) {
				window.location.replace(search?.response.results[0].mappings.core.url);
				return false;
			}

			await next();
		});

		this.eventManager.on('afterStore', async (search: AfterStoreObj, next: Next): Promise<void | boolean> => {
			await next();

			// save last params
			this.storage.set('lastStringyParams', JSON.stringify(search.request));

			// get scrollTo positioning and send it to 'restorePosition' event
			const storableRequestParams = getStorableRequestParams(search.request);
			const stringyParams = JSON.stringify(storableRequestParams);
			const scrollMap: { [key: string]: PositionObj } = this.storage.get('scrollMap') || {};
			const position = scrollMap[stringyParams];
			if (position) await this.eventManager.fire('restorePosition', { controller: this, position });

			search.controller.store.loading = false;
		});

		// restore position
		if (this.config.settings?.restorePosition?.enabled) {
			this.eventManager.on('restorePosition', async ({ controller, position }: RestorePositionObj, next: Next) => {
				const scrollToPosition = () => {
					return new Promise<void>((resolve) => {
						const checkTime = 70;
						const maxScrolls = 7;

						let checkCount = 0;
						let scrollBackCount = 0;

						const completeCheck = () => {
							window.clearInterval(checkInterval);

							resolve();
						};

						const checkInterval = window.setInterval(async () => {
							const elem = document.querySelector(position.selector!);

							if (elem) {
								const { y } = elem.getBoundingClientRect();

								if (y > 1 || y < -1) {
									elem.scrollIntoView();
									if (this.config.settings?.restorePosition?.offset) {
										window.scrollBy(0, this.config.settings?.restorePosition.offset);
									}
									if (!scrollBackCount) controller.log.debug('restored position to: ', elem);
									scrollBackCount++;
								}

								// stop scrolling back after max
								if (scrollBackCount > maxScrolls) {
									completeCheck();
								}
							}

							if (checkCount > 700 / checkTime) {
								if (!elem) controller.log.debug('could not locate element with selector: ', position.selector);
								completeCheck();
							}

							checkCount++;
						}, checkTime);
					});
				};

				if (position.selector) await scrollToPosition();
				await next();
			});
		}

		// attach config plugins and event middleware
		this.use(this.config);
	}

	track: SearchTrackMethods = {
		product: {
			click: (e: MouseEvent, result): BeaconEvent | undefined => {
				const target = e.target as HTMLAnchorElement;
				const href = target?.href || result.mappings.core?.url;

				// store scroll position
				const stringyParams = JSON.parse(this.storage.get('lastStringyParams'));
				const storableRequestParams = getStorableRequestParams(stringyParams);
				const storableStringyParams = JSON.stringify(storableRequestParams);
				const scrollMap: { [key: string]: PositionObj } = {};

				// generate the selector using element class and parent classes
				const selector = generateHrefSelector(target, href);

				// store position data to scrollMap
				scrollMap[storableStringyParams] = { selector, href, x: window?.scrollX, y: window?.scrollY };
				this.storage.set('scrollMap', scrollMap);

				// track
				const { intellisuggestData, intellisuggestSignature } = result.attributes;

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

		if (this.params.search?.query?.string && this.params.search?.query?.string.length) {
			// save it to the history store
			this.store.history.save(this.params.search.query.string);
		}

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
			if (this.config.settings?.infinite && params.pagination?.page && params.pagination.page > 1) {
				const preventBackfill =
					this.config.settings.infinite?.backfill && !this.store.results.length && params.pagination.page > this.config.settings.infinite.backfill;
				const dontBackfill = !this.config.settings.infinite?.backfill && !this.store.results.length;
				// if the page is higher than the backfill setting redirect back to page 1
				if (preventBackfill || dontBackfill) {
					this.storage.set('scrollMap', {});
					this.urlManager.set('page', 1).go();
					return;
				}

				const backfills = [];
				let pageSize = params.pagination?.pageSize || this.store.pagination.pageSize || this.store.pagination.defaultPageSize;

				// if no results fetch results...
				if (this.config.settings?.infinite.backfill && !this.previousResults.length) {
					if (!pageSize) {
						// pageSize is unknown - need to fetch meta to know defaultPageSize before we can continue
						const meta = await this.client.meta();
						pageSize = meta.pagination?.defaultPageSize!;
					}

					// restricting pageSize to the limit
					pageSize = pageSize > API_LIMIT ? API_LIMIT : pageSize;

					const pagesNeeded =
						params.pagination?.page && params.pagination?.page > this.config.settings?.infinite.backfill
							? this.config.settings?.infinite.backfill
							: params.pagination?.page;

					// figure out how many pages of results to backfill and wait on all responses
					const { size: backFillPageSize, pages: backFillPages } = backFillSize(pagesNeeded, pageSize);

					for (let i = 1; i <= backFillPages; i++) {
						const backfillParams = deepmerge({ ...params }, { pagination: { pageSize: backFillPageSize, page: i } });
						backfills.push(this.client.search(backfillParams));
					}
				}

				// infinite backfill results
				if (backfills && backfills.length) {
					// array to hold all results from backfill responses
					let backfillResults: SearchResponseModelResult[] = [];

					const backfillResponses = await Promise.all(backfills);
					backfillResponses.map(([metaBackfill, responseBackfill]) => {
						if (!meta) {
							meta = metaBackfill;
						}
						if (!response) {
							response = responseBackfill;
						}

						// push results to array
						if (responseBackfill.results) {
							backfillResults.push(...responseBackfill.results);
						}
					});

					// overwrite pagination params to expected state
					response.pagination.pageSize = pageSize;
					response.pagination.totalPages = Math.ceil(response.pagination.totalResults / response.pagination.pageSize);
					response.pagination.page = params.pagination?.page;

					// set the response results with results from backfill responses
					response.results = backfillResults;

					if (!response.meta) {
						/**
						 * MockClient will overwrite the client search() method and use
						 * SearchData to return mock data which already contains meta data
						 */
						// @ts-ignore
						response.meta = meta;
					}
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
					response.results = [...this.previousResults, ...(response.results || [])];
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

function generateHrefSelector(element: HTMLElement, href: string, levels = 6): string | undefined {
	let level = 0;
	let elem: HTMLElement | null = element;

	while (elem && level < levels) {
		// check within
		const innerElemHref = elem.querySelector(`[href="${href}"]`) as HTMLElement;
		if (innerElemHref) {
			return `${elem.tagName}.${elem.classList.value.replace(/\s/g, '.')} [href="${href}"]`;
		}

		elem = elem.parentElement;
		level++;
	}

	return;
}

function backFillSize(pages: number, pageSize: number) {
	const totalResults = pages * pageSize;
	let numPages = Math.ceil(totalResults / API_LIMIT);

	while (totalResults % numPages) numPages++;

	return { size: totalResults / numPages, pages: numPages };
}
