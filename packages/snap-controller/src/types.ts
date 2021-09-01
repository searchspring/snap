import type { AbstractController } from './Abstract/AbstractController';
import type { EventManager, Middleware, Next } from '@searchspring/snap-event-manager';

import type { Client } from '@searchspring/snap-client';
import type { AbstractStore } from '@searchspring/snap-store-mobx';
import type { Tracker } from '@searchspring/snap-tracker';
import type { Profiler } from '@searchspring/snap-profiler';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { Logger } from '@searchspring/snap-logger';

// Global
declare global {
	interface Window {
		searchspring?: any;
	}
}

// Middleware

export type NextEvent = Next;

export type PluginFunction = (cntrlr: AbstractController, ...args) => Promise<void>;
export type PluginGrouping = [func: PluginFunction, ...args: unknown[]];

export type BeforeSearchObj = {
	controller: AbstractController;
	request: any;
};

export type AfterSearchObj = {
	controller: AbstractController;
	response: any;
};

export type AfterStoreObj = {
	controller: AbstractController;
	request: any;
	response: any;
};

// Abstract
export interface ControllerConfig {
	id: string;
	middleware?: {
		[eventName: string]: Middleware<unknown> | Middleware<unknown>[];
	};
	plugins?: PluginGrouping[];
}

export type ControllerServices = {
	client: Client;
	store: AbstractStore;
	urlManager: UrlManager;
	eventManager: EventManager;
	profiler: Profiler;
	logger: Logger;
	tracker: Tracker;
};

export type Attachments = {
	on?: {
		[eventName: string]: Middleware<unknown> | Middleware<unknown>[];
	};
	plugins?: PluginGrouping[];
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

export type ControllerConfigs = SearchControllerConfig | AutocompleteControllerConfig | FinderControllerConfig | RecommendationControllerConfig;
