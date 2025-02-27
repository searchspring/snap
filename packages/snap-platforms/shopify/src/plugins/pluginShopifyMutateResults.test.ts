import { pluginShopifyMutateResults } from './pluginShopifyMutateResults';
import { MockClient } from '@searchspring/snap-shared';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '@searchspring/snap-controller';

const ORIGIN = 'http://localhost';
const ROOT = 'root/';

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
let controller: SearchController;
let errMock: any;

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

describe('shopify/pluginMutateResults', () => {
	beforeAll(async () => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, createControllerServices());
		errMock = jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	beforeEach(() => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, createControllerServices());

		// @ts-ignore
		window.Shopify = {
			routes: {
				root: ROOT,
			},
		};
	});

	afterEach(() => {
		errMock.mockRestore();
	});

	it('will log a warning if Shopify global does not exist', () => {
		// @ts-ignore - remove Shopify global
		delete window.Shopify;

		const collectionContext = {
			handle: 'collection-handle',
			name: 'Collection Name',
		};
		controller.context.collection = collectionContext;

		const config = {
			mutations: {
				collectionInUrl: {
					enabled: true,
				},
			},
		};

		pluginShopifyMutateResults(controller, config);

		expect(errMock).toHaveBeenCalledWith(
			expect.stringContaining('window.Shopify not found'),
			expect.any(String),
			expect.any(String),
			expect.any(String)
		);
	});

	it('can disable plugin entirely', async () => {
		// plugin requires collection context
		const collectionContext = {
			handle: 'collection-handle',
			name: 'Collection Name',
		};

		// plugin requires a collection handle
		controller.context.collection = collectionContext;

		const config = {
			enabled: false,
			mutations: {
				collectionInUrl: {
					enabled: true,
				},
			},
		};

		pluginShopifyMutateResults(controller, config);

		await controller.search();

		// plugin requires handle attribute
		expect(controller.store.results[0].attributes.handle).toBeDefined();
		expect(errMock).not.toHaveBeenCalled();

		expect(controller.store.results[0].mappings.core?.url).toEqual(`/product/C-LTO-R6-L5316`);
	});

	describe('mutation/collectionInUrl', () => {
		it('uses context.collection.handle to update result URLs (and is enabled by default)', async () => {
			// plugin requires collection context
			const collectionContext = {
				handle: 'collection-handle',
				name: 'Collection Name',
			};
			controller.context.collection = collectionContext;

			pluginShopifyMutateResults(controller);

			await controller.search();

			// plugin requires handle attribute
			expect(controller.store.results[0].attributes.handle).toBeDefined();
			expect(errMock).not.toHaveBeenCalled();

			// uses Shopify route, collection handle and result handle to build product URL
			expect(controller.store.results[0].mappings.core?.url).toEqual(
				`${ROOT}collections/${collectionContext.handle}/products/${controller.store.results[0].attributes.handle}`
			);
		});

		it('requires context.collection to be defined', async () => {
			const config = {
				mutations: {
					collectionInUrl: {
						enabled: true,
					},
				},
			};

			pluginShopifyMutateResults(controller, config);
			await controller.search();

			expect(errMock).not.toHaveBeenCalled();
			expect(controller.store.results[0].mappings.core?.url).toEqual(`/product/C-LTO-R6-L5316`);
		});

		it('can be disabled', async () => {
			const config = {
				mutations: {
					collectionInUrl: {
						enabled: false,
					},
				},
			};

			pluginShopifyMutateResults(controller, config);
			await controller.search();

			expect(errMock).not.toHaveBeenCalled();
			expect(controller.store.results[0].mappings.core?.url).toEqual(`/product/C-LTO-R6-L5316`);
		});
	});
});
