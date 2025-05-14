import deepmerge from 'deepmerge';

import { ErrorType, Product } from '@searchspring/snap-store-mobx';
import { AbstractController } from '../Abstract/AbstractController';
import { ControllerTypes } from '../types';
import type { RecommendationStore } from '@searchspring/snap-store-mobx';
import type { RecommendRequestModel } from '@searchspring/snap-client';
import type { RecommendationControllerConfig, ControllerServices, ContextVariables, AfterStoreObj } from '../types';
import type { Item, Product as BeaconProduct, RecommendationsAddtocartSchemaData, RecommendationsSchemaData } from '@searchspring/beacon';
import type { Next } from '@searchspring/snap-event-manager';

type RecommendationTrackMethods = {
	product: {
		clickThrough: (e: MouseEvent, result: Product) => void;
		click: (e: MouseEvent, result: Product) => void;
		render: (result: Product) => void;
		impression: (result: Product) => void;
		addToCart: (result: Product) => void;
	};
	bundle: {
		addToCart: (results: Product[]) => void;
	};
};

const defaultConfig: RecommendationControllerConfig = {
	id: 'recommend',
	tag: '',
	batched: true,
	realtime: false,
	globals: {},
};

export class RecommendationController extends AbstractController {
	public type = ControllerTypes.recommendation;
	declare store: RecommendationStore;
	declare config: RecommendationControllerConfig;

	events: {
		product: Record<
			string,
			{
				clickThrough?: boolean;
				impression?: boolean;
				render?: boolean;
			}
		>;
	} = {
		product: {},
	};

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
			if (controller.store.loaded && !controller.store.error) {
				const products = controller.store.results.filter((result) => result.type === 'product') as Product[];
				const results = products.length === 0 ? [] : products;
				const data = getRecommendationsSchemaData({ store: this.store, results });
				this.tracker.events.recommendations.render({ data, siteId: this.config.globals?.siteId });
				products.forEach((result) => {
					this.events.product[result.id] = this.events.product[result.id] || {};
					this.events.product[result.id].render = true;
				});
				this.eventManager.fire('track.product.render', { controller: this, products, trackEvent: data });
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
				if (this.events.product[result.id]?.clickThrough) return;

				const data = getRecommendationsSchemaData({ store: this.store, results: [result] });
				this.tracker.events.recommendations.clickThrough({ data, siteId: this.config.globals?.siteId });
				this.events.product[result.id] = this.events.product[result.id] || {};
				this.events.product[result.id].clickThrough = true;
				this.eventManager.fire('track.product.clickThrough', { controller: this, event: e, products: [result], trackEvent: data });
				// TODO: should we fire 'track.product.click()' here for backwards compatibility? Same in SearchController & update docs
			},
			click: (e: MouseEvent, result): void => {
				// TODO: closest might be going too far - write own function to only go n levels up - additionally check that href includes result.url
				const href = (e.target as Element)?.getAttribute('href') || (e.target as Element)?.closest('a')?.getAttribute('href');
				if (href) {
					this.track.product.clickThrough(e, result);
				} else {
					// TODO: in future, send as an interaction event
				}
			},
			impression: (result): RecommendationsSchemaData | undefined => {
				if (this.events.product[result.id]?.impression) return;

				const data = getRecommendationsSchemaData({ store: this.store, results: [result] });
				this.tracker.events.recommendations.impression({ data, siteId: this.config.globals?.siteId });
				this.events.product[result.id] = this.events.product[result.id] || {};
				this.events.product[result.id].impression = true;
				this.eventManager.fire('track.product.impression', { controller: this, products: [result], trackEvent: data });
				return data;
			},
			render: (result: Product): RecommendationsSchemaData | undefined => {
				if (this.events.product[result.id]?.render) return;

				const data = getRecommendationsSchemaData({ store: this.store, results: [result] });
				this.tracker.events.recommendations.render({ data, siteId: this.config.globals?.siteId });
				this.events.product[result.id] = this.events.product[result.id] || {};
				this.events.product[result.id].render = true;
				this.eventManager.fire('track.product.render', { controller: this, products: [result], trackEvent: data });
				return data;
			},
			addToCart: (result: Product): RecommendationsAddtocartSchemaData | undefined => {
				const data = getRecommendationsAddtocartSchemaData({ store: this.store, results: [result] });
				this.tracker.events.recommendations.addToCart({ data, siteId: this.config.globals?.siteId });
				this.eventManager.fire('track.product.addToCart', { controller: this, products: [result], trackEvent: data });
				return data;
			},
		},
		bundle: {
			addToCart: (results: Product[]): RecommendationsAddtocartSchemaData | undefined => {
				if (this.store.profile.type != 'bundle') return;

				const data = getRecommendationsAddtocartSchemaData({ store: this.store, results });
				this.tracker.events.recommendations.addToCart({ data, siteId: this.config.globals?.siteId });
				this.eventManager.fire('track.bundle.addToCart', { controller: this, products: results, trackEvent: data });
				return data;
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

			// reset events for new search
			this.events = { product: {} };

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
}
function getRecommendationsAddtocartSchemaData({
	store,
	results,
}: {
	store: RecommendationStore;
	results?: Product[];
}): RecommendationsAddtocartSchemaData {
	return {
		tag: store.profile.tag,
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

function getRecommendationsSchemaData({ store, results }: { store: RecommendationStore; results?: Product[] }): RecommendationsSchemaData {
	return {
		tag: store.profile.tag,
		results:
			results?.map((result: Product, idx: number): Item => {
				const core = result.mappings.core!;
				return {
					position: idx + 1,
					uid: core.uid || '',
					sku: core.sku,
				};
			}) || [],
	};
}
