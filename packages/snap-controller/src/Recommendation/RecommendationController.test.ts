import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';

import { RecommendationStore, RecommendationStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker, BeaconType, BeaconCategory, BeaconEvent } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger, LogMode } from '@searchspring/snap-logger';
import { MockClient } from '@searchspring/snap-shared';

import { RecommendationController } from './RecommendationController';

const globals = { siteId: '8uyt2m' };

const recommendConfig: RecommendationStoreConfig = {
	id: 'search',
	tag: 'trending',
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager,
};

describe('Recommendation Controller', () => {
	beforeEach(() => {
		recommendConfig.id = uuidv4().split('-').join('');
	});

	it(`throws an error when no tag is provided in config`, async function () {
		expect(() => {
			const configWithoutTag: RecommendationStoreConfig = {
				id: recommendConfig.id,
				tag: '',
			};

			// @ts-ignore
			const controller = new RecommendationController(configWithoutTag, {
				client: new MockClient(globals, {}),
				store: new RecommendationStore(configWithoutTag, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
		}).toThrow();
	});

	it(`adds a test param when in development environment`, async function () {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.environment = LogMode.DEVELOPMENT;
		expect(controller.environment).toBe('development');

		const params = controller.params;
		expect(params.test).toBeTruthy();
	});

	const events = ['beforeSearch', 'afterSearch', 'afterStore'];
	events.forEach((event) => {
		it(`tests ${event} middleware cancellation handled`, async function () {
			const controller = new RecommendationController(recommendConfig, {
				client: new MockClient(globals, {}),
				store: new RecommendationStore(recommendConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});

			const spy = jest.spyOn(controller.log, 'warn');
			controller.on(event, () => false); // return false to stop middleware

			controller.init();
			await controller.search();

			expect(spy).toHaveBeenCalledWith(`'${event}' middleware cancelled`);
			spy.mockClear();

			// store should not have been updated
			if (['beforeSearch'].includes(event)) {
				expect(controller.store.results.length).toBe(0);
			}
		});
	});

	events.forEach((event) => {
		it(`tests ${event} middleware error handled`, async function () {
			const controller = new RecommendationController(recommendConfig, {
				client: new MockClient(globals, {}),
				store: new RecommendationStore(recommendConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});

			const spy = jest.spyOn(controller.log, 'error');
			controller.on(event, () => {
				throw 'errrrrr!';
			}); // throw an error

			controller.init();
			await controller.search();

			expect(spy).toHaveBeenCalledWith(`error in '${event}' middleware`);
			spy.mockClear();
		});
	});

	it('can invoke controller track.click and track.product.click', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const trackfn = jest.spyOn(controller.tracker.track, 'event');

		await controller.search();

		const event = new Event('click');
		const eventfn = jest.spyOn(controller.eventManager, 'fire');

		const eventReturn = controller.track.click(event as any);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_CLICK,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
			event: {
				context: {
					action: 'navigate',
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					type: 'product-recommendation',
				},
				profile: {
					tag: controller.store.profile.tag,
					placement: controller.store.profile.placement,
					threshold: controller.store.profile.display.threshold,
					templateId: controller.store.profile.display.template.uuid,
				},
			},
		});
		expect(eventfn).toHaveBeenCalledTimes(1);

		expect(controller.events.click).toBeDefined();
		expect(controller.events.click).toBe(eventReturn);

		trackfn.mockClear();
		eventfn.mockClear();

		/**
		 * track.product.click requires track.click to be called first, so we reuse the same controller
		 */

		const result = controller.store.results[0];

		controller.track.product.click(event as any, result);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_PRODUCT_CLICK,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
			event: {
				context: {
					action: 'navigate',
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					type: 'product-recommendation',
				},
				product: {
					id: result.id,
					mappings: {
						core: result.mappings.core,
					},
					seed: controller.config.globals.seed,
				},
			},
			pid: controller.events.click!.id,
		});
		expect(eventfn).toHaveBeenCalledTimes(1);

		trackfn.mockClear();
		eventfn.mockClear();
	});

	it('can invoke controller track.render and track.product.render', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const trackfn = jest.spyOn(controller.tracker.track, 'event');
		const productTrackfn = jest.spyOn(controller.track.product, 'render');

		await controller.search();

		const eventfn = jest.spyOn(controller.eventManager, 'fire');

		const eventReturn = controller.track.render();

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_RENDER,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
			event: {
				context: {
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					type: 'product-recommendation',
				},
				profile: {
					tag: controller.store.profile.tag,
					placement: controller.store.profile.placement,
					threshold: controller.store.profile.display.threshold,
					templateId: controller.store.profile.display.template.uuid,
				},
			},
		});

		expect(controller.events.render).toBeDefined();
		expect(controller.events.render).toBe(eventReturn);

		expect(eventfn).toHaveBeenCalledTimes(controller.store.results.length + 1); // products + initial profile render
		expect(trackfn).toHaveBeenCalledTimes(controller.store.results.length + 1);
		expect(productTrackfn).toHaveBeenCalledTimes(controller.store.results.length);

		expect(Object.keys(controller.events.product || {})).toHaveLength(controller.store.results.length);
		expect(controller.events.product![controller.store.results[0].id as keyof BeaconEvent]).toBeDefined();
		expect(controller.events.product![controller.store.results[0].id as keyof BeaconEvent].render).toBeDefined();

		productTrackfn.mockClear();
		trackfn.mockClear();
		eventfn.mockClear();
	});

	it('can invoke controller track.impression and track.product.impression', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const trackfn = jest.spyOn(controller.tracker.track, 'event');

		await controller.search();

		const eventfn = jest.spyOn(controller.eventManager, 'fire');

		const eventReturn = controller.track.impression();

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_IMPRESSION,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
			event: {
				context: {
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					type: 'product-recommendation',
				},
				profile: {
					tag: controller.store.profile.tag,
					placement: controller.store.profile.placement,
					threshold: controller.store.profile.display.threshold,
					templateId: controller.store.profile.display.template.uuid,
				},
			},
		});

		expect(controller.events.impression).toBeDefined();
		expect(controller.events.impression).toBe(eventReturn);

		expect(eventfn).toHaveBeenCalledTimes(1);
		expect(trackfn).toHaveBeenCalledTimes(1);

		trackfn.mockClear();
		eventfn.mockClear();

		/**
		 * track.product.impression requires track.impression to be called first, so we reuse the same controller
		 */

		const result = controller.store.results[0];
		const productEventReturn = controller.track.product.impression(result);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_PRODUCT_IMPRESSION,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
			event: {
				context: {
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					type: 'product-recommendation',
				},
				product: {
					id: result.id,
					mappings: {
						core: result.mappings.core,
					},
					seed: controller.config.globals.seed,
				},
			},
			pid: controller.events.impression!.id,
		});

		expect(controller.events.product![result.id as keyof BeaconEvent]).toBeDefined();
		expect(controller.events.product![result.id as keyof BeaconEvent].impression).toBeDefined();
		expect(controller.events.product![result.id as keyof BeaconEvent].impression).toBe(productEventReturn);

		expect(eventfn).toHaveBeenCalledTimes(1);
		expect(trackfn).toHaveBeenCalledTimes(1);

		trackfn.mockClear();
		eventfn.mockClear();
	});

	it('can set cart param', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const items = ['product123', 'product456'];
		controller.tracker.cookies.cart.add(items);
		expect(controller.params.cart).toEqual(items);
	});

	it('can set lastViewed param', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const product = { sku: 'product123' };
		controller.tracker.track.product.view(product);

		expect(controller.params.lastViewed).toEqual([product.sku]);
	});

	it('can set shopper param', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const shopper = { id: 'user123' };
		controller.tracker.track.shopper.login(shopper);

		expect(controller.params.shopper).toEqual(shopper.id);
	});

	it('logs error if 429', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.client.recommend = jest.fn(() => {
			throw 429;
		});

		await controller.search();

		expect(controller.store.error).toStrictEqual({
			code: 429,
			type: 'warning',
			message: 'Too many requests try again later',
		});
	});

	it('logs error if 500', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.client.recommend = jest.fn(() => {
			throw 500;
		});

		await controller.search();

		expect(controller.store.error).toStrictEqual({
			code: 500,
			type: 'error',
			message: 'Invalid Search Request or Service Unavailable',
		});
	});
});
