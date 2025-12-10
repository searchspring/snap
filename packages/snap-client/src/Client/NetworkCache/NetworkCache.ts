import deepmerge from 'deepmerge';

import { CacheConfig, Cache, DefaultCacheConfig } from '../../types';

const CACHE_STORAGE_KEY = 'ss-networkcache';

const defaultConfig: DefaultCacheConfig = {
	enabled: true,
	ttl: 300000, // ms
	maxSize: 200, // KB
	purgeable: true,
};

export class NetworkCache {
	protected memoryCache: Cache = {};
	protected config: DefaultCacheConfig;

	constructor(config?: CacheConfig) {
		this.config = deepmerge(defaultConfig, config || {});

		this.config?.entries &&
			Object.keys(this.config.entries).map((key: string) => {
				if (this.config.entries && this.config.entries[key]) {
					this.set(key, this.config.entries[key]);
				}
			});
	}

	public get(key: string): Response | void {
		if (this.config.enabled) {
			try {
				if (this.memoryCache[key]) {
					if (Date.now() < this.memoryCache[key].expires) {
						return deepmerge({}, this.memoryCache[key].value);
					}
				}

				let ignoreKeys: string[] = [];
				const navigationType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type;
				if (typeof window !== 'undefined' && navigationType === 'back_forward') {
					ignoreKeys = ['lastViewed', 'cart'];
				}

				if (typeof window !== 'undefined' && window?.sessionStorage) {
					const stored = window.sessionStorage.getItem(CACHE_STORAGE_KEY);
					const localData: Cache = stored && JSON.parse(stored);

					if (localData && key) {
						let storageKey = key;

						//this only applies to search calls
						if (ignoreKeys.length && key.startsWith('/api/search/search.json')) {
							try {
								const url = key.split('{')[0];
								const payload = '{' + key.split('{')[1];
								const searchParams = JSON.parse(payload);

								const foundKey = Object.keys(localData).find((cachedResponse) => {
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

						if (localData[storageKey]) {
							// compare the expiry time of the item with the current time
							if (Date.now() >= localData[storageKey].expires) {
								// remove item
								const newStored = {
									...localData,
								};
								delete newStored[storageKey];
								// update storage
								window.sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(newStored));
							} else {
								return localData[storageKey].value;
							}
						}
					}
				}
			} catch {
				console.warn('something went wrong getting from cache');
			}
		}
	}

	public set(key: string, value: Response): void {
		if (this.config.enabled) {
			try {
				const cacheObject = {
					value,
					expires: Date.now() + this.config.ttl,
					purgeable: this.config.purgeable,
				};

				this.memoryCache[key] = cacheObject;

				if (typeof window !== 'undefined' && window?.sessionStorage) {
					const stored: any = window.sessionStorage.getItem(CACHE_STORAGE_KEY);
					const newStored: Cache = {
						...(stored && JSON.parse(stored)),
					};
					newStored[key] = cacheObject;

					let size = new Blob([JSON.stringify(newStored)], { endings: 'native' }).size / 1024;
					while (size > this.config.maxSize) {
						const oldestKey = Object.keys(newStored)
							.filter((key) => newStored[key].purgeable)
							.sort((a, b) => {
								return newStored[a].expires - newStored[b].expires;
							})[0];

						if (!oldestKey) break;
						delete newStored[oldestKey];

						// recalculate size after removing oldest
						size = new Blob([JSON.stringify(newStored)], { endings: 'native' }).size / 1024;
					}

					if (size < this.config.maxSize) {
						window.sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(newStored));
					}
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
