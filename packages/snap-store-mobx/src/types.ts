import type { UrlManager } from '@searchspring/snap-url-manager';
import type { RecommendRequestModel } from '@searchspring/snap-client';
import type {
	SearchResponseModelFacetValueAllOfValues,
	AutocompleteRequestModel,
	SearchRequestModel,
	MetaResponseModelBadgeTag,
	SearchResponseModelResultBadges,
} from '@searchspring/snapi-types';
// Abstract
export type StoreConfig = {
	id: string;
	[any: string]: unknown;
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
	showDisabledSelectionValues?: boolean;
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
		filters?: {
			hierarchy?: {
				enabled?: boolean;
				displayDelimiter?: string;
				showFullPath?: boolean;
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
	disableClickOutside?: boolean;
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
	bind?: {
		input?: boolean;
		submit?: boolean;
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
	globals?: Partial<RecommendRequestModel>;
	tag: string;
	branch?: string;
	realtime?: boolean;
	batched?: boolean;
	order?: number;
	batchId?: number;
	settings?: {
		variants?: VariantConfig;
		searchOnPageShow?: boolean;
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
