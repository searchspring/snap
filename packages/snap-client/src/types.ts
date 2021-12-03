export type ClientConfig = {
	meta?: {
		prefetch?: boolean;
		ttl?: number;
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
	enabled: boolean;
	expiresAfter: number;
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
