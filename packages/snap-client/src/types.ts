export type SnapClientConfig = {
	meta?: {
		prefetch: boolean;
		ttl: number;
		apiHost: string;
	};
	search?: {
		apiHost: string;
	};
	autocomplete?: {
		apiHost: string;
	};
};

export type SnapClientGlobals = {
	[configurationPath: string]: any;
};
