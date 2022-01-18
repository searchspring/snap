export type ClientConfig = {
	meta?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
	};
	search?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
	};
	autocomplete?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
	};
	recommend?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
	};
	suggest?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
	};
};

export type CacheConfig = {
	enabled?: boolean;
	ttl?: number;
	maxCacheSize?: number;
	purgable?: boolean;
};

export type CacheEntry = {
	value: Response;
	expires?: number;
	purgable?: boolean;
};

export type Cache = {
	[key: string]: CacheEntry;
};

export type SnapApiConfig = {
	host?: string;
	path?: string;
};

export type ClientGlobals = {
	siteId: string;
	[configurationPath: string]: any;
};

export type ParameterObject = Record<string, boolean | string | string[] | number | number[]>;
