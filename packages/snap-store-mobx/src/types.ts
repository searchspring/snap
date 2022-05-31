import type { UrlManager } from '@searchspring/snap-url-manager';
import type { SearchResponseModelFacetValueAllOfValues, AutocompleteRequestModel, SearchRequestModel } from '@searchspring/snapi-types';
// Abstract
export type StoreConfig = {
	id: string;
	[any: string]: unknown;
};

// Search Config
export type SearchStoreConfig = StoreConfig & {
	globals?: Partial<SearchRequestModel>;
	settings?: {
		redirects?: {
			merchandising?: boolean;
			singleResult?: boolean;
		};
		facets?: FacetStoreConfig & {
			fields?: {
				[field: string]: FacetStoreConfig;
			};
		};
		infinite?: {
			backfill?: number;
		};
	};
};

type FacetStoreConfig = {
	trim?: boolean;
	pinFiltered?: boolean;
	storeRange?: boolean;
};

// Finder Config
export type FinderStoreConfig = StoreConfig & {
	globals?: any;
	url?: string;
	fields: FinderFieldConfig[];
	persist?: {
		enabled: boolean;
		lockSelections?: boolean;
		expiration?: number;
	};
};

export type FinderFieldConfig = {
	field: string;
	label?: string;
	levels?: string[];
};

// Autocomplete config
export type AutocompleteStoreConfig = StoreConfig & {
	globals?: Partial<AutocompleteRequestModel>;
	selector: string;
	action?: string;
	settings?: {
		initializeFromUrl?: boolean;
		syncInputs?: boolean;
		facets?: FacetStoreConfig & {
			fields?: {
				[field: string]: FacetStoreConfig;
			};
		};
		trending?: {
			limit: number;
			showResults?: boolean;
		};
	};
};

// Recommendation config
export type RecommendationStoreConfig = StoreConfig & {
	globals?: any;
	tag: string;
	branch?: string;
	realtime?: boolean;
	batched?: boolean;
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

export type SelectedSelection = {
	selected: string;
	data: SearchResponseModelFacetValueAllOfValues[];
	facet: any;
};

export type FinderStoreState = {
	persisted: boolean;
};
