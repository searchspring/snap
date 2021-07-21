import type { AbstractController } from './Abstract/AbstractController';
import type { EventManager, Next } from '@searchspring/snap-event-manager';

import type { Client } from '@searchspring/snap-client';
import type { AbstractStore } from '@searchspring/snap-store-mobx';
import type { Tracker } from '@searchspring/snap-tracker';
import type { Profiler } from '@searchspring/snap-profiler';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { Logger } from '@searchspring/snap-logger';

export type NextEvent = Next;

/** Search */
export type SearchControllerConfig = {
	id: string;
	globals?: any;
	settings?: {
		redirects?: {
			merchandising?: boolean;
			singleResult?: boolean;
		};
		facets?: {
			trim?: boolean;
		};
	};
};

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
};

/** Finder */
export type FinderControllerConfig = {
	id: string;
	url?: string;
	globals?: any;
	fields: FinderFieldConfig[];
};

export type FinderFieldConfig = {
	field: string;
	label?: string;
	levels?: string[];
};

/** Autocomplete */
export type AutocompleteControllerConfig = {
	id: string;
	selector: string;
	action?: string;
	globals?: any;
	settings: {
		initializeFromUrl: boolean;
		syncInputs: boolean;
		facets?: {
			trim?: boolean;
		};
		trending?: {
			limit: number;
		};
	};
};

/** Recommend */
export type RecommendationControllerConfig = {
	id: string;
	tag: string;
	branch?: string;
	globals?: any;
};

/** Abstract */
export type ControllerServices = {
	client: Client;
	store: AbstractStore;
	urlManager: UrlManager;
	eventManager: EventManager;
	profiler: Profiler;
	logger: Logger;
	tracker: Tracker;
};

declare global {
	interface Window {
		searchspring?: any;
	}
}
