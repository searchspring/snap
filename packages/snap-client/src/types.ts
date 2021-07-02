export type ClientConfig = {
	meta?: {
		prefetch?: boolean;
		ttl?: number;
		api?: SnapApiConfig;
	};
	search?: {
		api?: SnapApiConfig;
	};
	autocomplete?: {
		api?: SnapApiConfig;
	};
	recommend?: {
		api?: SnapApiConfig;
	};
	suggest?: {
		api?: SnapApiConfig;
	};
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
