export type SnapClientConfig = {
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
	trending?: {
		prefetch?: boolean;
		ttl?: number;
		api?: SnapApiConfig;
	};
};

export type SnapApiConfig = {
	host?: string;
	path?: string;
};

export type SnapClientGlobals = {
	siteId: string;
	[configurationPath: string]: any;
};
