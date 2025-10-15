import type { AbstractController, AutocompleteController, SearchController, FinderController, RecommendationController } from './index';
import type { EventManager, Middleware } from '@searchspring/snap-event-manager';

import type { Client } from '@searchspring/snap-client';
import type {
	SearchStore,
	AutocompleteStore,
	FinderStore,
	RecommendationStore,
	StoreConfig,
	SearchStoreConfig,
	FinderStoreConfig,
	AutocompleteStoreConfig,
	RecommendationStoreConfig,
} from '@searchspring/snap-store-mobx';
import type { Tracker, ProductViewEvent } from '@searchspring/snap-tracker';
import type { Profiler } from '@searchspring/snap-profiler';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { Logger } from '@searchspring/snap-logger';
import type {
	AutocompleteRequestModel,
	AutocompleteResponseModel,
	MetaResponseModel,
	SearchRequestModel,
	SearchResponseModel,
} from '@searchspring/snapi-types';
// Middleware
export type PluginFunction = (cntrlr: AbstractController, ...args: any) => Promise<void> | void;
export type PluginGrouping = [func: PluginFunction, ...args: unknown[]];

export type BeforeSearchObj = {
	controller: AbstractController;
	request: any;
};

export type SearchAfterSearchObj = {
	controller: SearchController;
	response: SearchResponseModel & { meta?: MetaResponseModel };
	request: SearchRequestModel;
};

export type AutocompleteAfterSearchObj = {
	controller: AutocompleteController;
	response: AutocompleteResponseModel & { meta?: MetaResponseModel };
	request: AutocompleteRequestModel;
};

export type FinderAfterSearchObj = {
	controller: FinderController;
	response: SearchResponseModel & { meta?: MetaResponseModel };
	request: SearchRequestModel;
};

export type AfterStoreObj = {
	controller: AbstractController;
	request: any;
	response: any;
};

export type RestorePositionObj = {
	controller: AbstractController;
	element?: ElementPositionObj;
};

export type ElementPositionObj = {
	href?: string;
	selector?: string;
	domRect?: DOMRect;
};

export enum ControllerTypes {
	search = 'search',
	autocomplete = 'autocomplete',
	finder = 'finder',
	recommendation = 'recommendation',
}

export type Controllers = SearchController | AutocompleteController | FinderController | RecommendationController;

export type ControllerServices = {
	client: Client;
	store: SearchStore | AutocompleteStore | FinderStore | RecommendationStore;
	urlManager: UrlManager;
	eventManager: EventManager;
	profiler: Profiler;
	logger: Logger;
	tracker: Tracker;
};

export type Attachments = {
	middleware?: {
		[eventName: string]: Middleware<any> | Middleware<any>[];
	};
	plugins?: PluginGrouping[];
	[any: string]: unknown;
};

export type ContextVariables = {
	shopper?: {
		id: string;
		cart?: ProductViewEvent[];
		[variable: string]: any;
	};
	page?: PageContextVariable;
	[variable: string]: any;
};

export type PageContextVariable = {
	type: 'search' | 'category';
};

export type ControllerConfig = StoreConfig & Attachments;

// Search Config
export type SearchControllerConfig = ControllerConfig & SearchStoreConfig;
// Finder Config
export type FinderControllerConfig = ControllerConfig & FinderStoreConfig;
// Autocomplete config
export type AutocompleteControllerConfig = ControllerConfig & AutocompleteStoreConfig;
// Recommendation config
export type RecommendationControllerConfig = ControllerConfig & RecommendationStoreConfig;

export type ControllerConfigs = SearchControllerConfig | AutocompleteControllerConfig | FinderControllerConfig | RecommendationControllerConfig;
