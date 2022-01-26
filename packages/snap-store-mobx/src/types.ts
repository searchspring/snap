import type { UrlManager } from '@searchspring/snap-url-manager';

// Abstract
export type StoreConfig = {
	id: string;
	[any: string]: unknown;
};

// Search Config
export type SearchStoreConfig = StoreConfig & {
	globals?: {
		personalization?: {
			disabled: boolean;
		};
		[any: string]: unknown;
	};
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
	globals?: {
		personalization?: {
			disabled: boolean;
		};
		search?: {
			[any: string]: unknown;
			query?: {
				[any: string]: unknown;
				spellCorrection?: boolean;
			};
		};
		[any: string]: unknown;
	};
	selector: string;
	action?: string;
	settings?: {
		initializeFromUrl?: boolean;
		syncInputs?: boolean;
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
	realtime?: boolean;
};

export type StoreConfigs = SearchStoreConfig | AutocompleteStoreConfig | FinderStoreConfig | RecommendationStoreConfig;

export type StoreServices = {
	urlManager?: UrlManager;
};

export enum ErrorType {
	WARNING = 'warning',
	INFO = 'info',
	ERROR = 'error',
}
