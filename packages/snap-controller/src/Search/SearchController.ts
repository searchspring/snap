import deepmerge from 'deepmerge';
import cssEscape from 'css.escape';

import { AbstractController } from '../Abstract/AbstractController';
import { StorageStore, ErrorType, MerchandisingContentBanner } from '@searchspring/snap-store-mobx';
import { getSearchParams } from '../utils/getParams';
import { ControllerTypes, PageContextVariable } from '../types';

import type { Product, Banner, SearchStore, ValueFacet } from '@searchspring/snap-store-mobx';
import type {
	SearchControllerConfig,
	SearchAfterSearchObj,
	AfterStoreObj,
	ControllerServices,
	ContextVariables,
	RestorePositionObj,
	ElementPositionObj,
	BeforeSearchObj,
} from '../types';
import type { Next } from '@searchspring/snap-event-manager';
import {
	type SearchRequestModel,
	type SearchResponseModelResult,
	type SearchRequestModelSearchRedirectResponseEnum,
	type MetaResponseModel,
	type SearchResponseModel,
	type SearchRequestModelFilterRange,
	type SearchRequestModelFilterValue,
	type SearchRequestModelFilter,
	type SearchResponseModelFilter,
	type MetaResponseModelFacetHierarchy,
	type SearchResponseModelFilterTypeEnum,
	SearchResponseModelFacetValue,
} from '@searchspring/snapi-types';

import {
	type Product as BeaconProduct,
	ResultProductType,
	RenderSchemaData,
	ImpressionSchemaData,
	ClickthroughSchemaData,
	AddtocartSchemaData,
	RedirectSchemaData,
	ClickthroughResultsInner,
	ResultsInner,
	ClickthroughBannersInner,
	BannersInner,
} from '@athoscommerce/beacon';
import { CLICK_DUPLICATION_TIMEOUT, isClickWithinProductLink } from '../utils/isClickWithinProductLink';
import { isClickWithinBannerLink } from '../utils/isClickWithinBannerLink';

const BACKGROUND_FILTER_FIELD_MATCHES = ['collection', 'category', 'categories', 'hierarchy', 'brand', 'manufacturer'];
const BACKGROUND_FILTERS_VALUE_FLAGS = [1, 0, '1', '0', 'true', 'false', true, false];

const defaultConfig: SearchControllerConfig = {
	id: 'search',
	globals: {},
	beacon: {
		enabled: true,
	},
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
	banner: {
		click: (e: MouseEvent, merchandisingBanner: MerchandisingContentBanner) => void;
		clickThrough: (e: MouseEvent, merchandisingBanner: MerchandisingContentBanner) => void;
		impression: (merchandisingBanner: MerchandisingContentBanner) => void;
	};
	product: {
		clickThrough: (e: MouseEvent, result: Product | Banner) => void;
		click: (e: MouseEvent, result: Product | Banner) => void;
		impression: (result: Product | Banner) => void;
		addToCart: (results: Product) => void;
	};
	redirect: ({ redirectURL, responseId }: { redirectURL: string; responseId: string }) => void;
};

export class SearchController extends AbstractController {
	public type = ControllerTypes.search;
	declare store: SearchStore;
	declare config: SearchControllerConfig;
	storage: StorageStore;
	private previousResults: Array<SearchResponseModelResult> = [];
	private page: PageContextVariable = {
		type: 'search',
	};
	private events: {
		[responseId: string]: {
			product: {
				[id: string]: {
					inlineBannerClickThrough?: boolean;
					productClickThrough?: boolean;
					impression?: boolean;
				};
			};
			banner: {
				[id: string]: {
					impression?: boolean;
					clickThrough?: boolean;
				};
			};
		};
	} = {};

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

		if (typeof this.context?.page === 'object' && ['search', 'category'].includes(this.context.page.type)) {
			this.page = deepmerge<PageContextVariable>(this.page, this.context.page);
		}

		this.eventManager.on('beforeSearch', async ({ request }: BeforeSearchObj, next: Next): Promise<void | boolean> => {
			// wait for other middleware to resolve
			await next();

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
					this.page = deepmerge<PageContextVariable>(this.page, { type: 'category' });
				}
			}
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (search: SearchAfterSearchObj, next: Next): Promise<void | boolean> => {
			const config = search.controller.config as SearchControllerConfig;
			const redirectURL = search.response?.merchandising?.redirect;
			const searchStore = search.controller.store as SearchStore;
			if (redirectURL && config?.settings?.redirects?.merchandising && !search?.response?.filters?.length && !searchStore.loaded) {
				//set loaded to true to prevent infinite search/reloading from happening
				searchStore.loaded = true;
				this.track.redirect({ redirectURL, responseId: search.response.tracking.responseId });
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

		const hierarchySettings = this.config.settings?.filters?.hierarchy;
		if (hierarchySettings && hierarchySettings.enabled) {
			this.eventManager.on('afterSearch', async (search: SearchAfterSearchObj, next: Next): Promise<void | boolean> => {
				await next();

				const displayDelimiter = hierarchySettings.displayDelimiter ?? ' / '; // choose delimiter for label
				const showFullPath = hierarchySettings.showFullPath ?? false; // display full hierarchy path or just the current level

				// add hierarchy filter to filter summary
				const facets = search.response.facets;
				if (facets) {
					facets.forEach((facet) => {
						if (search.response.meta?.facets && facet.field) {
							const metaFacet = search.response.meta.facets[facet.field];
							const dataDelimiter = (metaFacet as MetaResponseModelFacetHierarchy)?.hierarchyDelimiter || ' / ';

							if (metaFacet && metaFacet.display === 'hierarchy' && facet.filtered && (facet as ValueFacet).values?.length > 0) {
								const filteredValues = (facet as SearchResponseModelFacetValue).values?.filter((val) => val?.filtered === true);

								if (filteredValues && filteredValues.length) {
									const filterToAdd: SearchResponseModelFilter = {
										field: facet.field,
										//escape special charactors used in regex
										label: showFullPath
											? (filteredValues[0].value ?? filteredValues[0].label ?? '').replace(
													new RegExp(dataDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
													displayDelimiter
											  )
											: filteredValues[0].label,
										type: 'value' as SearchResponseModelFilterTypeEnum.Value,
									};

									if (search.response.filters) {
										search.response.filters.push(filterToAdd);
									} else {
										search.response.filters = [filterToAdd];
									}
								}
							}
						}
					});
				}
			});
		}

		this.eventManager.on('afterStore', async (search: AfterStoreObj, next: Next): Promise<void | boolean> => {
			await next();
			const controller = search.controller as SearchController;

			if (controller.store.loaded && !controller.store.error) {
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
				window.addEventListener('pageshow', (e) => {
					if (e.persisted && this.store.loaded) {
						this.eventManager.fire('restorePosition', { controller: this, element: {} });
					}
				});
			}
		}

		// attach config plugins and event middleware
		this.use(this.config);
	}

	track: SearchTrackMethods = {
		banner: {
			impression: ({ uid, responseId }: MerchandisingContentBanner): void => {
				if (!uid) {
					this.log.warn('No banner provided to track.banner.impression');
					return;
				}
				if (this.events[responseId]?.banner[uid]?.impression) {
					return;
				}
				const banner: BannersInner = { uid };
				const data: ImpressionSchemaData = {
					responseId,
					banners: [banner],
					results: [],
				};

				this.eventManager.fire('track.banner.impression', { controller: this, product: { uid }, trackEvent: data });
				this.config.beacon?.enabled && this.tracker.events[this.page.type].impression({ data, siteId: this.config.globals?.siteId });
				this.events[responseId].banner[uid] = this.events[responseId].banner[uid] || {};
				this.events[responseId].banner[uid].impression = true;
			},
			click: (e: MouseEvent, banner: MerchandisingContentBanner): void => {
				if (!banner) {
					this.log.warn('No banner provided to track.banner.click');
					return;
				}
				const { responseId, uid } = banner;
				if (isClickWithinBannerLink(e)) {
					if (this.events?.[responseId]?.banner[uid]?.clickThrough) {
						return;
					}
					this.track.banner.clickThrough(e, banner);
					this.events[responseId].banner[uid] = this.events[responseId].banner[uid] || {};
					this.events[responseId].banner[uid].clickThrough = true;
					setTimeout(() => {
						this.events[responseId].banner[uid].clickThrough = false;
					}, CLICK_DUPLICATION_TIMEOUT);
				}
			},
			clickThrough: (e: MouseEvent, { uid, responseId }: MerchandisingContentBanner): void => {
				if (!uid) {
					this.log.warn('No banner provided to track.banner.clickThrough');
					return;
				}
				const banner: ClickthroughBannersInner = { uid };
				const data: ClickthroughSchemaData = {
					responseId,
					banners: [banner],
				};
				this.eventManager.fire('track.banner.clickThrough', { controller: this, event: e, product: { uid }, trackEvent: data });
				this.config.beacon?.enabled && this.tracker.events[this.page.type].clickThrough({ data, siteId: this.config.globals?.siteId });
				this.events[responseId].banner[uid] = this.events[responseId].banner[uid] || {};
				this.events[responseId].banner[uid].clickThrough = true;
				setTimeout(() => {
					this.events[responseId].banner[uid].clickThrough = false;
				}, CLICK_DUPLICATION_TIMEOUT);
			},
		},
		product: {
			clickThrough: (e: MouseEvent, result: Product | Banner): void => {
				if (!result) {
					this.log.warn('No result provided to track.product.clickThrough');
					return;
				}
				const responseId = result.responseId;
				const target = e.target as HTMLAnchorElement;
				const resultHref = (result as Product).display?.mappings.core?.url || (result as Product).mappings.core?.url || '';
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

				const type = (['product', 'banner'].includes(result.type) ? result.type : 'product') as ResultProductType;
				const item: ClickthroughResultsInner = {
					type,
					uid: result.id ? '' + result.id : '',
					...(type === 'product'
						? {
								parentId: result.id ? '' + result.id : '',
								sku: result.mappings.core?.sku ? '' + result.mappings.core?.sku : undefined,
						  }
						: {}),
				};

				const data: ClickthroughSchemaData = {
					responseId,
					results: [item],
				};
				this.eventManager.fire('track.product.clickThrough', { controller: this, event: e, product: result, trackEvent: data });
				this.config.beacon?.enabled && this.tracker.events[this.page.type].clickThrough({ data, siteId: this.config.globals?.siteId });
			},
			click: (e: MouseEvent, result: Product | Banner): void => {
				if (!result) {
					this.log.warn('No result provided to track.product.click');
					return;
				}
				const responseId = result.responseId;
				if (result.type === 'banner' && isClickWithinBannerLink(e)) {
					if (this.events?.[responseId]?.product[result.id]?.inlineBannerClickThrough) {
						return;
					}
					this.track.product.clickThrough(e, result as Banner);
					this.events[responseId].product[result.id] = this.events[responseId].product[result.id] || {};
					this.events[responseId].product[result.id].inlineBannerClickThrough = true;
					setTimeout(() => {
						this.events[responseId].product[result.id].inlineBannerClickThrough = false;
					}, CLICK_DUPLICATION_TIMEOUT);
				} else if (isClickWithinProductLink(e, result as Product)) {
					if (this.events?.[responseId]?.product[result.id]?.productClickThrough) {
						return;
					}
					this.track.product.clickThrough(e, result as Product);
					this.events[responseId].product[result.id] = this.events[responseId].product[result.id] || {};
					this.events[responseId].product[result.id].productClickThrough = true;
					setTimeout(() => {
						this.events[responseId].product[result.id].productClickThrough = false;
					}, CLICK_DUPLICATION_TIMEOUT);
				}
			},
			impression: (result: Product | Banner): void => {
				if (!result) {
					this.log.warn('No result provided to track.product.impression');
					return;
				}
				const responseId = result.responseId;
				if (this.events[responseId]?.product[result.id]?.impression) {
					return;
				}
				const type = (['product', 'banner'].includes(result.type) ? result.type : 'product') as ResultProductType;
				const item: ResultsInner = {
					type,
					uid: result.id ? '' + result.id : '',
					...(type === 'product'
						? {
								parentId: result.id ? '' + result.id : '',
								sku: result.mappings.core?.sku ? '' + result.mappings.core?.sku : undefined,
						  }
						: {}),
				};
				const data: ImpressionSchemaData = {
					responseId,
					results: [item],
					banners: [],
				};
				this.eventManager.fire('track.product.impression', { controller: this, product: result, trackEvent: data });
				this.config.beacon?.enabled && this.tracker.events[this.page.type].impression({ data, siteId: this.config.globals?.siteId });
				this.events[responseId].product[result.id] = this.events[responseId].product[result.id] || {};
				this.events[responseId].product[result.id].impression = true;
			},
			addToCart: (result: Product): void => {
				if (!result) {
					this.log.warn('No result provided to track.product.addToCart');
					return;
				}
				const responseId = result.responseId;
				const product: BeaconProduct = {
					parentId: result.id,
					uid: result.id,
					sku: result.mappings.core?.sku,
					qty: result.quantity || 1,
					price: Number(result.mappings.core?.price),
				};
				const data: AddtocartSchemaData = {
					responseId,
					results: [product],
				};
				this.eventManager.fire('track.product.addToCart', { controller: this, product: result, trackEvent: data });
				this.config.beacon?.enabled && this.tracker.events[this.page.type].addToCart({ data, siteId: this.config.globals?.siteId });
			},
		},
		redirect: ({ redirectURL, responseId }): void => {
			if (!redirectURL) {
				this.log.warn('No redirectURL provided to track.redirect');
				return;
			}
			const data: RedirectSchemaData = {
				responseId,
				redirect: redirectURL,
			};
			this.eventManager.fire('track.redirect', { controller: this, redirectURL, trackEvent: data });
			this.config.beacon?.enabled && this.tracker.events.search.redirect({ data, siteId: this.config.globals?.siteId });
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
			if (this.store.loaded && stringyParams === prevStringyParams) {
				// no param change - not searching
				return;
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			let meta: MetaResponseModel = {};
			let response: SearchResponseModel & { meta?: MetaResponseModel };

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
							return this.client[this.page.type](backfillParams);
						});

					const backfillResponses = await Promise.all(backfillRequests);

					// backfillResponses are [meta, searchResponse][]
					// set the meta and response to the first page of backfillResponses
					meta = backfillResponses[0][0];
					response = backfillResponses[0][1];

					// accumulate results from all backfill responses
					const backfillResults: SearchResponseModelResult[] = backfillResponses.reduce((results, response) => {
						const responseId = response[1].tracking.responseId;
						this.events[responseId] = this.events[responseId] || { product: {}, banner: {} };
						return results.concat(...response[1].results!);
					}, [] as SearchResponseModelResult[]);

					// overwrite pagination params to expected state
					response.pagination!.totalPages = Math.ceil(response.pagination!.totalResults! / response.pagination!.pageSize!);
					response.pagination!.page = params.pagination?.page;

					// set the response results with results from backfill responses
					response.results = backfillResults;
				} else {
					// infinite with no backfills.
					[meta, response] = await this.client[this.page.type](params);

					const responseId = response.tracking.responseId;
					this.events[responseId] = this.events[responseId] || { product: {}, banner: {} };

					// append new results to previous results
					response.results = [...this.previousResults, ...(response.results || [])];
				}
			} else {
				// normal request
				// clear previousResults to prevent infinite scroll from using them
				this.previousResults = [];
				[meta, response] = await this.client[this.page.type](params);
				const responseId = response.tracking.responseId;
				this.events[responseId] = { product: {}, banner: {} };
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

			const data: RenderSchemaData = { responseId: response.tracking.responseId };
			this.config.beacon?.enabled && this.tracker.events[this.page.type].render({ data, siteId: this.config.globals?.siteId });

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
		const products = typeof (_products as Product[])?.slice == 'function' ? (_products as Product[]).slice() : [_products];
		if (!_products || products.length === 0) {
			this.log.warn('No products provided to search controller.addToCart');
			return;
		}
		(products as Product[]).forEach((product) => {
			this.track.product.addToCart(product);
		});
		if (products.length > 0) {
			this.eventManager.fire('addToCart', { controller: this, products });
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
		let innerHrefElem: HTMLElement | null = null;
		try {
			innerHrefElem = elem.querySelector(`[href*="${href}"]`);
		} catch (e) {
			try {
				innerHrefElem = elem.querySelector(cssEscape(`[href*="${href}"]`));
			} catch {}
		}

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
