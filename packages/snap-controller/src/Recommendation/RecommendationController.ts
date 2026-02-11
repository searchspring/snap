import deepmerge from 'deepmerge';

import { ErrorType, Product } from '@searchspring/snap-store-mobx';
import { AbstractController } from '../Abstract/AbstractController';
import { ControllerTypes } from '../types';
import {
	type Product as BeaconProduct,
	type RecommendationsAddtocartSchemaData,
	ResultProductType,
	RecommendationsClickthroughSchemaData,
	RecommendationsImpressionSchemaData,
	RecommendationsRenderSchemaData,
	ResultsInner,
	ClickthroughResultsInner,
} from '@athoscommerce/beacon';
import type { Banner, RecommendationStore } from '@searchspring/snap-store-mobx';
import type { RecommendRequestModel } from '@searchspring/snap-client';
import type { RecommendationControllerConfig, ControllerServices, ContextVariables, AfterStoreObj } from '../types';
import type { Next } from '@searchspring/snap-event-manager';
import { CLICK_DUPLICATION_TIMEOUT, isClickWithinProductLink } from '../utils/isClickWithinProductLink';

type RecommendationTrackMethods = {
	product: {
		clickThrough: (e: MouseEvent, result: Product | Banner) => void;
		click: (e: MouseEvent, result: Product | Banner) => void;
		impression: (result: Product | Banner) => void;
		addToCart: (result: Product) => void;
	};
};

const defaultConfig: RecommendationControllerConfig = {
	id: 'recommend',
	beacon: {
		enabled: true,
	},
	tag: '',
	batched: true,
	realtime: false,
	globals: {},
};

export class RecommendationController extends AbstractController {
	public type = ControllerTypes.recommendation;
	declare store: RecommendationStore;
	declare config: RecommendationControllerConfig;

	private events: {
		[responseId: string]: {
			product: {
				[id: string]: {
					inlineBannerClickThrough?: boolean;
					productClickThrough?: boolean;
					impression?: boolean;
				};
			};
		};
	} = {};

	constructor(
		config: RecommendationControllerConfig,
		{ client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices,
		context?: ContextVariables
	) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker }, context);

		if (!config.tag) {
			throw new Error(`Invalid config passed to RecommendationController. The "tag" attribute is required.`);
		}

		// attach to bfCache restore event and re-run search on the controller
		// enabled by default
		if (config.settings?.searchOnPageShow !== false) {
			window.addEventListener('pageshow', (e) => {
				if (e.persisted && !this.store.error && this.store.loaded && !this.store.loading) {
					this.search();
				}
			});
		}

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);
		this.store.setConfig(this.config);

		this.eventManager.on('afterStore', async (search: AfterStoreObj, next: Next): Promise<void | boolean> => {
			await next();
			const controller = search.controller as RecommendationController;
			const responseId = search.response.responseId;
			if (controller.store.loaded && !controller.store.error) {
				const data: RecommendationsRenderSchemaData = { responseId, tag: controller.store.profile.tag };
				this.config.beacon?.enabled && this.tracker.events.recommendations.render({ data, siteId: this.config.globals?.siteId });
			}
		});

		// add 'afterStore' middleware
		// this.eventManager.on('afterStore', async (recommend: AfterStoreObj, next: Next): Promise<void | boolean> => {
		// 	await next();

		// 	// attach tracking events to cart store
		// 	this.store.cart?.on('addItems', ({ items }: { items: Product[] }) => {
		// 		// add to bundle
		// 	});

		// 	this.store.cart?.on('removeItems', ({ items }: { items: Product[] }) => {
		// 		// remove from bundle
		// 	});
		// });

		// attach config plugins and event middleware
		this.use(this.config);
	}

	track: RecommendationTrackMethods = {
		product: {
			clickThrough: (e: MouseEvent, result): void => {
				if (!result) {
					this.log.warn('No result provided to track.product.clickThrough');
					return;
				}
				const responseId = result.responseId;
				if (this.events[responseId]?.product[result.id]?.productClickThrough) return;
				const type = (['product', 'banner'].includes(result.type) ? result.type : 'product') as ResultProductType;
				const beaconResult: ClickthroughResultsInner = {
					type,
					uid: result.id ? '' + result.id : '',
					...(type === 'product'
						? {
								parentId: result.id ? '' + result.id : '',
								sku: result.mappings.core?.sku ? '' + result.mappings.core?.sku : undefined,
						  }
						: {}),
				};
				const data: RecommendationsClickthroughSchemaData = {
					tag: this.store.profile.tag,
					responseId,
					results: [beaconResult],
				};
				this.eventManager.fire('track.product.clickThrough', { controller: this, event: e, product: result, trackEvent: data });
				this.config.beacon?.enabled && this.tracker.events.recommendations.clickThrough({ data, siteId: this.config.globals?.siteId });
				this.events[responseId].product[result.id] = this.events[responseId].product[result.id] || {};
				this.events[responseId].product[result.id].productClickThrough = true;
			},
			click: (e: MouseEvent, result): void => {
				if (!result) {
					this.log.warn('No result provided to track.product.click');
					return;
				}
				const responseId = result.responseId;
				if (result.type === 'banner') {
					if (this.events[responseId]?.product[result.id]?.inlineBannerClickThrough) {
						return;
					}
					this.track.product.clickThrough(e, result);
					this.events[responseId].product[result.id] = this.events[responseId].product[result.id] || {};
					this.events[responseId].product[result.id].inlineBannerClickThrough = true;
					setTimeout(() => {
						this.events[responseId].product[result.id].inlineBannerClickThrough = false;
					}, CLICK_DUPLICATION_TIMEOUT);
				} else if (isClickWithinProductLink(e, result as Product)) {
					if (this.events?.[responseId]?.product[result.id]?.productClickThrough) {
						return;
					}
					this.track.product.clickThrough(e, result);
					this.events[responseId].product[result.id] = this.events[responseId].product[result.id] || {};
					this.events[responseId].product[result.id].productClickThrough = true;
					setTimeout(() => {
						this.events[responseId].product[result.id].productClickThrough = false;
					}, CLICK_DUPLICATION_TIMEOUT);
				}
			},
			impression: (result): void => {
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
				const data: RecommendationsImpressionSchemaData = {
					tag: this.store.profile.tag,
					responseId,
					results: [item],
					banners: [],
				};
				this.eventManager.fire('track.product.impression', { controller: this, product: result, trackEvent: data });
				this.config.beacon?.enabled && this.tracker.events.recommendations.impression({ data, siteId: this.config.globals?.siteId });
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
				const data: RecommendationsAddtocartSchemaData = {
					responseId,
					tag: this.store.profile.tag,
					results: [product],
				};
				this.eventManager.fire('track.product.addToCart', { controller: this, product: result, trackEvent: data });
				this.config.beacon?.enabled && this.tracker.events.recommendations.addToCart({ data, siteId: this.config.globals?.siteId });
			},
		},
	};

	get params(): RecommendRequestModel {
		const params = {
			tag: this.config.tag,
			batched: this.config.batched,
			branch: this.config.branch || 'production',
			batchId: this.config.batchId,
			...this.config.globals,
		};

		const { shopperId } = this.tracker.getContext();

		if (shopperId) {
			params.shopper = shopperId;
		}

		if (!params.siteId || params.siteId == this.tracker.getGlobals().siteId) {
			const cart = this.tracker.cookies.cart.get();
			const lastViewed = this.tracker.cookies.viewed.get();

			if (cart?.length) {
				params.cart = cart;
			}
			if (lastViewed?.length) {
				params.lastViewed = lastViewed;
			}
		}

		return params as RecommendRequestModel;
	}

	search = async (): Promise<void> => {
		try {
			if (!this.initialized) {
				await this.init();
			}

			const params = this.params;

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

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			const response = await this.client.recommend(params);
			searchProfile.stop();
			this.log.profile(searchProfile);

			const responseId = response.responseId;
			this.events[responseId] = this.events[responseId] || { product: {} };

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
		const products = typeof (_products as Product[])?.slice == 'function' ? (_products as Product[]).slice() : [_products];
		if (!_products || products.length === 0) {
			this.log.warn('No products provided to recommendation controller.addToCart');
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
