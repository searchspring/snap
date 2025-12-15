import deepmerge from 'deepmerge';

import { CacheConfig, Cache, DefaultCacheConfig } from '../../types';

const CACHE_STORAGE_KEY = 'ss-networkcache';

const defaultConfig: DefaultCacheConfig = {
	enabled: true,
	ttl: 300000, // ms
	maxSize: 1000, // KB
	purgeable: true,
};

export class NetworkCache {
	protected memoryCache: Cache = {};
	protected config: DefaultCacheConfig;

	constructor(config?: CacheConfig) {
		this.config = deepmerge(defaultConfig, config || {});

		this.load();

		// this allows you to pre-populate the cache from the config - primarily used for email recs
		this.config?.entries &&
			Object.keys(this.config.entries).map((key: string) => {
				if (this.config.entries && this.config.entries[key]) {
					this.set(key, this.config.entries[key]);
				}
			});
	}

	public load(): void {
		// initialize cache from session storage
		if (typeof window !== 'undefined' && window?.sessionStorage) {
			const stored: any = window.sessionStorage.getItem(CACHE_STORAGE_KEY);
			const newStored: Cache = {
				...(stored && JSON.parse(stored)),
			};

			this.memoryCache = newStored || {};
		}

		this.purgeExpired();
	}

	public get(key: string): Response | void {
		if (this.config.enabled) {
			this.load();

			try {
				let ignoreKeys: string[] = [];
				if (typeof window !== 'undefined') {
					const navigationType = (window.performance?.getEntriesByType('navigation')?.[0] as PerformanceNavigationTiming | undefined)?.type;
					if (navigationType === 'back_forward') {
						ignoreKeys = ['lastViewed', 'cart'];
					}
				}

				if (Object.keys(this.memoryCache).length && key) {
					let storageKey = key;

					//this only applies to search calls
					if (ignoreKeys.length && key.startsWith('/api/search/search.json')) {
						try {
							const url = key.split('{')[0];
							const payload = '{' + key.split('{')[1];
							const searchParams = JSON.parse(payload);

							const foundKey = Object.keys(this.memoryCache).find((cachedResponse) => {
								try {
									const storedUrl = cachedResponse.split('{')[0];
									if (storedUrl == url) {
										const storedPayload = '{' + cachedResponse.split('{')[1];

										const parsedPayload = JSON.parse(storedPayload);

										const allKeys = Array.from(new Set([...Object.keys(searchParams), ...Object.keys(parsedPayload)]));

										for (const k of allKeys) {
											if (ignoreKeys.includes(k)) continue;
											if (JSON.stringify(searchParams[k]) !== JSON.stringify(parsedPayload[k])) {
												return false;
											}
										}
										return true;
									} else return false;
								} catch {
									return false;
								}
							});

							if (foundKey) {
								storageKey = foundKey;
							}
						} catch (e) {
							// key is not json
						}
					}

					if (this.memoryCache[storageKey]) {
						// compare the expiry time of the item with the current time
						if (Date.now() >= this.memoryCache[storageKey].expires) {
							// remove item
							const newStored = {
								...this.memoryCache,
							};
							delete newStored[storageKey];
							// update storage
							window.sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(newStored));
						} else {
							return this.memoryCache[storageKey].value;
						}
					}
				}
			} catch (err) {
				console.warn('something went wrong getting from cache', err);
			}
		}
	}

	private purgeExpired(): void {
		Object.keys(this.memoryCache).forEach((cacheKey) => {
			//clean up expired cache keys in memory
			if (Date.now() > this.memoryCache[cacheKey].expires) {
				delete this.memoryCache[cacheKey];
			}
		});

		// update storage
		try {
			if (typeof window !== 'undefined' && window?.sessionStorage) {
				const stringifiedCache = JSON.stringify(this.memoryCache);
				window.sessionStorage.setItem(CACHE_STORAGE_KEY, stringifiedCache);
			}
		} catch {
			console.warn('failed to store network cache');
		}
	}

	public set(key: string, value: Response): void {
		if (this.config.enabled) {
			this.load();

			try {
				const cacheObject = {
					value,
					expires: Date.now() + this.config.ttl,
					purgeable: this.config.purgeable,
				};

				// purge old items if we are over max size
				let size = new Blob([JSON.stringify(this.memoryCache)], { endings: 'native' }).size / 1024;
				while (size > this.config.maxSize) {
					const oldestKey = Object.keys(this.memoryCache)
						.filter((key) => this.memoryCache[key].purgeable)
						.sort((a, b) => {
							return this.memoryCache[a].expires - this.memoryCache[b].expires;
						})[0];

					if (!oldestKey) break;
					delete this.memoryCache[oldestKey];

					// recalculate size after removing oldest
					size = new Blob([JSON.stringify(this.memoryCache)], { endings: 'native' }).size / 1024;
				}

				// store cache in memory
				this.memoryCache[key] = cacheObject;

				if (typeof window !== 'undefined' && window?.sessionStorage) {
					window.sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(this.memoryCache));
				}
			} catch {
				console.warn('something went wrong setting to cache');
			}
		}
	}

	public clear() {
		try {
			this.memoryCache = {};
			if (typeof window !== 'undefined' && window?.sessionStorage) {
				window.sessionStorage.setItem(CACHE_STORAGE_KEY, '');
			}
		} catch {
			console.warn('something went wrong clearing cache');
		}
	}
}
