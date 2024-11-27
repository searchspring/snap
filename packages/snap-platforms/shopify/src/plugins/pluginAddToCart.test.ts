import { pluginAddToCart } from './pluginAddToCart';
import { MockClient } from '@searchspring/snap-shared';
import { Product, SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '@searchspring/snap-controller';

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager: urlManager,
};
let searchConfig = {
	id: 'search',
};

const globals = { siteId: '8uyt2m' };
const searchConfigDefault = {
	id: 'search',
	globals: {
		filters: [],
	},
	settings: {},
};
let controller: any;

// function to recreate fresh services for each test (otherwise globals are shared)
const createControllerServices = () => {
	return {
		client: new MockClient(globals, {}),
		store: new SearchStore(searchConfig, services),
		urlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	};
};

describe('shopify/addToCart', () => {
	beforeEach(() => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, createControllerServices());
		expect(controller.config.globals).toBeDefined();
		expect(controller.config.globals!.filters).toEqual([]);
	});

	it('can disabled via a config to the plugin', async () => {
		const pluginConfig = {
			enabled: false,
		};

		const controller = new SearchController(searchConfig, createControllerServices());

		const eventSpy = jest.spyOn(controller.eventManager, 'on');

		expect(controller.addToCart).toBeDefined();

		await controller.init();
		await controller.search();

		pluginAddToCart(controller, pluginConfig);

		expect(eventSpy).not.toHaveBeenCalledWith('addToCart', {
			products: [controller.store.results[0]],
		});

		controller.addToCart([controller.store.results[0] as Product]);

		expect(eventSpy).not.toHaveBeenCalledWith('addToCart', {
			products: [controller.store.results[0]],
		});

		eventSpy.mockClear();
	});

	it('creates a function on the controller to use in components that calls the plugin', async () => {
		const controller = new SearchController(searchConfig, createControllerServices());

		const onEventSpy = jest.spyOn(controller.eventManager, 'on');
		const fireEventSpy = jest.spyOn(controller.eventManager, 'fire');

		expect(controller.addToCart).toBeDefined();

		await controller.init();
		await controller.search();

		pluginAddToCart(controller);

		controller.addToCart([controller.store.results[0] as Product]);

		expect(fireEventSpy).toHaveBeenCalledWith('addToCart', {
			products: [controller.store.results[0]],
		});

		// @ts-ignore
		expect(controller.eventManager.events.addToCart.functions[0].name).toBe('addToCart');
		fireEventSpy.mockClear();
		onEventSpy.mockClear();
	});

	it('can pass custom add to cart function via a config to the plugin', async () => {
		const mock = jest.fn();
		const pluginConfig = {
			functionOverride: mock,
		};

		const controller = new SearchController(searchConfig, createControllerServices());

		const eventSpy = jest.spyOn(controller.eventManager, 'on');

		expect(controller.addToCart).toBeDefined();

		await controller.init();
		await controller.search();

		pluginAddToCart(controller, pluginConfig);

		expect(eventSpy).not.toHaveBeenCalledWith('addToCart', {
			products: [controller.store.results[0]],
		});

		controller.addToCart([controller.store.results[0] as Product]);

		expect(mock).toHaveBeenCalledWith([controller.store.results[0]]);
		expect(eventSpy).not.toHaveBeenCalledWith('addToCart', {
			products: [controller.store.results[0]],
		});

		eventSpy.mockClear();
	});
});
