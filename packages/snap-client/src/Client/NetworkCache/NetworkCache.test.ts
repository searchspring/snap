import 'whatwg-fetch';

import { v4 as uuidv4 } from 'uuid';
import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '../../../../snap-controller/src';
import type { SearchControllerConfig } from '../../../../snap-controller/src/types';
import { NetworkCache } from '../NetworkCache/NetworkCache';

const globals = { siteId: '8uyt2m' };
const CACHE_STORAGE_KEY = 'ss-networkcache';
const metaResponse = {
	facets: {
		brand: {
			display: 'list',
			label: 'Brand',
			collapsed: false,
			multiple: 'or',
		},
		collection: {
			display: 'list',
			label: 'Collection',
			collapsed: false,
			multiple: 'or',
		},
		color_family: {
			display: 'palette',
			label: 'Color',
			collapsed: false,
			multiple: 'or',
		},
	},
	sortOptions: [
		{
			type: 'relevance',
			field: 'relevance',
			direction: 'desc',
			label: 'Best Match',
		},
		{
			type: 'field',
			field: 'sales_rank',
			direction: 'desc',
			label: 'Most Popular',
		},
	],
};

const typedResponse = metaResponse as unknown as Response;

let searchConfig: SearchControllerConfig = {
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

let mockStorage = {};

describe('Network Cache', () => {
	beforeAll(() => {
		global.Storage.prototype.setItem = jest.fn((key, value) => {
			// console.log(key, value);
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
	});

	beforeEach(() => {
		// make sure the storage starts out empty for each test
		mockStorage = {};
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
	it('caches search responses and uses them', async () => {
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

		//mock fetch
		const fetchfn = jest.spyOn(global.window, 'fetch');

		//make a search
		await controller.search();

		//expect meta and search calls to fire
		expect(fetchfn).toHaveBeenCalledTimes(2);

		//now we have cache
		expect(mockStorage[CACHE_STORAGE_KEY]).toBeDefined();

		// we used the cache
		expect(global.Storage.prototype.getItem).toHaveBeenCalled();

		controller.urlManager.reset().set('query', 'dress').go();
		//make another call
		await controller.search();

		//cache was updated
		expect(mockStorage[CACHE_STORAGE_KEY]).toBeDefined();

		//it did make additional calls because the params changed
		expect(fetchfn).toHaveBeenCalledTimes(4);

		//check that there are results that we pulled from cache
		expect(controller.store.results.length).toBeGreaterThan(0);

		controller.urlManager.reset().set('query', '').go();
		//make another call
		await controller.search();

		//but it did not make additional calls and used previous cache response
		expect(fetchfn).toHaveBeenCalledTimes(4);

		fetchfn.mockClear();

		fetchfn.mockReset();
	});

	it('can be disabled via the config', async () => {
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

		//mock fetch
		const fetchfn = jest.spyOn(global.window, 'fetch');

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
	});

	describe('can set, get and clear', () => {
		const cache = new NetworkCache();

		// @ts-ignore
		let memoryCache = cache.memoryCache;

		it('can use the set function', async () => {
			expect(memoryCache).toBeDefined();
			expect(memoryCache).toEqual({});

			//no localStorage initially
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();

			cache.set('key', typedResponse);

			// @ts-ignore
			let UpdatedMemoryCache = cache.memoryCache;

			expect(UpdatedMemoryCache).not.toEqual({});

			expect(mockStorage[CACHE_STORAGE_KEY]).toBeDefined();
		});

		it('can use the get function', async () => {
			const getterResponse = cache.get('key');

			expect(getterResponse).toEqual(typedResponse);
		});

		it('can use the get & clear function', async () => {
			const getterResponse = cache.get('key');

			expect(getterResponse).toEqual(typedResponse);

			cache.clear();
			expect(mockStorage[CACHE_STORAGE_KEY]).toEqual('');

			// @ts-ignore
			let NewmemoryCache = cache.memoryCache;
			expect(NewmemoryCache).toEqual({});
		});

		it('the get function returns undefined when it finds no key', async () => {
			const getterResponse = cache.get('thisdoesntexist');

			expect(getterResponse).toEqual(undefined);
		});
	});

	describe('can set custom config settings', () => {
		let cacheConfig = {
			ttl: 1000,
			enabled: true,
			maxSize: 2, // KB
			purgeable: true,
		};

		const cache = new NetworkCache(cacheConfig);

		cache.set('key', typedResponse);

		expect(cache.get('key')).toEqual(typedResponse);

		it('can set custom ttl to expire memoryCache entities', () => {
			setTimeout(() => {
				expect(cache.get('key')).toEqual(undefined);
			}, 1200);
		});

		it('no max size for memory', async () => {
			await cache.set('key', typedResponse);
			await cache.set('key2', typedResponse);
			await cache.set('key3', typedResponse);
			await cache.set('key4', typedResponse);
			await cache.set('key5', typedResponse);
			await cache.set('key6', typedResponse);
			await cache.set('key7', typedResponse);
			await cache.set('key8', typedResponse);
			await cache.set('key9', typedResponse);
			await cache.set('key10', typedResponse);

			expect(cache.get('key')).toEqual(typedResponse);
			expect(cache.get('key10')).toEqual(typedResponse);
		});

		it('has max size for local storage', async () => {
			await cache.set('key', typedResponse);
			await cache.set('key2', typedResponse);
			await cache.set('key3', typedResponse);
			await cache.set('key4', typedResponse);
			await cache.set('key5', typedResponse);
			await cache.set('key6', typedResponse);
			await cache.set('key7', typedResponse);
			await cache.set('key8', typedResponse);
			await cache.set('key9', typedResponse);
			await cache.set('key10', typedResponse);

			const stored = sessionStorage.getItem(CACHE_STORAGE_KEY);
			const localData: Cache = stored && JSON.parse(stored);
			expect(localData['key']).toBeUndefined();
			expect(localData['key10'].value).toEqual(typedResponse);
		});

		it('can disable purging max size for local storage', async () => {
			let cacheConfig = {
				ttl: 1000,
				enabled: true,
				maxSize: 2, // KB
				purgeable: false,
			};

			let cacheConfig2 = {
				...cacheConfig,
				purgeable: true,
			};

			const cache = new NetworkCache(cacheConfig);

			const cache2 = new NetworkCache(cacheConfig2);

			await cache.set('thisRemains', typedResponse);
			await cache2.set('key2', typedResponse);
			await cache2.set('key3', typedResponse);
			await cache2.set('key4', typedResponse);
			await cache2.set('key5', typedResponse);
			await cache2.set('key6', typedResponse);
			await cache2.set('key7', typedResponse);
			await cache2.set('key8', typedResponse);
			await cache2.set('key9', typedResponse);
			await cache2.set('key10', typedResponse);

			const stored = sessionStorage.getItem(CACHE_STORAGE_KEY);
			const localData: Cache = stored && JSON.parse(stored);
			expect(localData['key2']).toBeUndefined();
			expect(localData['thisRemains'].value).toEqual(typedResponse);
		});

		it('can pass in cache to set', async () => {
			const key = 'key';
			let cacheConfig = {
				entries: {
					[key]: typedResponse,
				},
			};
			const cache = new NetworkCache(cacheConfig);
			// @ts-ignore
			let memoryCache = cache.memoryCache;
			expect(memoryCache['key'].value).toEqual(typedResponse);
		});
	});
});
