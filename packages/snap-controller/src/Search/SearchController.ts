import deepmerge from 'deepmerge';
import cssEscape from 'css.escape';

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
	ElementPositionObj,
} from '../types';
import type { Next } from '@searchspring/snap-event-manager';
import type { SearchRequestModel, SearchResponseModelResult, SearchRequestModelSearchRedirectResponseEnum } from '@searchspring/snapi-types';

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
			const scrollMap: { [key: string]: ElementPositionObj } = this.storage.get('scrollMap') || {};
			const elementPosition = scrollMap[stringyParams];
			if (!elementPosition) {
				// search params have changed - empty the scrollMap
				this.storage.set('scrollMap', {});
			}

			await this.eventManager.fire('restorePosition', { controller: this, element: elementPosition });

			search.controller.store.loading = false;
		});

		// restore position
		if (this.config.settings?.restorePosition?.enabled) {
			this.eventManager.on('restorePosition', async ({ controller, element }: RestorePositionObj, next: Next) => {
				const scrollToPosition = () => {
					return new Promise<void>(async (resolve) => {
						const maxCheckTime = 500;
						const checkTime = 50;
						const maxScrolls = Math.ceil(maxCheckTime / checkTime);
						const maxCheckCount = maxScrolls + 2;

						let scrollBackCount = 0;
						let checkCount = 0;
						let scrolledElem: Element | undefined = undefined;

						const checkAndScroll = () => {
							let offset = element?.domRect?.top || 0;
							let elem = document.querySelector(element?.selector!);

							// for case where the element clicked on has no height
							while (elem && !elem.getBoundingClientRect().height) {
								elem = elem.parentElement;
								// original offset no longer applies since using different element
								offset = 0;
							}

							if (elem) {
								const { y } = elem.getBoundingClientRect();

								scrollBackCount++;

								// if the offset is off, we need to scroll into position (can be caused by lazy loaded images)
								if (y > offset + 1 || y < offset - 1) {
									window.scrollBy(0, y - offset);
								} else {
									// don't need to scroll - it is right where we want it
									scrolledElem = elem;
								}
							} else {
								checkCount++;
							}

							return true;
						};

						while (checkAndScroll() && scrollBackCount <= maxScrolls && checkCount <= maxCheckCount) {
							await new Promise((resolve) => setTimeout(resolve, checkTime));
						}

						if (scrolledElem) {
							controller.log.debug('restored position to: ', scrolledElem);
						} else {
							controller.log.debug('attempted to scroll back to element with selector: ', element?.selector);
						}

						resolve();
					});
				};

				if (element) await scrollToPosition();
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
				const resultHref = result.mappings.core?.url;
				const elemHref = target?.getAttribute('href');

				// the href that should be used for restoration - if the elemHref contains the resultHref - use resultHref
				const storedHref = elemHref?.indexOf(resultHref) != -1 ? resultHref : elemHref || resultHref;

				const scrollMap: { [key: string]: ElementPositionObj } = {};

				// generate the selector using element class and parent classes
				const selector = generateHrefSelector(target, storedHref);
				const domRect = selector ? document?.querySelector(selector)?.getBoundingClientRect() : undefined;

				// store element position data to scrollMap
				if (selector || storedHref || domRect) {
					try {
						const stringyParams = JSON.parse(this.storage.get('lastStringyParams'));
						const storableRequestParams = getStorableRequestParams(stringyParams);
						const storableStringyParams = JSON.stringify(storableRequestParams);

						scrollMap[storableStringyParams] = { domRect, href: storedHref, selector };
					} catch (err) {
						// failed to get lastStringParams
						this.log.warn('Failed to save scollMap!', err);
					}
				}

				// store position data or empty object
				this.storage.set('scrollMap', scrollMap);

				// track
				const { intellisuggestData, intellisuggestSignature } = result.attributes;

				const event = this.tracker.track.product.click({
					intellisuggestData,
					intellisuggestSignature,
					href: elemHref || resultHref,
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
					const backfillResults: SearchResponseModelResult[] = [];

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
						// @ts-ignore : MockClient will overwrite the client search() method and use SearchData to return mock data which already contains meta data
						response.meta = meta;
					}
				} else {
					// infinite with no backfills.
					[meta, response] = await this.client.search(params);
					// @ts-ignore : MockClient will overwrite the client search() method and use SearchData to return mock data which already contains meta data
					if (!response.meta) {
						// @ts-ignore : MockClient will overwrite the client search() method and use SearchData to return mock data which already contains meta data
						response.meta = meta;
					}
					//append new results to previous results
					response.results = [...this.previousResults, ...(response.results || [])];
				}
			} else {
				//standard.
				[meta, response] = await this.client.search(params);
				// @ts-ignore : MockClient will overwrite the client search() method and use SearchData to return mock data which already contains meta data
				if (!response.meta) {
					// @ts-ignore : MockClient will overwrite the client search() method and use SearchData to return mock data which already contains meta data
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
		} catch (err: any) {
			if (err) {
				if (err.err && err.fetchDetails) {
					switch (err.fetchDetails.status) {
						case 429: {
							this.store.error = {
								code: 429,
								type: ErrorType.WARNING,
								message: 'Too many requests try again later',
							};
							break;
						}

						case 500: {
							this.store.error = {
								code: 500,
								type: ErrorType.ERROR,
								message: 'Invalid Search Request or Service Unavailable',
							};
							break;
						}

						default: {
							this.store.error = {
								type: ErrorType.ERROR,
								message: err.err.message,
							};
							break;
						}
					}

					this.log.error(this.store.error);
					this.handleError(err.err, err.fetchDetails);
				} else {
					this.store.error = {
						type: ErrorType.ERROR,
						message: `Something went wrong... - ${err}`,
					};
					this.log.error(err);
					this.handleError(err);
				}
				this.store.loading = false;
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

export function generateHrefSelector(element: HTMLElement, href: string, levels = 7): string | undefined {
	let level = 0;
	let elem: HTMLElement | null = element;

	while (elem && level <= levels) {
		// check within
		const innerHrefElem = elem.querySelector(`[href*="${href}"]`) as HTMLElement;
		if (innerHrefElem) {
			// innerHrefElem was found! now get selectors up to elem that contained it
			let selector = '';
			let parentElem: HTMLElement | null = innerHrefElem;

			while (parentElem && parentElem != elem.parentElement) {
				const classNames = parentElem.classList.value.trim().split(' ');
				// document.querySelector does not appreciate special characters - must escape them
				const escapedClassSelector = classNames.reduce(
					(classes, classname) => (classname.trim() ? `${classes}.${cssEscape(classname.trim())}` : classes),
					''
				);
				selector = `${parentElem.tagName}${escapedClassSelector}${selector ? ` ${selector}` : ''}`;

				parentElem = parentElem.parentElement;
			}

			return `${selector}[href*="${href}"]`;
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
