import { featureFlags, cookies } from '@searchspring/snap-toolbox';

const utils = {
	cookies,
};

export class StorageStore {
	private type: StorageType | null = null;
	private expiration = 31536000000; // one year (ms)
	private sameSite = 'Lax';
	private key = 'ss-storage';
	private cookieDomain =
		(typeof window !== 'undefined' && window.location.hostname && '.' + window.location.hostname.replace(/^www\./, '')) || undefined;
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
				case StorageType.session: {
					this.type = featureFlags.storage ? (config.type as StorageType) : null;
					if (this.type) {
						this.state = JSON.parse(window.sessionStorage.getItem(this.key) || '{}');
						window.sessionStorage.setItem(this.key, JSON.stringify(this.state));
					}
					break;
				}
				case StorageType.local: {
					this.type = featureFlags.storage ? (config.type as StorageType) : null;
					if (this.type) {
						this.state = JSON.parse(window.localStorage.getItem(this.key) || '{}');
						window.localStorage.setItem(this.key, JSON.stringify(this.state));
					}
					break;
				}
				case StorageType.cookie: {
					if (featureFlags.cookies) {
						this.type = config.type as StorageType;
						const data = utils.cookies.get(this.key);
						if (data) {
							this.state = JSON.parse(data);
						}
					}
					break;
				}
				default: {
					this.type = StorageType.memory;
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
		try {
			switch (this.type) {
				case StorageType.session:
					window.sessionStorage.setItem(this.key, JSON.stringify(this.state));
					break;
				case StorageType.local:
					window.localStorage.setItem(this.key, JSON.stringify(this.state));
					break;
				case StorageType.cookie:
					utils.cookies.set(this.key, JSON.stringify(this.state), this.sameSite, this.expiration, this.cookieDomain);
					break;
			}
		} catch (err) {
			console.warn(`something went wrong setting ${this.key} to ${this.type} storage`);
		}
	}

	public get(path: string): any | undefined {
		switch (this.type) {
			case StorageType.session:
				const sessionData = window.sessionStorage.getItem(this.key);
				this.state = sessionData ? JSON.parse(sessionData) : {};
				break;
			case StorageType.local:
				const localData = window.localStorage.getItem(this.key);
				this.state = localData ? JSON.parse(localData) : {};
				break;
			case StorageType.cookie:
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
			case StorageType.session:
				window.sessionStorage.removeItem(this.key);
				break;
			case StorageType.local:
				window.localStorage.removeItem(this.key);
				break;
			case StorageType.cookie:
				utils.cookies.unset(this.key, this.cookieDomain);
				break;
		}
		this.state = {};
	}
}

export type StorageConfig = {
	type: StorageType | keyof typeof StorageType;
	cookie?: {
		expiration?: number;
		sameSite?: string;
	};
	key: string;
};

export enum StorageType {
	session = 'session',
	local = 'local',
	cookie = 'cookie',
	memory = 'memory',
}
