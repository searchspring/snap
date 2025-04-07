import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';
import { Client, ClientConfig } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController, SearchControllerConfig } from '@searchspring/snap-controller';

describe('Snap Client Integration Tests', () => {
	describe('NetworkCache integration tests', () => {
		const globals = { siteId: '8uyt2m' };
		const CACHE_STORAGE_KEY = 'ss-networkcache';

		const searchConfig: SearchControllerConfig = {
			id: 'search',
			globals: {
				filters: [],
			},
			settings: {
				redirects: {
					merchandising: false,
				},
			},
		};

		const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
		const services = { urlManager };

		let mockStorage: {
			[key: string]: string;
		} = {};

		beforeAll(() => {
			global.Storage.prototype.setItem = jest.fn((key, value) => {
				mockStorage[key] = value;
			});
			global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
		});

		beforeEach(() => {
			// make sure the storage starts out empty for each test
			mockStorage = {};
			jest.clearAllMocks();
		});

		afterAll(() => {
			// return our mocks to their original values
			// 🚨 THIS IS VERY IMPORTANT to avoid polluting future tests!
			//@ts-ignore
			global.Storage.prototype.setItem.mockRestore();
			//@ts-ignore
			global.Storage.prototype.getItem.mockRestore();
		});

		beforeEach(() => {
			searchConfig.id = uuidv4().split('-').join('');
		});

		it('Caches search responses and uses them', async () => {
			//mock fetch
			const fetchfn = jest.spyOn(global.window, 'fetch');

			const controller = new SearchController(searchConfig, {
				client: new Client(globals),
				store: new SearchStore(searchConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
			//no cache initially
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();

			//make a search
			await controller.search();
			// wait beacon.js REQUEST_GROUPING_TIMEOUT + 100ms for render event to fire
			await new Promise((resolve) => setTimeout(resolve, 300));

			//expect meta and search calls to fire
			expect(fetchfn).toHaveBeenCalledTimes(3);

			//now we have cache
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeDefined();

			// we used the cache
			expect(global.Storage.prototype.getItem).toHaveBeenCalled();

			controller.urlManager.set('query', 'dress').go();
			// wait 1s because go is async
			await new Promise((resolve) => setTimeout(resolve, 1000));

			//cache was updated
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeDefined();

			//it did make additional calls because the params changed
			expect(fetchfn).toHaveBeenCalledTimes(5);

			//check that there are results that we pulled from cache
			expect(controller.store.results.length).toBeGreaterThan(0);

			controller.urlManager.reset().set('query', '').go();
			// cached search so just need to wait for render event
			await new Promise((resolve) => setTimeout(resolve, 300));

			//but it did not make additional calls and used previous cache response
			expect(fetchfn).toHaveBeenCalledTimes(6);

			fetchfn.mockReset();
		});

		it('Cache can be disabled via requester configs', async () => {
			//mock fetch
			const fetchfn = jest.spyOn(global.window, 'fetch');

			const clientConfig = {
				search: {
					cache: {
						enabled: false,
					},
				},
				meta: {
					cache: {
						enabled: false,
					},
				},
			};

			const controller = new SearchController(searchConfig, {
				client: new Client(globals, clientConfig),
				store: new SearchStore(searchConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
			//no cache initially
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();

			//make a search
			await controller.search();

			//expect meta and search calls to fire
			expect(fetchfn).toHaveBeenCalledTimes(2);

			//still no cache
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();

			//make another call
			await controller.search();

			//cache was updated
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();

			//but it did make additional calls
			expect(fetchfn).toHaveBeenCalledTimes(4);

			fetchfn.mockReset();
		});

		it('Cache can be disabled via client mode', async () => {
			//mock fetch
			const fetchfn = jest.spyOn(global.window, 'fetch');

			const clientConfig: ClientConfig = {
				mode: 'development',
			};

			const controller = new SearchController(searchConfig, {
				client: new Client(globals, clientConfig),
				store: new SearchStore(searchConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
			//no cache initially
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();

			//make a search
			await controller.search();

			//expect meta and search calls to fire
			expect(fetchfn).toHaveBeenCalledTimes(2);

			//still no cache
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();

			//make another call
			await controller.search();

			//cache was updated
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();

			//but it did make additional calls
			expect(fetchfn).toHaveBeenCalledTimes(4);

			fetchfn.mockReset();
		});
	});
});
