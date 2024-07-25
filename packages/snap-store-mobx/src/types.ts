import type { UrlManager } from '@searchspring/snap-url-manager';
import type {
	SearchResponseModelFacetValueAllOfValues,
	AutocompleteRequestModel,
	SearchRequestModel,
	MetaResponseModelBadgeTag,
	SearchResponseModelResultBadges,
	MetaResponseModel,
	SearchResponseModel,
	AutocompleteResponseModel,
} from '@searchspring/snapi-types';
import type { StorageStore } from './Storage/StorageStore';
import { AutocompleteStateStore } from './Autocomplete/Stores';
import { TrendingResponseModel } from '@searchspring/snap-client';

// Abstract
export type StoreConfig = {
	id: string;
	[any: string]: unknown;
};

export type SearchStoreConfigSettings = {
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
	restorePosition?: {
		enabled: boolean;
		onPageShow?: boolean;
	};
	variants?: VariantConfig;
	history?: {
		url?: string;
		max?: number;
	};
	pagination?: {
		pageSizeOptions?: {
			label: string;
			value: number;
		}[];
	};
};
export type VariantConfigFilterTypes = 'first' | 'unaltered';

export type VariantConfig = {
	field: string;
	realtime?: {
		enabled: boolean;
		filters?: VariantConfigFilterTypes[];
	};
	options?: {
		[optionField: string]: VariantOptionConfig;
	};
};

export type VariantOptionConfig = {
	label?: string;
	preSelected?: string[];
	thumbnailBackgroundImages?: boolean;
	mappings?: VariantOptionConfigMappings;
};

export type VariantOptionConfigMappings = {
	[optionValue: string]: {
		label?: string;
		background?: string;
		backgroundImageUrl?: string;
	};
};

// Search Config
export type SearchStoreConfig = StoreConfig & {
	globals?: Partial<SearchRequestModel>;
	settings?: SearchStoreConfigSettings;
};

export type FacetStoreConfig = {
	trim?: boolean;
	pinFiltered?: boolean;
	storeRange?: boolean;
	autoOpenActive?: boolean;
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

export type AutocompleteStoreConfigSettings = {
	integratedSpellCorrection?: boolean;
	initializeFromUrl?: boolean;
	syncInputs?: boolean;
	serializeForm?: boolean;
	facets?: FacetStoreConfig & {
		fields?: {
			[field: string]: FacetStoreConfig;
		};
	};
	trending?: {
		limit: number;
		showResults?: boolean;
	};
	variants?: VariantConfig;
	history?: {
		limit: number;
		showResults?: boolean;
	};
	redirects?: {
		merchandising?: boolean;
		singleResult?: boolean;
	};
};

// Autocomplete config
export type AutocompleteStoreConfig = StoreConfig & {
	globals?: Partial<AutocompleteRequestModel>;
	selector: string;
	action?: string;
	settings?: AutocompleteStoreConfigSettings;
};

// Recommendation config
export type RecommendationStoreConfig = StoreConfig & {
	globals?: any;
	tag: string;
	branch?: string;
	realtime?: boolean;
	batched?: boolean;
	order?: number;
	settings?: {
		variants?: VariantConfig;
	};
};

export type StoreConfigs = SearchStoreConfig | AutocompleteStoreConfig | FinderStoreConfig | RecommendationStoreConfig;

export type StoreServices = {
	urlManager: UrlManager;
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

export type ResultBadge = MetaResponseModelBadgeTag & SearchResponseModelResultBadges;

/** Store Interface Types */
export type StoreParameters<T = undefined> = {
	config: StoreConfigs;
	services: StoreServices;
	stores?: {
		storage?: StorageStore;
	};
} & T;

/** Autocomplete Store Interface Types */
export type AutocompleteData = {
	data: AutocompleteResponseModel & { meta: MetaResponseModel };
	state?: {
		loaded: boolean;
		autocomplete: AutocompleteStateStore;
	};
	functions?: {
		resetTerms: () => void;
	};
};

export type AutocompleteTrendingData = Omit<AutocompleteData, 'data'> & {
	data: TrendingResponseModel;
};

export type AutocompleteHistoryData = Omit<AutocompleteData, 'data'> & {
	data: {
		queries: string[];
	};
};

/** Search Store Interface Types (also used by Recommendations) */
export type SearchData = {
	data: SearchResponseModel & { meta: MetaResponseModel };
	state?: {
		loaded: boolean;
	};
};

/** Finder Store Interface Types */
export type FinderData = {
	data: SearchResponseModel & { meta: MetaResponseModel } & { selections: SelectedSelection[] };
	stores: {
		storage: StorageStore;
	};
	state: {
		loading: boolean;
		finder: FinderStoreState;
	};
};
