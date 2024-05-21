import deepmerge from 'deepmerge';

import { BeaconType, BeaconCategory, BeaconPayload, ProfilePlacement } from '@searchspring/snap-tracker';
import { ErrorType, Product } from '@searchspring/snap-store-mobx';
import { BeaconEvent } from '@searchspring/snap-tracker';
import { AbstractController } from '../Abstract/AbstractController';
import { ControllerTypes } from '../types';
import type { ProductViewEvent } from '@searchspring/snap-tracker';
import type { RecommendationStore } from '@searchspring/snap-store-mobx';
import type { Next } from '@searchspring/snap-event-manager';
import type { RecommendCombinedRequestModel } from '@searchspring/snap-client';
import type { RecommendationControllerConfig, BeforeSearchObj, AfterStoreObj, ControllerServices, ContextVariables } from '../types';
import { variantSelectionPlugin } from '../plugins/variantSelection';

type RecommendationTrackMethods = {
	product: {
		click: (e: MouseEvent, result: Product) => BeaconEvent | undefined;
		render: (result: Product) => BeaconEvent | undefined;
		impression: (result: Product) => BeaconEvent | undefined;
		removedFromBundle: (result: Product) => BeaconEvent | undefined;
		addedToBundle: (result: Product) => BeaconEvent | undefined;
	};
	click: (e: MouseEvent) => BeaconEvent | undefined;
	addBundle: (e: MouseEvent, results: Product[]) => BeaconEvent | undefined;
	impression: () => BeaconEvent | undefined;
	render: (results?: Product[]) => BeaconEvent | undefined;
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
		click?: BeaconEvent;
		impression?: BeaconEvent;
		render?: BeaconEvent;
		product?: Record<string, { impression?: BeaconEvent; render?: BeaconEvent }>;
	} = {
		click: undefined,
		impression: undefined,
		render: undefined,
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

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);
		this.store.setConfig(this.config);

		// add 'beforeSearch' middleware
		this.eventManager.on('beforeSearch', async (recommend: BeforeSearchObj, next: Next): Promise<void | boolean> => {
			recommend.controller.store.loading = true;

			await next();
		});

		// add 'afterStore' middleware
		this.eventManager.on('afterStore', async (recommend: AfterStoreObj, next: Next): Promise<void | boolean> => {
			await next();

			// attach tracking events to cart store
			this.store.cart?.on('addItems', ({ items }: { items: Product[] }) => {
				items.forEach((item) => {
					this.track.product.addedToBundle(item);
				});
			});

			this.store.cart?.on('removeItems', ({ items }: { items: Product[] }) => {
				items.forEach((item) => {
					this.track.product.removedFromBundle(item);
				});
			});

			recommend.controller.store.loading = false;
		});

		this.plugin(variantSelectionPlugin);

		// attach config plugins and event middleware
		this.use(this.config);
	}

	track: RecommendationTrackMethods = (() => {
		const getSeed = (): Array<ProductViewEvent> | undefined => {
			let skus: Array<string> = [];
			switch (this.store.profile.placement) {
				case ProfilePlacement.PRODUCTPAGE:
					if (this.config.globals.product) {
						skus = [this.config.globals.product];
					} else if (this.config.globals.products) {
						skus = this.config.globals.products;
					}
					break;
				case ProfilePlacement.BASKETPAGE:
					skus = this.tracker.cookies.cart.get(); // this is an array
					break;
				default:
					return;
			}
			if (skus.length) {
				return skus.map((sku: string) => ({
					sku,
				}));
			}
		};

		return {
			product: {
				click: (e: MouseEvent, result): BeaconEvent | undefined => {
					if (!this.store.profile.tag || !result) return;

					//set the profile click every time
					this.track.click(e);

					const payload: BeaconPayload = {
						type: BeaconType.PROFILE_PRODUCT_CLICK,
						category: BeaconCategory.RECOMMENDATIONS,
						context: this.config.globals.siteId ? { website: { trackingCode: this.config.globals.siteId } } : undefined,
						event: {
							context: {
								action: 'navigate',
								placement: this.store.profile.placement,
								tag: this.store.profile.tag,
								type: 'product-recommendation',
							},
							product: {
								id: result.id,
								mappings: {
									core: result.display.mappings.core,
								},
								seed: getSeed(),
							},
						},
						pid: this.events.click?.id,
					};

					const event = this.tracker.track.event(payload);
					this.eventManager.fire('track.product.click', { controller: this, event: e, result, trackEvent: event });
					return event;
				},
				impression: (result): BeaconEvent | undefined => {
					if (!this.store.profile.tag || !result || !this.events.impression || (this.events.product && this.events.product[result.id]?.impression))
						return;
					const payload: BeaconPayload = {
						type: BeaconType.PROFILE_PRODUCT_IMPRESSION,
						category: BeaconCategory.RECOMMENDATIONS,
						context: this.config.globals.siteId ? { website: { trackingCode: this.config.globals.siteId } } : undefined,
						event: {
							context: {
								placement: this.store.profile.placement,
								tag: this.store.profile.tag,
								type: 'product-recommendation',
							},
							product: {
								id: result.id,
								mappings: {
									core: result.display.mappings.core,
								},
								seed: getSeed(),
							},
						},
						pid: this.events.impression.id,
					};

					this.events.product![result.id] = this.events.product![result.id] || {};
					const event = (this.events.product![result.id].impression = this.tracker.track.event(payload));
					this.eventManager.fire('track.product.impression', { controller: this, result, trackEvent: event });
					return event;
				},
				render: (result): BeaconEvent | undefined => {
					if (!this.store.profile.tag || !result || !this.events.render || this.events.product![result.id]?.render) return;
					const payload: BeaconPayload = {
						type: BeaconType.PROFILE_PRODUCT_RENDER,
						category: BeaconCategory.RECOMMENDATIONS,
						context: this.config.globals.siteId ? { website: { trackingCode: this.config.globals.siteId } } : undefined,
						event: {
							context: {
								placement: this.store.profile.placement,
								tag: this.store.profile.tag,
								type: 'product-recommendation',
							},
							product: {
								id: result.id,
								mappings: {
									core: result.display.mappings.core,
								},
								seed: getSeed(),
							},
						},
						pid: this.events.render.id,
					};

					this.events.product![result.id] = this.events.product![result.id] || {};
					const event = (this.events.product![result.id].render = this.tracker.track.event(payload));
					this.eventManager.fire('track.product.render', { controller: this, result, trackEvent: event });
					return event;
				},
				removedFromBundle: (result): BeaconEvent | undefined => {
					if (
						!this.store.profile.tag ||
						!result ||
						!this.events.render ||
						!this.events.product![result.id]?.render ||
						this.store.profile.type != 'bundle'
					)
						return;
					const payload: BeaconPayload = {
						type: BeaconType.PROFILE_PRODUCT_REMOVEDFROMBUNDLE,
						category: BeaconCategory.RECOMMENDATIONS,
						context: this.config.globals.siteId ? { website: { trackingCode: this.config.globals.siteId } } : undefined,
						event: {
							context: {
								placement: this.store.profile.placement,
								tag: this.store.profile.tag,
								type: 'product-recommendation',
							},
							product: {
								id: result.id,
								mappings: {
									core: result.display.mappings.core,
								},
								seed: getSeed(),
							},
						},
						pid: this.events.click?.id,
					};

					this.events.product![result.id] = this.events.product![result.id] || {};
					const event = (this.events.product![result.id].render = this.tracker.track.event(payload));
					this.eventManager.fire('track.product.removedFromBundle', { controller: this, result, trackEvent: event });
					return event;
				},
				addedToBundle: (result): BeaconEvent | undefined => {
					if (
						!this.store.profile.tag ||
						!result ||
						!this.events.render ||
						!this.events.product![result.id]?.render ||
						this.store.profile.type != 'bundle'
					)
						return;
					const payload: BeaconPayload = {
						type: BeaconType.PROFILE_PRODUCT_ADDEDTOBUNDLE,
						category: BeaconCategory.RECOMMENDATIONS,
						context: this.config.globals.siteId ? { website: { trackingCode: this.config.globals.siteId } } : undefined,
						event: {
							context: {
								placement: this.store.profile.placement,
								tag: this.store.profile.tag,
								type: 'product-recommendation',
							},
							product: {
								id: result.id,
								mappings: {
									core: result.display.mappings.core,
								},
								seed: getSeed(),
							},
						},
						pid: this.events.click?.id,
					};

					this.events.product![result.id] = this.events.product![result.id] || {};
					const event = (this.events.product![result.id].render = this.tracker.track.event(payload));
					this.eventManager.fire('track.product.addedToBundle', { controller: this, result, trackEvent: event });
					return event;
				},
			},
			addBundle: (e: MouseEvent, results: Product[]): BeaconEvent | undefined => {
				if (!results.length || !this.store.profile.tag || this.store.profile.type != 'bundle') return;
				const event: BeaconEvent | undefined = this.tracker.track.event({
					type: BeaconType.PROFILE_ADDBUNDLE,
					category: BeaconCategory.RECOMMENDATIONS,
					context: this.config.globals.siteId ? { website: { trackingCode: this.config.globals.siteId } } : undefined,
					event: {
						context: {
							placement: this.store.profile.placement,
							tag: this.store.profile.tag,
							type: 'product-recommendation',
						},
						products: results.map((result) => ({
							id: result.id,
							mappings: {
								core: result.display.mappings.core,
							},
							quantity: result.quantity,
						})),
						profile: {
							tag: this.store.profile.tag,
							placement: this.store.profile.placement,
							threshold: this.store.profile.display.threshold,
							templateId: this.store.profile.display.template.uuid,
							seed: getSeed(),
						},
					},
				});
				this.eventManager.fire('track.addBundle', { controller: this, event: e, trackEvent: event });
				return event;
			},
			click: (e: MouseEvent): BeaconEvent | undefined => {
				if (!this.store.profile.tag) return;
				const event: BeaconEvent | undefined = this.tracker.track.event({
					type: BeaconType.PROFILE_CLICK,
					category: BeaconCategory.RECOMMENDATIONS,
					context: this.config.globals.siteId ? { website: { trackingCode: this.config.globals.siteId } } : undefined,
					event: {
						context: {
							action: 'navigate',
							placement: this.store.profile.placement,
							tag: this.store.profile.tag,
							type: 'product-recommendation',
						},
						profile: {
							tag: this.store.profile.tag,
							placement: this.store.profile.placement,
							threshold: this.store.profile.display.threshold,
							templateId: this.store.profile.display.template.uuid,
							seed: getSeed(),
						},
					},
				});
				this.events.click = event;
				this.eventManager.fire('track.click', { controller: this, event: e, trackEvent: event });
				return event;
			},
			impression: (): BeaconEvent | undefined => {
				if (!this.store.profile.tag || this.events.impression) return;
				const event: BeaconEvent | undefined = this.tracker.track.event({
					type: BeaconType.PROFILE_IMPRESSION,
					category: BeaconCategory.RECOMMENDATIONS,
					context: this.config.globals.siteId ? { website: { trackingCode: this.config.globals.siteId } } : undefined,
					event: {
						context: {
							placement: this.store.profile.placement,
							tag: this.store.profile.tag,
							type: 'product-recommendation',
						},
						profile: {
							tag: this.store.profile.tag,
							placement: this.store.profile.placement,
							threshold: this.store.profile.display.threshold,
							templateId: this.store.profile.display.template.uuid,
							seed: getSeed(),
						},
					},
				});
				this.events.impression = event;
				this.eventManager.fire('track.impression', { controller: this, trackEvent: event });
				return event;
			},
			render: (): BeaconEvent | undefined => {
				if (!this.store.profile.tag || this.events.render) return;
				const event: BeaconEvent | undefined = this.tracker.track.event({
					type: BeaconType.PROFILE_RENDER,
					category: BeaconCategory.RECOMMENDATIONS,
					context: this.config.globals.siteId ? { website: { trackingCode: this.config.globals.siteId } } : undefined,
					event: {
						context: {
							placement: this.store.profile.placement,
							tag: this.store.profile.tag,
							type: 'product-recommendation',
						},
						profile: {
							tag: this.store.profile.tag,
							placement: this.store.profile.placement,
							threshold: this.store.profile.display.threshold,
							templateId: this.store.profile.display.template.uuid,
							seed: getSeed(),
						},
					},
				});

				this.events.render = event;

				this.eventManager.fire('track.render', { controller: this, trackEvent: event });
				return event;
			},
		} as RecommendationTrackMethods;
	})();

	get params(): RecommendCombinedRequestModel {
		const params: RecommendCombinedRequestModel = {
			tag: this.config.tag,
			batched: this.config.batched,
			branch: this.config.branch || 'production',
			order: this.context?.options?.order,
			...this.config.globals,
		};

		const shopperId = this.tracker.getContext().shopperId;
		const cart = this.tracker.cookies.cart.get();
		const lastViewed = this.tracker.cookies.viewed.get();

		if (shopperId) {
			params.shopper = shopperId;
		}

		if (!params.siteId || params.siteId == this.tracker.getGlobals().siteId) {
			if (cart?.length) {
				params.cart = cart;
			}
			if (lastViewed?.length) {
				params.lastViewed = lastViewed;
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
				this.store.loading = false;
			}
		}
	};
}
