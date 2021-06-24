import deepmerge from 'deepmerge';

import type { BeaconEvent } from '@searchspring/snap-tracker';
import { BeaconType, BeaconCategory } from '@searchspring/snap-tracker';

import { AbstractController } from '../Abstract/AbstractController';
import type { RecommendationControllerConfig, BeforeSearchObj, AfterSearchObj, ControllerServices, NextEvent } from '../types';
import { ControllerEnvironment } from '../types';

type RecommendationTrackMethods = {
	product: {
		click: (e, result) => BeaconEvent;
		render: (result) => BeaconEvent;
		impression: (result) => BeaconEvent;
	};
	click: (e, result) => BeaconEvent;
	impression: () => BeaconEvent;
	render: () => BeaconEvent;
};

const defaultConfig: RecommendationControllerConfig = {
	id: 'recommend',
	tag: '',
	globals: {},
};

export class RecommendationController extends AbstractController {
	config: RecommendationControllerConfig;
	events = {
		click: null,
		impression: null,
		render: null,
	};

	constructor(config: RecommendationControllerConfig, { client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker });

		if (!config.tag) {
			throw new Error(`Invalid config passed to RecommendationController. The "tag" attribute is required.`);
		}

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);

		// add 'beforeSearch' middleware
		this.eventManager.on('beforeSearch', async (recommend: BeforeSearchObj, next: NextEvent): Promise<void | boolean> => {
			recommend.controller.store.loading = true;

			await next();
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (recommend: AfterSearchObj, next: NextEvent): Promise<void | boolean> => {
			await next();

			recommend.controller.store.loading = false;
		});
	}

	track: RecommendationTrackMethods = {
		product: {
			click: (e: MouseEvent, result): BeaconEvent => {
				if (!this.store.profile.tag || !result || !this.events.click) return;

				const payload = {
					type: BeaconType.PROFILE_PRODUCT_CLICK,
					category: BeaconCategory.RECOMMENDATIONS,
					context: { website: { trackingCode: this.config.globals.siteId } },
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
								core: result.mappings.core,
							},
							seed: this.config.globals.seed,
						},
					},
					pid: this.events.click.id,
				};

				const event = this.tracker.track.event(payload);

				return event;
			},
			impression: (result): BeaconEvent => {
				if (!this.store.profile.tag || !result || !this.events.impression) return;

				const payload = {
					type: BeaconType.PROFILE_PRODUCT_IMPRESSION,
					category: BeaconCategory.RECOMMENDATIONS,
					context: { website: { trackingCode: this.config.globals.siteId } },
					event: {
						context: {
							placement: this.store.profile.placement,
							tag: this.store.profile.tag,
							type: 'product-recommendation',
						},
						product: {
							id: result.id,
							mappings: {
								core: result.mappings.core,
							},
							seed: this.config.globals.seed,
						},
					},
					pid: this.events.impression.id,
				};

				const event = this.tracker.track.event(payload);

				return event;
			},
			render: (result): BeaconEvent => {
				if (!this.store.profile.tag || !result || !this.events.render) return;

				const payload = {
					type: BeaconType.PROFILE_PRODUCT_RENDER,
					category: BeaconCategory.RECOMMENDATIONS,
					context: { website: { trackingCode: this.config.globals.siteId } },
					event: {
						context: {
							placement: this.store.profile.placement,
							tag: this.store.profile.tag,
							type: 'product-recommendation',
						},
						product: {
							id: result.id,
							mappings: {
								core: result.mappings.core,
							},
							seed: this.config.globals.seed,
						},
					},
					pid: this.events.render.id,
				};

				const event = this.tracker.track.event(payload);

				return event;
			},
		},
		click: (e: MouseEvent): BeaconEvent => {
			if (!this.store.profile.tag) return;
			const event = this.tracker.track.event({
				type: BeaconType.PROFILE_CLICK,
				category: BeaconCategory.RECOMMENDATIONS,
				context: { website: { trackingCode: this.config.globals.siteId } },
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
					},
				},
			});
			this.events.click = event;

			return event;
		},
		impression: (): BeaconEvent => {
			if (!this.store.profile.tag) return;
			const event = this.tracker.track.event({
				type: BeaconType.PROFILE_IMPRESSION,
				category: BeaconCategory.RECOMMENDATIONS,
				context: { website: { trackingCode: this.config.globals.siteId } },
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
					},
				},
			});
			this.events.impression = event;

			return event;
		},
		render: (): BeaconEvent => {
			if (!this.store.profile.tag) return;
			const event = this.tracker.track.event({
				type: BeaconType.PROFILE_RENDER,
				category: BeaconCategory.RECOMMENDATIONS,
				context: { website: { trackingCode: this.config.globals.siteId } },
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
					},
				},
			});
			this.events.render = event;

			return event;
		},
	};

	get params(): Record<string, any> {
		const params = {
			tag: this.config.tag,
			...this.config.globals,
			branch: this.config.branch || 'production',
		};
		const cart = this.tracker.getCartItems();
		const lastViewed = this.tracker.getLastViewedItems();
		if (cart) {
			params.cart = cart;
		}
		if (lastViewed) {
			params.lastViewed = lastViewed;
		}

		if (this.environment == ControllerEnvironment.DEVELOPMENT) {
			params.test = true;
		}

		return params;
	}

	search = async (): Promise<RecommendationController> => {
		// TODO: call this.init() if it has never been called

		const params = this.params;

		try {
			try {
				await this.eventManager.fire('beforeSearch', {
					controller: this,
					request: params,
				});
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'beforeSearch' middleware cancelled`);
					return this;
				} else {
					this.log.error(`error in 'beforeSearch' middleware`);
					throw err;
				}
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			// TODO (notsureif)
			// provide a means to access the actual request parameters (params + globals)
			// 				* add params(params) function to client that spits back the JSON request (takes params param) - incorporates globals + params param

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
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterSearch' middleware cancelled`);
					afterSearchProfile.stop();
					return this;
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
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterStore' middleware cancelled`);
					afterStoreProfile.stop();
					return this;
				} else {
					this.log.error(`error in 'afterStore' middleware`);
					throw err;
				}
			}

			afterStoreProfile.stop();
			this.log.profile(afterStoreProfile);
		} catch (err) {
			if (err) {
				console.error(err);
			}
		}

		return this;
	};
}
