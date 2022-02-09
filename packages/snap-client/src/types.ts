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
		cacheSettings?: CacheSettingsConfig;
	};
	search?: {
		api?: SnapApiConfig;
		cacheSettings?: CacheSettingsConfig;
	};
	autocomplete?: {
		api?: SnapApiConfig;
		cacheSettings?: CacheSettingsConfig;
	};
	recommend?: {
		api?: SnapApiConfig;
		cacheSettings?: CacheSettingsConfig;
	};
	suggest?: {
		api?: SnapApiConfig;
		cacheSettings?: CacheSettingsConfig;
	};
};

export type CacheSettingsConfig = {
	enabled?: boolean;
	ttl?: number;
	maxSize?: number;
	purgeable?: boolean;
	cache?: { [key: string]: Response };
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
