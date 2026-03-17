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

		it('skips caching when entry alone exceeds maxSize', async () => {
			const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

			const cacheConfig = {
				ttl: 10000,
				enabled: true,
				maxSize: 0.001, // very small maxSize (1 byte)
				purgeable: true,
			};

			const cache = new NetworkCache(cacheConfig);

			// Try to cache an object that exceeds maxSize
			cache.set('oversizedKey', typedResponse);

			// The entry should not be cached
			expect(cache.get('oversizedKey')).toBeUndefined();

			// @ts-ignore
			expect(cache.memoryCache['oversizedKey']).toBeUndefined();

			// Verify warning was logged
			expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('exceeds maxSize'));

			consoleWarnSpy.mockRestore();
		});

		it('skips caching when entry cannot fit after purging non-purgeable items', async () => {
			const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

			// First cache a non-purgeable item that takes up space
			const nonPurgeableCache = new NetworkCache({
				ttl: 10000,
				enabled: true,
				maxSize: 4, // KB - small enough that we'll hit the limit
				purgeable: false,
			});

			nonPurgeableCache.set('nonPurgeableKey', typedResponse);

			// Now try to add another item with the same cache instance
			// The non-purgeable item can't be evicted, so the new item won't fit
			nonPurgeableCache.set('newKey', typedResponse);

			// The non-purgeable entry should still exist
			expect(nonPurgeableCache.get('nonPurgeableKey')).toEqual(typedResponse);

			// The new entry should not be cached since it couldn't fit
			expect(nonPurgeableCache.get('newKey')).toBeUndefined();

			// Verify warning was logged about being unable to cache
			expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Unable to cache entry'));

			consoleWarnSpy.mockRestore();
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

	describe('memoryOnly config setting', () => {
		it('does not write to session storage when memoryOnly is true', async () => {
			mockStorage = {};
			const cache = new NetworkCache({ memoryOnly: true });

			cache.set('memoryOnlyKey', typedResponse);

			// Memory cache should have the value
			expect(cache.get('memoryOnlyKey')).toEqual(typedResponse);

			// Session storage should remain empty or undefined
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();
		});

		it('does write to session storage when memoryOnly is false (default)', async () => {
			mockStorage = {};
			const cache = new NetworkCache({ memoryOnly: false });

			cache.set('persistedKey', typedResponse);

			// Memory cache should have the value
			expect(cache.get('persistedKey')).toEqual(typedResponse);

			// Session storage should have data
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeDefined();
			const stored = JSON.parse(mockStorage[CACHE_STORAGE_KEY]);
			expect(stored['persistedKey']).toBeDefined();
		});

		it('does not load from session storage when memoryOnly is true', async () => {
			// Pre-populate session storage
			const storedCache = {
				preExistingKey: {
					value: typedResponse,
					expires: Date.now() + 10000,
					purgeable: true,
				},
			};
			mockStorage[CACHE_STORAGE_KEY] = JSON.stringify(storedCache);

			const cache = new NetworkCache({ memoryOnly: true });

			// Should not find the pre-existing key since memoryOnly skips loading from storage
			expect(cache.get('preExistingKey')).toBeUndefined();
		});

		it('does load from session storage when memoryOnly is false', async () => {
			// Pre-populate session storage
			const storedCache = {
				preExistingKey: {
					value: typedResponse,
					expires: Date.now() + 10000,
					purgeable: true,
				},
			};
			mockStorage[CACHE_STORAGE_KEY] = JSON.stringify(storedCache);

			const cache = new NetworkCache({ memoryOnly: false });

			// Should find the pre-existing key
			expect(cache.get('preExistingKey')).toEqual(typedResponse);
		});

		it('does not update session storage on purgeExpired when memoryOnly is true', async () => {
			mockStorage = {};
			const cache = new NetworkCache({ memoryOnly: true, ttl: 0 });

			cache.set('expiredKey', typedResponse);

			// Trigger purge by calling load
			cache.load();

			// Session storage should still be empty
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();
		});

		it('does not clear session storage when memoryOnly is true', async () => {
			// Pre-populate session storage
			const storedCache = {
				existingKey: {
					value: typedResponse,
					expires: Date.now() + 10000,
					purgeable: true,
				},
			};
			mockStorage[CACHE_STORAGE_KEY] = JSON.stringify(storedCache);

			const cache = new NetworkCache({ memoryOnly: true });

			// Add something to memory cache
			cache.set('memoryKey', typedResponse);

			// Clear the cache
			cache.clear();

			// Memory cache should be empty
			// @ts-ignore
			expect(cache.memoryCache).toEqual({});

			// Session storage should still have the original data (not cleared)
			expect(mockStorage[CACHE_STORAGE_KEY]).toEqual(JSON.stringify(storedCache));
		});

		it('clears session storage when memoryOnly is false', async () => {
			mockStorage = {};
			const cache = new NetworkCache({ memoryOnly: false });

			cache.set('keyToClear', typedResponse);

			// Verify it was stored
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeDefined();

			cache.clear();

			// Session storage should be cleared
			expect(mockStorage[CACHE_STORAGE_KEY]).toEqual('');
		});

		it('memoryOnly cache is isolated per instance', async () => {
			mockStorage = {};

			const cache1 = new NetworkCache({ memoryOnly: true });
			const cache2 = new NetworkCache({ memoryOnly: true });

			cache1.set('cache1Key', typedResponse);

			// cache1 should have its key
			expect(cache1.get('cache1Key')).toEqual(typedResponse);

			// cache2 should not have cache1's key since memoryOnly caches don't share via session storage
			expect(cache2.get('cache1Key')).toBeUndefined();
		});

		it('pre-populated entries work with memoryOnly', async () => {
			mockStorage = {};
			const key = 'prePopulatedKey';
			const cache = new NetworkCache({
				memoryOnly: true,
				entries: {
					[key]: typedResponse,
				},
			});

			// Should be able to get the pre-populated entry
			expect(cache.get(key)).toEqual(typedResponse);

			// Session storage should remain empty
			expect(mockStorage[CACHE_STORAGE_KEY]).toBeUndefined();
		});
	});
});
