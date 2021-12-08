import { CacheConfig } from '../../types';

export class NetworkCache<T> {
	defaultCacheSettings: CacheConfig = {
		enabled: true,
		expiresAfter: 300000,
	};

	public get(key: number | string | undefined): T | undefined {
		try {
			const stored: any = sessionStorage.getItem('ss-networkcache');
			const localData = stored && JSON.parse(stored);

			if (localData && key && localData[key]) {
				const now = new Date();
				// compare the expiry time of the item with the current time
				if (now.getTime() > localData[key].expires) {
					// remove item
					const newStored = {
						...localData,
					};
					delete newStored[key];
					//update storage
					sessionStorage.setItem('ss-networkcache', JSON.stringify(newStored));

					return undefined;
				} else {
					return localData[key].value;
				}
			} else {
				return undefined;
			}
		} catch (err) {
			console.warn('something went wrong, browser might not have cookies enabled');
		}
	}

	public set(key: number | string, value: any, cacheSettings?: CacheConfig): void {
		if (!cacheSettings) {
			cacheSettings = this.defaultCacheSettings;
		}

		if (cacheSettings.enabled) {
			try {
				const stored: any = sessionStorage.getItem('ss-networkcache');
				const newStored = {
					...(stored && JSON.parse(stored)),
				};
				const now = new Date();
				newStored[key] = {
					value: JSON.stringify(value),
					expires: now.getTime() + cacheSettings.expiresAfter,
				};

				sessionStorage.setItem('ss-networkcache', JSON.stringify(newStored));
			} catch (err) {
				console.warn('something went wrong, browser might not have cookies enabled');
			}
		}
	}

	public clear() {
		try {
			sessionStorage.setItem('ss-networkcache', '');
		} catch (err) {
			console.warn('something went wrong, browser might not have cookies enabled');
		}
	}
}
