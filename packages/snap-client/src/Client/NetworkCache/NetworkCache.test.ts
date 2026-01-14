import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';
import type { SearchControllerConfig } from '../../../../snap-controller/src/types';
import { NetworkCache } from '../NetworkCache/NetworkCache';
import { MockData } from '@searchspring/snap-shared';

const mockData = new MockData();
const CACHE_STORAGE_KEY = 'ss-networkcache';

const typedResponse = mockData.meta() as Response;

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

let mockStorage: {
	[key: string]: string;
} = {};

describe('Network Cache', () => {
	beforeAll(() => {
		global.Storage.prototype.setItem = jest.fn((key, value) => {
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);

		Object.defineProperty(window, 'performance', {
			value: {
				getEntriesByType: jest.fn().mockReturnValue([{ type: 'navigate' }]),
			},
		});
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

	describe('can set, get and clear', () => {
		it('can use the set function', async () => {
			const cache = new NetworkCache();

			// @ts-ignore
			const memoryCache = cache.memoryCache;

			expect(memoryCache).toBeDefined();
			expect(memoryCache).toEqual({});

			// localStorage empty initially
			expect(mockStorage[CACHE_STORAGE_KEY]).toEqual('{}');

			cache.set('key', typedResponse);

			// @ts-ignore
			const UpdatedMemoryCache = cache.memoryCache;

			expect(UpdatedMemoryCache).not.toEqual({});

			expect(mockStorage[CACHE_STORAGE_KEY]).toBeDefined();
		});

		it('can use the get function', async () => {
			const cache = new NetworkCache();

			cache.set('key', typedResponse);
			const getterResponse = cache.get('key');

			expect(getterResponse).toEqual(typedResponse);
		});

		it('can use the get & clear function', async () => {
			const cache = new NetworkCache();
			cache.set('key', typedResponse);

			const getterResponse = cache.get('key');

			expect(getterResponse).toEqual(typedResponse);

			cache.clear();
			expect(mockStorage[CACHE_STORAGE_KEY]).toEqual('');

			// @ts-ignore
			const NewmemoryCache = cache.memoryCache;
			expect(NewmemoryCache).toEqual({});
		});

		it('the get function returns undefined when it finds no key', async () => {
			const cache = new NetworkCache();

			const getterResponse = cache.get('thisdoesntexist');

			expect(getterResponse).toEqual(undefined);
		});

		it('will not get an entry that is expired', async () => {
			// setting expiration to zero
			const cache = new NetworkCache({
				ttl: 0,
			});

			cache.set('expiredKey', typedResponse);
			const getterResponse = cache.get('expiredKey');
			expect(getterResponse).toEqual(undefined);
		});
	});

	describe('can set custom config settings', () => {
		it('can set custom ttl to expire memoryCache entities', () => {
			const cacheConfig = {
				ttl: 1000,
				enabled: true,
				maxSize: 4, // KB
				purgeable: true,
			};

			const cache = new NetworkCache(cacheConfig);

			cache.set('key', typedResponse);

			expect(cache.get('key')).toEqual(typedResponse);

			setTimeout(() => {
				expect(cache.get('key')).toEqual(undefined);
			}, 1200);
		});

		it('has a max size for memory', async () => {
			const cacheConfig = {
				ttl: 1000,
				enabled: true,
				maxSize: 20, // KB
				purgeable: true,
			};

			const cache = new NetworkCache(cacheConfig);

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

			// removes oldest entry 'key' as storage limit exceeded
			expect(cache.get('key')).not.toEqual(typedResponse);
			expect(cache.get('key10')).toEqual(typedResponse);
		});

		it('can disable purging max size for local storage', async () => {
			const cacheConfig = {
				ttl: 10000,
				enabled: true,
				maxSize: 4, // KB
				purgeable: false,
			};

			const cacheConfig2 = {
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
			const localData = stored && JSON.parse(stored);
			expect(localData['key2']).toBeUndefined();
			expect(localData['thisRemains'].value).toEqual(typedResponse);
		});

		it('can pass in cache to set', async () => {
			const key = 'key';
			const cacheConfig = {
				entries: {
					[key]: typedResponse,
				},
			};
			const cache = new NetworkCache(cacheConfig);
			// @ts-ignore
			const memoryCache = cache.memoryCache;
			expect(memoryCache[key].value).toEqual(typedResponse);
			expect(cache.get(key)).toEqual(typedResponse);
		});
	});

	describe('initialization from storage', () => {
		it('loads existing cache from session storage on initialization', () => {
			const storedCache = {
				existingKey: {
					value: typedResponse,
					expires: Date.now() + 10000,
					purgeable: true,
				},
			};
			mockStorage[CACHE_STORAGE_KEY] = JSON.stringify(storedCache);

			const cache = new NetworkCache();
			expect(cache.get('existingKey')).toEqual(typedResponse);
		});

		it('purges expired items from session storage on initialization', () => {
			const storedCache = {
				expiredKey: {
					value: typedResponse,
					expires: Date.now() - 10000, // Expired
					purgeable: true,
				},
				validKey: {
					value: typedResponse,
					expires: Date.now() + 10000,
					purgeable: true,
				},
			};
			mockStorage[CACHE_STORAGE_KEY] = JSON.stringify(storedCache);

			const cache = new NetworkCache();
			expect(cache.get('expiredKey')).toBeUndefined();
			expect(cache.get('validKey')).toEqual(typedResponse);
		});
	});

	describe('get function behavior', () => {
		it('can retrieve a cached response with ignored keys during back/forward navigation', async () => {
			const cache = new NetworkCache();
			const url = '/api/search/search.json';
			const payload = { q: 'dress', lastViewed: ['123'], cart: ['456'] };
			const key = `${url}${JSON.stringify(payload)}`;
			const cachedPayload = { q: 'dress', lastViewed: ['789'], cart: ['012'] };
			const cachedKey = `${url}${JSON.stringify(cachedPayload)}`;

			// Mock performance.getEntriesByType
			Object.defineProperty(performance, 'getEntriesByType', {
				value: jest.fn().mockReturnValue([{ type: 'back_forward' }]),
				writable: true,
			});

			// Set initial cache
			cache.set(cachedKey, typedResponse);

			// Attempt to get with different ignored keys
			const response = cache.get(key);
			expect(response).toEqual(typedResponse);
		});

		it('does not retrieve a cached response with different non-ignored keys during back/forward navigation', async () => {
			const cache = new NetworkCache();
			const url = '/api/search/search.json';
			const payload = { q: 'dress', lastViewed: ['123'], cart: ['456'] };
			const key = `${url}${JSON.stringify(payload)}`;
			const cachedPayload = { q: 'shoes', lastViewed: ['789'], cart: ['012'] };
			const cachedKey = `${url}${JSON.stringify(cachedPayload)}`;

			// Mock performance.getEntriesByType
			Object.defineProperty(performance, 'getEntriesByType', {
				value: jest.fn().mockReturnValue([{ type: 'back_forward' }]),
				writable: true,
			});

			// Set initial cache
			cache.set(cachedKey, typedResponse);

			// Attempt to get with different non-ignored keys
			const response = cache.get(key);
			expect(response).toBeUndefined();
		});

		it('does not ignore keys during normal navigation', async () => {
			const cache = new NetworkCache();
			const url = '/api/search/search.json';
			const payload = { q: 'dress', lastViewed: ['123'], cart: ['456'] };
			const key = `${url}${JSON.stringify(payload)}`;
			const cachedPayload = { q: 'dress', lastViewed: ['789'], cart: ['012'] };
			const cachedKey = `${url}${JSON.stringify(cachedPayload)}`;

			// Mock performance.getEntriesByType
			Object.defineProperty(performance, 'getEntriesByType', {
				value: jest.fn().mockReturnValue([{ type: 'navigate' }]),
				writable: true,
			});

			// Set initial cache
			cache.set(cachedKey, typedResponse);

			// Attempt to get with different ignored keys
			const response = cache.get(key);
			expect(response).toBeUndefined();
		});
	});
});
