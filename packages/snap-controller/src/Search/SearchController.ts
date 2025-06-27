import deepmerge from 'deepmerge';
import cssEscape from 'css.escape';

import { AbstractController } from '../Abstract/AbstractController';
import { StorageStore, ErrorType } from '@searchspring/snap-store-mobx';
import { getSearchParams } from '../utils/getParams';
import { ControllerTypes } from '../types';

import type { Product, Banner, SearchStore } from '@searchspring/snap-store-mobx';
import type {
	SearchControllerConfig,
	AfterSearchObj,
	AfterStoreObj,
	ControllerServices,
	ContextVariables,
	RestorePositionObj,
	ElementPositionObj,
	BeforeSearchObj,
} from '../types';
import type { Next } from '@searchspring/snap-event-manager';
import type {
	SearchRequestModel,
	SearchResponseModelResult,
	SearchRequestModelSearchRedirectResponseEnum,
	MetaResponseModel,
	SearchResponseModel,
	SearchRequestModelFilterRange,
	SearchRequestModelFilterValue,
	SearchRequestModelFilter,
} from '@searchspring/snapi-types';
import type {
	AutocompleteAddtocartSchemaDataBgfilterInner,
	AutocompleteAddtocartSchemaDataFilterInner,
	AutocompleteAddtocartSchemaDataSortInnerDirEnum,
	Product as BeaconProduct,
	SearchAddtocartSchemaData,
	SearchRedirectSchemaData,
	SearchSchemaData,
	SearchSchemaDataMatchTypeEnum,
} from '@searchspring/beacon';
import { CLICK_DUPLICATION_TIMEOUT, isClickWithinProductLink } from '../utils/isClickWithinProductLink';

const BACKGROUND_FILTER_FIELD_MATCHES = ['collection', 'category', 'categories', 'hierarchy'];
const BACKGROUND_FILTERS_VALUE_FLAGS = [1, 0, '1', '0', 'true', 'false', true, false];

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
		clickThrough: (e: MouseEvent, result: Product) => void;
		click: (e: MouseEvent, result: Product | Banner) => void;
		render: (result: Product) => void;
		impression: (result: Product) => void;
		addToCart: (results: Product) => void;
	};
	redirect: (redirectURL: string) => void;
};

const schemaMap: Record<string, SearchSchemaData> = {};
export class SearchController extends AbstractController {
	public type = ControllerTypes.search;
	declare store: SearchStore;
	declare config: SearchControllerConfig;
	storage: StorageStore;
	private previousResults: Array<SearchResponseModelResult> = [];
	private pageType: 'search' | 'category' = 'search';
	private events: {
		product: Record<
			string,
			{
				click?: boolean;
				clickThrough?: boolean;
				impression?: boolean;
				render?: boolean;
			}
		>;
	} = { product: {} };

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
			type: 'session',
			key: `ss-controller-${this.config.id}`,
		});

		// set last params to undefined for compare in search
		this.storage.set('lastStringyParams', undefined);

		this.eventManager.on('beforeSearch', async ({ request }: BeforeSearchObj, next: Next): Promise<void | boolean> => {
			// wait for other middleware to resolve
			await next();

			if (this.context?.pageType === 'category') {
				this.pageType = 'category';
				return;
			}

			const req = request as SearchRequestModel;
			const query = req.search?.query;
			if (!query) {
				const hasCategoryBackgroundFilters = req.filters
					?.filter((filter) => filter.background)
					.filter((filter) => {
						return BACKGROUND_FILTER_FIELD_MATCHES.find((bgFilter) => {
							return filter.field?.toLowerCase().includes(bgFilter);
						});
					})
					.filter((filter) => {
						return BACKGROUND_FILTERS_VALUE_FLAGS.every((flag) => {
							switch (filter.type) {
								case 'range':
									const rangeFilter = filter as SearchRequestModelFilterRange;
									return rangeFilter.value !== flag;
								case 'value':
								default:
									const valueFilter = filter as SearchRequestModelFilterValue;
									return valueFilter.value !== flag;
							}
						});
					});

				if (hasCategoryBackgroundFilters?.length) {
					this.pageType = 'category';
				}
			}
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (search: AfterSearchObj, next: Next): Promise<void | boolean> => {
			const config = search.controller.config as SearchControllerConfig;
			const redirectURL = search.response?.merchandising?.redirect;
			const searchStore = search.controller.store as SearchStore;
			if (redirectURL && config?.settings?.redirects?.merchandising && !search?.response?.filters?.length && !searchStore.loaded) {
				//set loaded to true to prevent infinite search/reloading from happening
				searchStore.loaded = true;
				this.track.redirect(redirectURL);
				window.location.replace(redirectURL);
				return false;
			}

			await next();
		});

		this.eventManager.on('afterStore', async (search: AfterStoreObj, next: Next): Promise<void | boolean> => {
			await next();
			// get scrollTo positioning and send it to 'restorePosition' event
			const storableRequestParams = getStorableRequestParams(search.request);
			const stringyParams = JSON.stringify(storableRequestParams);
			this.storage.set('lastStringyParams', stringyParams);
			const scrollMap: { [key: string]: ElementPositionObj } = this.storage.get('scrollMap') || {};
			const elementPosition = scrollMap[stringyParams];
			if (!elementPosition) {
				// search params have changed - empty the scrollMap
				this.storage.set('scrollMap', {});
			}

			// not awaiting this event as it relies on render, and render is blocked by afterStore event
			this.eventManager.fire('restorePosition', { controller: this, element: elementPosition });
		});

		this.eventManager.on('afterStore', async (search: AfterStoreObj, next: Next): Promise<void | boolean> => {
			await next();
			const controller = search.controller as SearchController;
			if (controller.store.loaded && !controller.store.error) {
				const products = controller.store.results.filter(
					(result) => result.type === 'product' && !this.events.product[result.id]?.render
				) as Product[];

				if (products.length === 0 && !search.response._cached) {
					// handle no results
					const data = getSearchSchemaData({ params: search.request, response: search.response });
					this.tracker.events[this.pageType].render({ data, siteId: this.config.globals?.siteId });
				}

				products.forEach((result: Product) => {
					if (!search.response._cached) {
						const data = schemaMap[result.id];
						this.tracker.events[this.pageType].render({ data, siteId: this.config.globals?.siteId });
						this.eventManager.fire('track.product.render', { controller: this, product: result, trackEvent: data });
					}
					this.events.product[result.id] = this.events.product[result.id] || {};
					this.events.product[result.id].render = true;
				});

				const config = search.controller.config as SearchControllerConfig;
				const nonBackgroundFilters = search?.request?.filters?.filter((filter: SearchRequestModelFilter) => !filter.background);
				if (
					config?.settings?.redirects?.singleResult &&
					search?.response?.search?.query &&
					search?.response?.pagination?.totalResults === 1 &&
					!nonBackgroundFilters?.length
				) {
					window.location.replace(search?.response.results[0].mappings.core.url);
					return false;
				}
			}
		});

		// restore position
		if (this.config.settings?.restorePosition?.enabled) {
			this.eventManager.on('restorePosition', async ({ controller, element }: RestorePositionObj, next: Next) => {
				// attempt to grab the element from storage if it is not provided
				if (!element?.selector) {
					const lastRequest = this.storage.get('lastStringyParams');
					if (lastRequest) {
						const storableRequestParams = getStorableRequestParams(JSON.parse(lastRequest));
						const stringyParams = JSON.stringify(storableRequestParams);
						const scrollMap: { [key: string]: ElementPositionObj } = this.storage.get('scrollMap') || {};
						element = scrollMap[stringyParams];
					}
				}

				const scrollToPosition = () => {
					return new Promise<void>(async (resolve) => {
						const maxCheckTime = 600;
						const checkTime = 60;
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

			// fire restorePosition event on 'pageshow' when setting is enabled
			if (this.config.settings?.restorePosition?.onPageShow) {
				window.addEventListener('pageshow', () => {
					this.eventManager.fire('restorePosition', { controller: this, element: {} });
				});
			}
		}

		// attach config plugins and event middleware
		this.use(this.config);
	}

	track: SearchTrackMethods = {
		product: {
			clickThrough: (e: MouseEvent, result): void => {
				if (this.events.product[result.id]?.clickThrough) {
					return;
				}
				const target = e.target as HTMLAnchorElement;
				const resultHref = result.display?.mappings.core?.url || result.mappings.core?.url || '';
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
						const lastRequest = this.storage.get('lastStringyParams');
						if (lastRequest) {
							const storableRequestParams = getStorableRequestParams(JSON.parse(lastRequest));
							const storableStringyParams = JSON.stringify(storableRequestParams);
							scrollMap[storableStringyParams] = { domRect, href: storedHref, selector };
						}
					} catch (err) {
						// failed to get lastStringParams
						this.log.warn('Failed to save srcollMap!', err);
					}
				}

				// store position data or empty object
				this.storage.set('scrollMap', scrollMap);
				const data = schemaMap[result.id];
				this.tracker.events[this.pageType].clickThrough({ data, siteId: this.config.globals?.siteId });
				this.events.product[result.id] = this.events.product[result.id] || {};
				this.events.product[result.id].clickThrough = true;
				this.eventManager.fire('track.product.clickThrough', { controller: this, event: e, product: result, trackEvent: data });
			},
			click: (e: MouseEvent, result): void => {
				if (this.events.product[result.id]?.click) {
					return;
				}

				if (result.type === 'banner') {
					return;
				}

				isClickWithinProductLink(e, result as Product) && this.track.product.clickThrough(e, result as Product);

				this.events.product[result.id] = this.events.product[result.id] || {};
				this.events.product[result.id].click = true;
				setTimeout(() => {
					this.events.product[result.id].click = false;
				}, CLICK_DUPLICATION_TIMEOUT);
			},
			render: (result: Product) => {
				if (this.events.product[result.id]?.render) {
					return;
				}

				const data = schemaMap[result.id];
				this.tracker.events[this.pageType].render({ data, siteId: this.config.globals?.siteId });
				this.events.product[result.id] = this.events.product[result.id] || {};
				this.events.product[result.id].render = true;
				this.eventManager.fire('track.product.render', { controller: this, product: result, trackEvent: data });
			},
			impression: (result: Product): void => {
				if (this.events.product[result.id]?.impression || !this.events.product[result.id]?.render) {
					return;
				}

				const data = schemaMap[result.id];
				this.tracker.events[this.pageType].impression({ data, siteId: this.config.globals?.siteId });
				this.events.product[result.id] = this.events.product[result.id] || {};
				this.events.product[result.id].impression = true;
				this.eventManager.fire('track.product.impression', { controller: this, product: result, trackEvent: data });
			},
			addToCart: (result: Product): void => {
				const data = getSearchAddtocartSchemaData({ searchSchemaData: schemaMap[result.id], results: [result] });
				this.tracker.events[this.pageType].addToCart({
					data,
					siteId: this.config.globals?.siteId,
				});
				this.eventManager.fire('track.product.addToCart', { controller: this, product: result, trackEvent: data });
			},
		},
		redirect: (redirectURL: string): void => {
			const data = getSearchRedirectSchemaData({ redirectURL });
			this.tracker.events.search.redirect({ data, siteId: this.config.globals?.siteId });
			this.eventManager.fire('track.product.redirect', { controller: this, redirectURL, trackEvent: data });
		},
	};

	get params(): SearchRequestModel {
		const params: SearchRequestModel = deepmerge({ ...getSearchParams(this.urlManager.state) }, this.config.globals || {});

		// redirect setting
		// DUPLICATED LOGIC can be found in infinite backfill (change both if updating)
		if (!this.config.settings?.redirects?.merchandising || this.store.loaded) {
			params.search = params.search || {};
			params.search.redirectResponse = 'full' as SearchRequestModelSearchRedirectResponseEnum;
		}

		params.tracking = params.tracking || {};
		params.tracking.domain = window.location.href;

		const { userId, sessionId, pageLoadId, shopperId } = this.tracker.getContext();
		if (userId) {
			params.tracking.userId = userId;
		}

		if (sessionId) {
			params.tracking.sessionId = sessionId;
		}

		if (pageLoadId) {
			params.tracking.pageLoadId = pageLoadId;
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

			if (shopperId) {
				params.personalization = params.personalization || {};
				params.personalization.shopper = shopperId;
			}
		}

		return params;
	}

	search = async (): Promise<void> => {
		try {
			if (!this.initialized) {
				await this.init();
			}
			const params = this.params;

			if (params.search?.query?.string && params.search?.query?.string.length) {
				// save it to the history store
				this.store.history.save(params.search.query.string);
			}
			this.store.loading = true;

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

			const stringyParams = JSON.stringify(getStorableRequestParams(params));
			const prevStringyParams = this.storage.get('lastStringyParams');
			if (stringyParams == prevStringyParams) {
				// no param change - not searching
				return;
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			let meta: MetaResponseModel = {};
			let response: SearchResponseModel & { meta?: MetaResponseModel } = {};

			// infinite scroll functionality (after page 1)
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

				// infinite backfill is enabled AND we have not yet fetched any results
				if (this.config.settings?.infinite.backfill && !this.store.loaded) {
					// create requests for all missing pages (using Arrray(page).fill() to populate an array to map)
					const backfillRequestsParams: SearchRequestModel[] = [];
					const backfillRequests = Array(params.pagination.page)
						.fill('backfill')
						.map((v, i) => {
							const backfillParams: SearchRequestModel = deepmerge(
								{ ...params },
								{ pagination: { page: i + 1 }, search: { redirectResponse: 'full' } }
							);
							// don't include page parameter if on page 1
							if (i + 1 == 1) {
								delete backfillParams?.pagination?.page;

								if (this.config.settings?.redirects?.merchandising) {
									// redirect setting
									// DUPLICATED LOGIC can be found in params getter
									delete backfillParams?.search?.redirectResponse;
								}
							}
							backfillRequestsParams.push(backfillParams);
							return this.client.search(backfillParams);
						});

					const backfillResponses = await Promise.all(backfillRequests);

					// backfillResponses are [meta, searchResponse][]
					// set the meta and response to the first page of backfillResponses
					meta = backfillResponses[0][0];
					response = backfillResponses[0][1];

					// accumulate results from all backfill responses
					const backfillResults: SearchResponseModelResult[] = backfillResponses.reduce((results, response, index) => {
						createResultSchemaMapping({ request: backfillRequestsParams[index], response: response });
						return results.concat(...response[1].results!);
					}, [] as SearchResponseModelResult[]);

					// overwrite pagination params to expected state
					response.pagination!.totalPages = Math.ceil(response.pagination!.totalResults! / response.pagination!.pageSize!);
					response.pagination!.page = params.pagination?.page;

					// set the response results with results from backfill responses
					response.results = backfillResults;
				} else {
					// infinite with no backfills.
					[meta, response] = await this.client.search(params);
					createResultSchemaMapping({ request: params, response: [meta, response] });
					// append new results to previous results
					response.results = [...this.previousResults, ...(response.results || [])];
				}
			} else {
				// normal request

				// reset events for new search
				this.events = { product: {} };

				// clear previousResults to prevent infinite scroll from using them
				this.previousResults = [];
				[meta, response] = await this.client.search(params);
				createResultSchemaMapping({ request: params, response: [meta, response] });
			}

			// MockClient will overwrite the client search() method and use SearchData to return mock data which already contains meta data
			if (!response.meta) {
				response.meta = meta;
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

			// store previous results for infinite usage (need to alsways store in case switch to infinite after pagination)
			this.previousResults = JSON.parse(JSON.stringify(response.results));

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
			}
		} finally {
			this.store.loading = false;
		}
	};

	addToCart = async (_products: Product[] | Product): Promise<void> => {
		const products = typeof (_products as Product[]).slice == 'function' ? (_products as Product[]).slice() : [_products];
		(products as Product[]).forEach((product) => {
			this.track.product.addToCart(product);
		});
		if (products.length > 0) {
			this.eventManager.fire('addToCart', { controller: this, products });
		}
	};
}

function createResultSchemaMapping({ request, response }: { request: SearchRequestModel; response: [MetaResponseModel, SearchResponseModel] }): void {
	const [_, searchResponse] = response;
	const schema = getSearchSchemaData({
		params: request,
		response: searchResponse,
	});

	searchResponse.results?.forEach((result) => {
		schemaMap[result.id!] = {
			...schema,
			results: [
				{
					position: result.position!,
					uid: result.mappings?.core?.uid || '',
					sku: result.mappings?.core?.sku,
				},
			],
		};
	});
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

function getSearchRedirectSchemaData({ redirectURL }: { redirectURL: string }): SearchRedirectSchemaData {
	return {
		redirect: redirectURL,
	};
}

function getSearchAddtocartSchemaData({
	searchSchemaData,
	results,
}: {
	searchSchemaData: SearchSchemaData;
	results?: Product[];
}): SearchAddtocartSchemaData {
	return {
		...searchSchemaData,
		results:
			results?.map((result: Product): BeaconProduct => {
				const core = (result as Product).mappings.core!;
				return {
					uid: core.uid || '',
					sku: core.sku,
					price: Number(core.price),
					qty: result.quantity || 1,
				};
			}) || [],
	};
}

function getSearchSchemaData({ params, response }: { params: SearchRequestModel; response: SearchResponseModel }): SearchSchemaData {
	const filters = params.filters?.reduce<{
		bgfilter?: Array<AutocompleteAddtocartSchemaDataBgfilterInner>;
		filter?: Array<AutocompleteAddtocartSchemaDataFilterInner>;
	}>((acc, filter) => {
		const key = filter.background ? 'bgfilter' : 'filter';
		acc[key] = acc[key] || [];

		const value =
			filter.type === 'range' &&
			!isNaN((filter as SearchRequestModelFilterRange).value?.low!) &&
			!isNaN((filter as SearchRequestModelFilterRange).value?.low!)
				? [`low=${(filter as SearchRequestModelFilterRange).value?.low}`, `high=${(filter as SearchRequestModelFilterRange).value?.high}`]
				: [`${(filter as SearchRequestModelFilterValue).value}`];

		const existing = acc[key]!.find((item) => item.field === filter.field);
		if (existing && !existing.value!.includes(value[0])) {
			existing.value!.push(...value);
		} else {
			acc[key]!.push({
				field: filter.field,
				value,
			});
		}

		return acc;
	}, {});

	let correctedQuery: string | undefined;
	if (response?.search?.originalQuery && response?.search?.query) {
		correctedQuery = response?.search?.query;
	}

	const campaigns = response?.merchandising?.campaigns || [];
	const experiments = response?.merchandising?.experiments || [];

	return {
		q: params.search?.query?.string || '',
		correctedQuery,
		matchType: response?.search?.matchType as SearchSchemaDataMatchTypeEnum,
		...filters,
		sort: params.sorts?.map((sort) => {
			return {
				field: sort.field,
				dir: sort.direction as AutocompleteAddtocartSchemaDataSortInnerDirEnum,
			};
		}),
		pagination: {
			totalResults: response?.pagination?.totalResults!,
			page: response?.pagination?.page!,
			resultsPerPage: response?.pagination?.pageSize!,
		},
		merchandising: {
			personalized: response?.merchandising?.personalized,
			redirect: response?.merchandising?.redirect,
			triggeredCampaigns:
				(campaigns.length &&
					campaigns.map((campaign) => {
						const experiement = experiments.find((experiment) => experiment.campaignId === campaign.id);
						return {
							id: campaign.id,
							experimentId: experiement?.experimentId,
							variationId: experiement?.variationId,
						};
					})) ||
				undefined,
		},
		results: [],
	};
}
