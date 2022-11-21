import { AppMode } from '@searchspring/snap-toolbox';
import type { MetaRequestModel, SearchResponseModelResult, SearchRequestModel, AutocompleteRequestModel } from '@searchspring/snapi-types';

export type HTTPHeaders = { [key: string]: string };

export type ClientConfig = {
	mode?: keyof typeof AppMode | AppMode;
	meta?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
		globals?: Partial<MetaRequestModel>;
	};
	search?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
		globals?: Partial<SearchRequestModel>;
	};
	autocomplete?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
		globals?: Partial<AutocompleteRequestModel>;
		requesters?: HybridRequesterConfig;
	};
	finder?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
		globals?: Partial<SearchRequestModel>;
	};
	recommend?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
		globals?: Partial<RecommendRequestModel>;
	};
	suggest?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
		globals?: Partial<SuggestRequestModel>;
	};
};

export type HybridRequesterConfig = {
	suggest?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
		globals?: Partial<SuggestRequestModel>;
	};
	legacy?: {
		api?: SnapApiConfig;
		cache?: CacheConfig;
		globals?: Partial<AutocompleteRequestModel>;
	};
};

export type CacheConfig = Partial<DefaultCacheConfig>;

export type DefaultCacheConfig = {
	enabled: boolean;
	ttl: number;
	maxSize: number;
	purgeable: boolean;
	entries?: { [key: string]: Response };
};
export type CacheEntry = {
	value: Response;
	expires: number;
	purgeable?: boolean;
};

export type Cache = {
	[key: string]: CacheEntry;
};

export type SnapApiConfig = {
	origin?: string;
	headers?: HTTPHeaders;
};

export type GenericGlobals = {
	[configurationPath: string]: any;
};

export type ClientGlobals = GenericGlobals & {
	siteId: string;
};

export type SuggestRequestModel = {
	siteId: string;
	query: string;
	language?: string;
	suggestionCount?: number;
	productCount?: number;
	disableSpellCorrect?: boolean;
	integratedSpellCorrection?: boolean;
};

export type SuggestResponseModelSuggestion = {
	text: string;
	type?: string;
	source?: string;
	popularity?: number;
	completed?: {
		token: string;
		query: string;
		type: string;
	}[];
};

export type SuggestResponseModel = {
	query: string;
	'corrected-query'?: string;
	suggested?: SuggestResponseModelSuggestion;
	alternatives?: SuggestResponseModelSuggestion[];
};

export type TrendingRequestModel = {
	siteId: string;
	limit?: number;
};

export type TrendingResponseModel = {
	trending: {
		queries: {
			popularity: number;
			searchQuery: string;
		}[];
	};
};

export type RecommendRequestModel = {
	tags: string[];
	siteId: string;
	product?: string;
	shopper?: string;
	categories?: string[];
	cart?: string[];
	lastViewed?: string[];
	test?: boolean;
	batched?: boolean;
	limits?: number | number[];
	order?: number;
};

export type RecommendResponseModel = {
	profile: {
		tag: string;
	};
	results: SearchResponseModelResult[];
}[];

export type ProfileRequestModel = {
	siteId: string;
	tag: string;
	branch?: string;
};

export type ProfileResponseModel = {
	profile: {
		tag: string;
		placement: string;
		display: {
			threshold: number;
			template: {
				name: string;
				uuid: string;
				markup?: string;
				styles?: string;
				component?: string;
				branch?: string;
				group?: string;
			};
			templateParameters: {
				[any: string]: unknown;
			};
		};
	};
};

export type RecommendCombinedRequestModel = {
	tag: string;
	siteId: string;
	product?: string;
	shopper?: string;
	categories?: string[];
	cart?: string[];
	lastViewed?: string[];
	test?: boolean;
	branch?: string;
};

export type RecommendCombinedResponseModel = ProfileResponseModel & { results: SearchResponseModelResult[] };
