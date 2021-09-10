import type { Middleware } from '@searchspring/snap-event-manager';
import type { UrlManager } from '@searchspring/snap-url-manager';

// Abstract
export interface ControllerConfig {
	id: string;
	middleware?: {
		[eventName: string]: Middleware<unknown> | Middleware<unknown>[];
	};
}

export type Attachments = {
	on?: {
		[eventName: string]: Middleware<unknown> | Middleware<unknown>[];
	};
	[any: string]: unknown;
};

// Search Config
export type SearchControllerConfig = ControllerConfig &
	Attachments & {
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
export type FinderControllerConfig = ControllerConfig &
	Attachments & {
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
export type AutocompleteControllerConfig = ControllerConfig &
	Attachments & {
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
export type RecommendationControllerConfig = ControllerConfig &
	Attachments & {
		globals?: any;
		tag: string;
		branch?: string;
	};

export type ControllerConfigs =
	| SearchControllerConfig
	| AutocompleteControllerConfig
	| FinderControllerConfig
	| RecommendationControllerConfig
	| Record<string, never>;

export type StoreServices = {
	urlManager?: UrlManager;
};
