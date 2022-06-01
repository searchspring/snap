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
	NextEvent,
	ContextVariables,
} from '../types';
import type { SearchRequestModel, SearchRequestModelSearchRedirectResponseEnum } from '@searchspring/snapi-types';

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

	constructor(
		config: SearchControllerConfig,
		{ client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices,
		context?: ContextVariables
	) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker }, context);

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);
		this.store.setConfig(this.config);

		this.storage = new StorageStore({
			type: StorageType.SESSION,
			key: `ss-controller-${this.config.id}`,
		});

		// set last params to undefined for compare in search
		this.storage.set('lastStringyParams', undefined);

		// add 'beforeSearch' middleware
		this.eventManager.on('beforeSearch', async (search: BeforeSearchObj, next: NextEvent): Promise<void | boolean> => {
			search.controller.store.loading = true;

			await next();
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (search: AfterSearchObj, next: NextEvent): Promise<void | boolean> => {
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

		this.eventManager.on('afterStore', async (search: AfterStoreObj, next: NextEvent): Promise<void | boolean> => {
			await next();

			search.controller.store.loading = false;

			// save last params
			const stringyParams = JSON.stringify(search.request);
			this.storage.set('lastStringyParams', stringyParams);

			if (this.config.settings?.infinite && window.scrollY === 0) {
				// browser didn't jump
				const scrollMap = this.storage.get('scrollMap') || {};

				// interval we ony need to keep checking until the page height > than our stored value
				const scrollToPosition = scrollMap[stringyParams];
				if (scrollToPosition) {
					let checkCount = 0;
					const heightCheck = window.setInterval(() => {
						if (document.documentElement.scrollHeight >= scrollToPosition) {
							window.scrollTo(0, scrollToPosition);
							this.log.debug('scrolling to: ', scrollMap[stringyParams]);
							window.clearInterval(heightCheck);
						}
						if (checkCount > 2000 / HEIGHT_CHECK_INTERVAL) {
							window.clearInterval(heightCheck);
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
					const stringyParams = this.storage.get('lastStringyParams');
					const scrollMap: any = {};
					scrollMap[stringyParams] = window.scrollY;
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

			if (this.config.settings?.infinite) {
				// TODO: refactor this
				const preventBackfill =
					this.config.settings.infinite?.backfill && !this.store.results.length && params.pagination?.page! > this.config.settings.infinite.backfill;
				const dontBackfill = !this.config.settings.infinite?.backfill && !this.store.results.length && params.pagination?.page! > 1;

				if (preventBackfill || dontBackfill) {
					this.storage.set('scrollMap', {});
					this.urlManager.set('page', 1).go();
					return;
				}
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			const [meta, response] = await this.client.search(params);
			// @ts-ignore
			if (!response.meta) {
				/**
				 * MockClient will overwrite the client search() method and use
				 * SearchData to return mock data which already contains meta data
				 */
				// @ts-ignore
				response.meta = meta;
			}

			// infinite functionality
			// if params.page > 1 and infinite setting exists we should append results
			if (this.config.settings?.infinite && params.pagination?.page! > 1) {
				// if no results fetch results...
				let previousResults = this.store.data?.results || [];
				if (this.config.settings?.infinite.backfill && !previousResults.length) {
					// figure out how many pages of results to backfill and wait on all responses
					const backfills = [];
					for (let page = 1; page < params.pagination?.page!; page++) {
						const backfillParams = deepmerge({ ...params }, { pagination: { page } });
						backfills.push(this.client.search(backfillParams));
					}

					const backfillResponses = await Promise.all(backfills);
					backfillResponses.map(([meta, data]) => {
						previousResults = previousResults.concat(data.results!);
					});
				}

				response.results = [...previousResults, ...(response.results || [])];
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

			// update the store
			// @ts-ignore
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
			}
		}
	};
}
