export type ContextVariables = {
	shopper?: {
		id: string;
		cart?: any[];
		[variable: string]: any;
	};
	config?: {
		client?: {
			[endpoint: string]: {
				cacheSettings?: {
					[key: string]: any;
				};
			};
		};
	};
	[variable: string]: any;
};

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
	maxSize?: number;
	purgeable?: boolean;
	entries?: { [key: string]: Response };
};

export type CacheEntry = {
	value: Response;
	expires?: number;
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

export type ParameterObject = Record<string, boolean | string | string[] | number | number[]>;
