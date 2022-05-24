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
	finder?: {
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

export type CacheConfig = Partial<DefaultCacheConfig>;

export type DefaultCacheConfig = {
	enabled: boolean;
	ttl: number;
	maxSize: number;
	purgeable: boolean;
	entries?: { [key: string]: Response };
};
export type CacheEntry = {
	value: Response;
	expires: number;
	purgeable?: boolean;
};

export type Cache = {
	[key: string]: CacheEntry;
};

export type SnapApiConfig = {
	origin?: string;
};

export type ClientGlobals = {
	siteId: string;
	[configurationPath: string]: any;
};
