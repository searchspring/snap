import { featureFlags, cookies } from '@searchspring/snap-toolbox';

const utils = {
	cookies,
};

export class StorageStore {
	type = null;
	expiration = 31536000000; // one year (ms)
	sameSite = undefined;
	key = 'ss-storage';
	state = {};

	constructor(config?: StorageConfig) {
		if (config) {
			if (config.key.trim() !== '') {
				this.key = config.key.trim();
			}
			if (config?.cookie?.expiration) {
				this.expiration = config.cookie.expiration;
			}
			if (config?.cookie?.sameSite) {
				this.sameSite = config.cookie.sameSite;
			}

			switch (config.type) {
				case StorageType.SESSION:
					this.type = featureFlags.storage ? config.type : null;
					if (this.type && !window.sessionStorage.getItem(this.key)) {
						window.sessionStorage.setItem(this.key, JSON.stringify(this.state));
					}
					break;
				case StorageType.LOCAL:
					this.type = featureFlags.storage ? config.type : null;
					if (this.type && !window.localStorage.getItem(this.key)) {
						window.localStorage.setItem(this.key, JSON.stringify(this.state));
					}
					break;
				case StorageType.COOKIE:
					this.type = featureFlags.cookies ? config.type : null;
					break;
			}
		}
	}

	set(path: string, value: any): void {
		const paths = path?.split('.');
		let location = this.state;
		paths?.forEach((p, i) => {
			const leaf = i == paths.length - 1;

			if (leaf) {
				location[p] = value;
			} else {
				location = location[p] = location[p] || {};
			}
		});
		switch (this.type) {
			case StorageType.SESSION:
				window.sessionStorage.setItem(this.key, JSON.stringify(this.state));
				break;
			case StorageType.LOCAL:
				window.localStorage.setItem(this.key, JSON.stringify(this.state));
				break;
			case StorageType.COOKIE:
				utils.cookies.set(this.key, JSON.stringify(this.state), this.sameSite, this.expiration);
				break;
		}
	}

	get(path: string): any {
		switch (this.type) {
			case StorageType.SESSION:
				this.state = JSON.parse(window.sessionStorage.getItem(this.key));
				break;
			case StorageType.LOCAL:
				this.state = JSON.parse(window.localStorage.getItem(this.key));
				break;
			case StorageType.COOKIE:
				const data = utils.cookies.get(this.key);
				if (data) {
					this.state = JSON.parse(data);
				}
				break;
		}
		const paths = path?.split('.');

		if (!paths?.length) return undefined;

		let value = this.state;
		for (const p of paths) {
			if (value && typeof value[p] != 'undefined') {
				value = value[p];
			} else {
				value = undefined;
				break;
			}
		}
		return value;
	}

	clear(): void {
		switch (this.type) {
			case StorageType.SESSION:
				window.sessionStorage.clear();
				break;
			case StorageType.LOCAL:
				window.localStorage.clear();
				break;
			case StorageType.COOKIE:
				utils.cookies.unset(this.key);
				break;
		}
		this.state = {};
	}
}

export type StorageConfig = {
	type: StorageType;
	cookie?: {
		expiration?: number;
		sameSite?: string;
	};
	key: string;
};

export enum StorageType {
	SESSION = 'session',
	LOCAL = 'local',
	COOKIE = 'cookie',
}
