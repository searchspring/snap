import { featureFlags, cookies } from '@searchspring/snap-toolbox';

const utils = {
	cookies,
};

export class StorageStore {
	private type: StorageType | null = null;
	private expiration = 31536000000; // one year (ms)
	private sameSite = 'Lax';
	private key = 'ss-storage';
	public state: Record<string, any> = {};

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
				case StorageType.SESSION: {
					this.type = featureFlags.storage ? config.type : null;
					if (this.type) {
						this.state = JSON.parse(window.sessionStorage.getItem(this.key) || '{}');
						window.sessionStorage.setItem(this.key, JSON.stringify(this.state));
					}
					break;
				}
				case StorageType.LOCAL: {
					this.type = featureFlags.storage ? config.type : null;
					if (this.type) {
						this.state = JSON.parse(window.localStorage.getItem(this.key) || '{}');
						window.localStorage.setItem(this.key, JSON.stringify(this.state));
					}
					break;
				}
				case StorageType.COOKIE: {
					if (featureFlags.cookies) {
						this.type = config.type;
						const data = utils.cookies.get(this.key);
						if (data) {
							this.state = JSON.parse(data);
						}
					}
					break;
				}
				default: {
					this.type = StorageType.MEMORY;
				}
			}
		}
	}

	public set(path: string, value: any): void {
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

	public get(path: string): any | undefined {
		switch (this.type) {
			case StorageType.SESSION:
				const sessionData = window.sessionStorage.getItem(this.key);
				this.state = sessionData ? JSON.parse(sessionData) : {};
				break;
			case StorageType.LOCAL:
				const localData = window.localStorage.getItem(this.key);
				this.state = localData ? JSON.parse(localData) : {};
				break;
			case StorageType.COOKIE:
				const data = utils.cookies.get(this.key);
				if (data) {
					this.state = JSON.parse(data) || {};
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
				value = {};
				return;
			}
		}
		return value;
	}

	public clear(): void {
		switch (this.type) {
			case StorageType.SESSION:
				window.sessionStorage.removeItem(this.key);
				break;
			case StorageType.LOCAL:
				window.localStorage.removeItem(this.key);
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
	MEMORY = 'memory',
}
