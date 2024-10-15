import { pluginMutateResults } from './pluginMutateResults';
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
let controller: any;
let errMock: any;

const controllerServices: any = {
	client: new MockClient(globals, {}),
	store: new SearchStore(searchConfig, services),
	urlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(globals),
};

describe('Shopify pluginMutateResults', () => {
	describe('requires Shopify to exist as a global on the window', () => {
		beforeAll(async () => {
			searchConfig = { ...searchConfigDefault };
			controller = new SearchController(searchConfig, controllerServices);
			errMock = jest.spyOn(console, 'log').mockImplementation(() => {});
		});

		beforeEach(() => {
			delete window.Shopify;
		});

		afterEach(() => {
			errMock.mockRestore();
		});

		it('will log a warning if Shopify global does not exist', () => {
			const collectionContext = {
				handle: 'collection-handle',
				name: 'Collection Name',
			};
			controller.context.collection = collectionContext;

			const config = {
				collectionInUrl: {
					enabled: true,
				},
			};

			pluginMutateResults(controller, config);

			expect(errMock).toHaveBeenCalledWith(
				expect.stringContaining('window.Shopify not found'),
				expect.any(String),
				expect.any(String),
				expect.any(String)
			);
		});
	});

	describe('has Shopify as a global on the window', () => {
		beforeAll(async () => {
			errMock = jest.spyOn(console, 'log').mockImplementation(() => {});
		});

		beforeEach(() => {
			searchConfig = { ...searchConfigDefault };
			controller = new SearchController(searchConfig, controllerServices);

			global.window = Object.create(window);

			Object.defineProperty(window, 'location', {
				value: {
					origin: ORIGIN,
					href: ORIGIN,
				},
				writable: true,
			});

			// @ts-ignore
			global.Shopify = {
				routes: {
					root: ROOT,
				},
			};
		});

		afterEach(() => {
			errMock.mockRestore();
		});

		it('requires config.enabled', async () => {
			const config = {
				collectionInUrl: {
					enabled: false,
				},
			};

			pluginMutateResults(controller, config);
			await controller.search();

			expect(errMock).not.toHaveBeenCalled();
			expect(controller.store.results[0].mappings.core?.url).toEqual(`/product/C-LTO-R6-L5316`);
		});

		it('requires context.collection to be defined', async () => {
			const config = {
				collectionInUrl: {
					enabled: true,
				},
			};

			pluginMutateResults(controller, config);
			await controller.search();

			expect(errMock).not.toHaveBeenCalled();
			expect(controller.store.results[0].mappings.core?.url).toEqual(`/product/C-LTO-R6-L5316`);
		});

		it('has context.collection defined', async () => {
			// plugin requires collection context
			const collectionContext = {
				handle: 'collection-handle',
				name: 'Collection Name',
			};
			controller.context.collection = collectionContext;

			const config = {
				collectionInUrl: {
					enabled: true,
				},
			};

			pluginMutateResults(controller, config);

			await controller.search();

			// plugin requires handle attribute
			expect(controller.store.results[0].attributes.handle).toBeDefined();
			expect(errMock).not.toHaveBeenCalled();

			expect(controller.store.results[0].mappings.core?.url).toEqual(
				`${ROOT}collections/${collectionContext.handle}/products/${controller.store.results[0].attributes.handle}`
			);
		});
	});
});
