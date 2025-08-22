import { AppMode } from '@searchspring/snap-toolbox';
import type {
	MetaRequestModel,
	SearchResponseModelResult,
	SearchRequestModel,
	AutocompleteRequestModel,
	MetaResponseModel,
} from '@searchspring/snapi-types';
import { NO_BEACON_PARAM } from './Client/transforms';

export type HTTPHeaders = { [key: string]: string };

type RequesterConfig<T> = {
	origin?: string;
	headers?: HTTPHeaders;
	cache?: CacheConfig;
	globals?: Partial<T>;
};

export type ClientConfig = {
	mode?: keyof typeof AppMode | AppMode;
	fetchApi?: WindowOrWorkerGlobalScope['fetch'];
	meta?: RequesterConfig<MetaRequestModel>;
	search?: RequesterConfig<SearchRequestModel>;
	autocomplete?: RequesterConfig<AutocompleteRequestModel> & { requesters?: HybridRequesterConfig };
	finder?: RequesterConfig<SearchRequestModel>;
	recommend?: RequesterConfig<RecommendRequestModel>;
	suggest?: RequesterConfig<SuggestRequestModel>;
};

export type HybridRequesterConfig = {
	suggest?: RequesterConfig<SuggestRequestModel>;
	legacy?: RequesterConfig<SearchRequestModel | AutocompleteRequestModel>;
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

export type RecommendRequestModel = RecommendRequestGlobalsModel &
	RecommendRequestOptionsModel & {
		tag: string;
		profile?: RecommendRequestOptionsModel;
	};

export type RecommendRequestGlobalsModel = {
	product?: string;
	products?: string[];
	cart?: string[];
	lastViewed?: string[];
	shopper?: string;
	filters?: RecommendationRequestFilterModel[];
	blockedItems?: string[];
	batchId?: number;
	test?: boolean;
};

export type RecommendRequestOptionsModel = {
	siteId?: string;
	categories?: string[];
	brands?: string[];
	branch?: string;
	filters?: RecommendationRequestFilterModel[];
	blockedItems?: string[];
	batched?: boolean;
	limit?: number;
	order?: number;
	query?: string;
	dedupe?: boolean;
};

//TODO: move to snapi
export type RecommendPostRequestModel = {
	siteId: string;
	profiles: RecommendPostRequestProfileModel[];
	product?: string;
	products?: string[];
	shopper?: string;
	cart?: string[];
	lastViewed?: string[];
	test?: boolean;
	withRecInfo?: boolean;
	blockedItems?: string[];
	filters?: RecommendPostRequestFiltersModel[];
	[NO_BEACON_PARAM]?: boolean;
};

export type RecommendPostRequestProfileModel = {
	tag: string;
	categories?: string[];
	brands?: string[];
	blockedItems?: string[];
	limit?: number;
	dedupe?: boolean;
	searchTerm?: string;
	filters?: RecommendPostRequestFiltersModel[];
};

export type RecommendPostRequestFiltersModel = {
	field: string;
	type: '=' | '==' | '===' | '!=' | '!==' | '>' | '<' | '>=' | '<=';
	values: (string | number)[];
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
				type?: string;
			};
			templateParameters: {
				[any: string]: unknown;
			};
		};
	};
};

export type RecommendationRequestFilterModel = RecommendationRequestRangeFilterModel | RecommendationRequestValueFilterModel;

type RecommendationRequestRangeFilterModel = {
	type: 'range';
	field: string;
	value: { low?: number; high?: number };
};

type RecommendationRequestValueFilterModel = {
	type: 'value';
	field: string;
	value: string | number;
};

export type RecommendCombinedResponseModel = ProfileResponseModel & { results: SearchResponseModelResult[] } & { meta: MetaResponseModel };
