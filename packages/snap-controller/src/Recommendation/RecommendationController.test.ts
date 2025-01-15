import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';

import { RecommendationStore, RecommendationStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker, BeaconType, BeaconCategory, BeaconEvent } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { MockClient } from '@searchspring/snap-shared';
import { waitFor } from '@testing-library/preact';
import { RecommendationController } from './RecommendationController';

const globals = { siteId: '8uyt2m' };

const mockSkus = ['product_sku1', 'product_sku2'];

const recommendConfig: RecommendationStoreConfig = {
	id: 'search',
	tag: 'trending',
	globals: {
		product: mockSkus[0],
	},
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager,
};

describe('Recommendation Controller', () => {
	beforeEach(() => {
		recommendConfig.id = uuidv4().split('-').join('');
	});

	afterEach(() => {
		const cookies = document.cookie.split(';');

		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	});

	it(`throws an error when no tag is provided in config`, async function () {
		expect(() => {
			const configWithoutTag: RecommendationStoreConfig = {
				id: recommendConfig.id,
				tag: '',
			};

			// @ts-ignore
			new RecommendationController(configWithoutTag, {
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

	it(`sets proper loading states`, async function () {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		// calling init to ensure event timings line up for asserting loading and loaded states
		await controller.init();

		expect(controller.store.loaded).toBe(false);
		expect(controller.store.loading).toBe(false);

		const searchPromise = controller.search();

		expect(controller.store.loaded).toBe(false);
		expect(controller.store.loading).toBe(true);

		await searchPromise;

		expect(controller.store.loaded).toBe(true);
		expect(controller.store.loading).toBe(false);
	});

	it(`tests searchOnPageShow triggers search on persisted pageshow event `, async function () {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.search();

		const searchSpy = jest.spyOn(controller, 'search');

		expect(searchSpy).not.toHaveBeenCalled();

		// Mock PageTransitionEvent
		class MockPageTransitionEvent extends Event {
			public persisted: boolean;

			constructor(type: string, eventInitDict?: EventInit & { persisted?: boolean }) {
				super(type, eventInitDict);
				this.persisted = eventInitDict?.persisted ?? false;
			}
		}

		const event = new MockPageTransitionEvent('pageshow', {
			bubbles: true,
			persisted: true,
		});

		window.dispatchEvent(event);

		await waitFor(() => {
			expect(searchSpy).toHaveBeenCalled();
		});
	});

	it(`can turn off searchOnPageShow`, async function () {
		const customConfig = {
			...recommendConfig,
			settings: {
				searchOnPageShow: false,
			},
		};
		const controller = new RecommendationController(customConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.search();

		const searchSpy = jest.spyOn(controller, 'search');

		expect(searchSpy).not.toHaveBeenCalled();

		// Mock PageTransitionEvent
		class MockPageTransitionEvent extends Event {
			public persisted: boolean;

			constructor(type: string, eventInitDict?: EventInit & { persisted?: boolean }) {
				super(type, eventInitDict);
				this.persisted = eventInitDict?.persisted ?? false;
			}
		}

		const event = new MockPageTransitionEvent('pageshow', {
			bubbles: true,
			persisted: true,
		});

		window.dispatchEvent(event);

		await waitFor(() => {
			expect(searchSpy).not.toHaveBeenCalled();
		});
	});

	it(`tests searchOnPageShow doesnt trigger search if persisted is false or undefined on the pageshow event`, async function () {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.search();

		const searchSpy = jest.spyOn(controller, 'search');

		expect(searchSpy).not.toHaveBeenCalled();

		// Mock PageTransitionEvent
		class MockPageTransitionEvent extends Event {
			public persisted: boolean;

			constructor(type: string, eventInitDict?: EventInit & { persisted?: boolean }) {
				super(type, eventInitDict);
				this.persisted = eventInitDict?.persisted ?? false;
			}
		}

		const event = new MockPageTransitionEvent('pageshow', {
			bubbles: true,
			persisted: false,
		});

		window.dispatchEvent(event);

		const event2 = new MockPageTransitionEvent('pageshow', {
			bubbles: true,
		});

		window.dispatchEvent(event2);

		await waitFor(() => {
			expect(searchSpy).not.toHaveBeenCalled();
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
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					seed: [{ sku: recommendConfig.globals?.product }],
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
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					seed: [{ sku: recommendConfig.globals?.product }],
				},
			},
			pid: controller.events.click!.id,
		});
		expect(eventfn).toHaveBeenCalledTimes(2);

		trackfn.mockClear();
		eventfn.mockClear();
	});

	it('can invoke controller track.click and track.product.click (placement: basket-page)', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		// use 'basket-page' mock profile response
		(controller.client as MockClient).mockData.updateConfig({ recommend: { profile: 'placementBasket' } });

		controller.tracker.cookies.cart.add(mockSkus);
		const trackfn = jest.spyOn(controller.tracker.track, 'event');

		await controller.search();

		const event = new Event('click');
		const eventfn = jest.spyOn(controller.eventManager, 'fire');

		const eventReturn = controller.track.click(event as any);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_CLICK,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					seed: mockSkus.map((sku) => ({ sku })),
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
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					seed: mockSkus.map((sku) => ({ sku })),
				},
			},
			pid: controller.events.click!.id,
		});
		expect(eventfn).toHaveBeenCalledTimes(2);

		trackfn.mockClear();
		eventfn.mockClear();
	});

	it('can invoke controller track.click and track.product.click (placement: other)', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		// use 'other' mock profile response
		(controller.client as MockClient).mockData.updateConfig({ recommend: { profile: 'placementOther' } });

		controller.tracker.cookies.cart.add(mockSkus);
		const trackfn = jest.spyOn(controller.tracker.track, 'event');

		await controller.search();

		const event = new Event('click');
		const eventfn = jest.spyOn(controller.eventManager, 'fire');

		const eventReturn = controller.track.click(event as any);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_CLICK,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					// should not have seed when placement: other
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
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					// should not have seed when placement: other
				},
			},
			pid: controller.events.click!.id,
		});
		expect(eventfn).toHaveBeenCalledTimes(2);

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
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					seed: [{ sku: recommendConfig.globals?.product }],
				},
			},
		});

		expect(controller.events.render).toBeDefined();
		expect(controller.events.render).toBe(eventReturn);

		controller.store.results.map((result) => controller.track.product.render(result));

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

	it('can invoke controller track.render and track.product.render with custom result set', async () => {
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

		const reducedResults = controller.store.results.slice(0, 5);
		const eventfn = jest.spyOn(controller.eventManager, 'fire');

		const eventReturn = controller.track.render(reducedResults);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_RENDER,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					seed: [{ sku: recommendConfig.globals?.product }],
				},
			},
		});

		expect(controller.events.render).toBeDefined();
		expect(controller.events.render).toBe(eventReturn);

		reducedResults.map((result) => controller.track.product.render(result));

		expect(eventfn).toHaveBeenCalledTimes(reducedResults.length + 1); // products + initial profile render
		expect(trackfn).toHaveBeenCalledTimes(reducedResults.length + 1);
		expect(productTrackfn).toHaveBeenCalledTimes(reducedResults.length);

		expect(Object.keys(controller.events.product || {})).toHaveLength(reducedResults.length);
		expect(controller.events.product![reducedResults[0].id as keyof BeaconEvent]).toBeDefined();
		expect(controller.events.product![reducedResults[0].id as keyof BeaconEvent].render).toBeDefined();

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
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					seed: [{ sku: recommendConfig.globals?.product }],
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

		//this tests we send the core data and not the display data
		result.mask.set({ id: 'custom', mappings: { core: { name: 'custom name' } } });

		const productEventReturn = controller.track.product.impression(result);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_PRODUCT_IMPRESSION,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
					seed: [{ sku: recommendConfig.globals?.product }],
				},
			},
			pid: controller.events.impression!.id,
		});

		expect(controller.events.product![result.id]).toBeDefined();
		expect(controller.events.product![result.id].impression).toBeDefined();
		expect(controller.events.product![result.id].impression).toBe(productEventReturn);

		expect(eventfn).toHaveBeenCalledTimes(1);
		expect(trackfn).toHaveBeenCalledTimes(1);

		trackfn.mockClear();
		eventfn.mockClear();
	});

	it('can use addToCart', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.search();

		const eventfn = jest.spyOn(controller.eventManager, 'fire');

		controller.addToCart([controller.store.results[0], controller.store.results[1]]);

		expect(eventfn).toHaveBeenCalledWith('addToCart', { products: [controller.store.results[0], controller.store.results[1]] });
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

		const handleError = jest.spyOn(controller, 'handleError');

		const error = new Error('Retry rate limit exceeded.');
		controller.client.recommend = jest.fn(() => {
			throw { err: error, fetchDetails: { status: 429, url: 'test.com' } };
		});

		await controller.search();

		expect(controller.store.error).toStrictEqual({
			code: 429,
			type: 'warning',
			message: 'Too many requests try again later',
		});

		expect(handleError).toHaveBeenCalledWith(error, { status: 429, url: 'test.com' });
		handleError.mockClear();
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

		const handleError = jest.spyOn(controller, 'handleError');

		const error = new Error('Invalid Search Request or Service Unavailable');
		controller.client.recommend = jest.fn(() => {
			throw { err: error, fetchDetails: { status: 500, url: 'test.com' } };
		});

		await controller.search();

		expect(controller.store.error).toStrictEqual({
			code: 500,
			type: 'error',
			message: 'Invalid Search Request or Service Unavailable',
		});

		expect(handleError).toHaveBeenCalledWith(error, { status: 500, url: 'test.com' });
		handleError.mockClear();
	});
});
