import type { UrlManager } from '@searchspring/snap-url-manager';

// Abstract
export type StoreConfig = {
	id: string;
	[any: string]: unknown;
};

// Search Config
export type SearchStoreConfig = StoreConfig & {
	globals?: any;
	settings?: {
		redirects?: {
			merchandising?: boolean;
			singleResult?: boolean;
		};
		facets?: {
			trim?: boolean;
			pinFiltered?: boolean;
		};
		infinite?: {
			backfill?: number;
		};
	};
};

// Finder Config
export type FinderStoreConfig = StoreConfig & {
	globals?: any;
	url?: string;
	fields: FinderFieldConfig[];
};

export type FinderFieldConfig = {
	field: string;
	label?: string;
	levels?: string[];
};

// Autocomplete config
export type AutocompleteStoreConfig = StoreConfig & {
	globals?: any;
	selector: string;
	action?: string;
	settings: {
		initializeFromUrl: boolean;
		syncInputs: boolean;
		facets?: {
			trim?: boolean;
			pinFiltered?: boolean;
		};
		trending?: {
			limit: number;
		};
	};
};

// Recommendation config
export type RecommendationStoreConfig = StoreConfig & {
	globals?: any;
	tag: string;
	branch?: string;
};

export type StoreConfigs = SearchStoreConfig | AutocompleteStoreConfig | FinderStoreConfig | RecommendationStoreConfig;

export type StoreServices = {
	urlManager?: UrlManager;
};
