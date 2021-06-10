import type { EventManager, Next } from '@searchspring/snap-event-manager';

import { Tracker } from '@searchspring/snap-tracker';

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
	controller: any;
	request: any;
};

export type AfterSearchObj = {
	controller: any;
	response: any;
};

export type AfterStoreObj = {
	controller: any;
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
	};
};

/** Abstract */
export type ControllerServices = {
	client: any;
	store: any;
	urlManager: any;
	eventManager: EventManager;
	profiler: any;
	logger: any;
	tracker: Tracker;
};

declare global {
	interface Window {
		searchspring?: any;
	}
}
