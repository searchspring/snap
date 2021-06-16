/* searchspring imports */
import { Client } from '@searchspring/snap-client';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';

import { Logger } from '@searchspring/snap-logger';
import { SearchController, AutocompleteController } from '@searchspring/snap-controller';
import { AutocompleteStore, SearchStore } from '@searchspring/snap-store-mobx';
import { Tracker } from '@searchspring/snap-tracker';

export class Snapify {
	static autocomplete(config: SnapifyACConfig): AutocompleteController {
		const clientConfig = {
			// apiHost: 'http://localhost:8080/api/v1',
		};

		const client = new Client(config.globals, clientConfig);
		const store = new AutocompleteStore();
		const urlManager = new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker);

		const eventManager = new EventManager();
		const profiler = new Profiler();
		const logger = new Logger();
		const tracker = new Tracker(config.globals);

		const searchControllerConfig: AutocompleteControllerConfig = {
			id: 'autocomplete',
			selector: config.selector,
			settings: {
				initializeFromUrl: config && config.settings && config.settings.initializeFromUrl ? config.settings.initializeFromUrl : false,
				syncInputs: config && config.settings && config.settings.syncInputs ? config.settings.syncInputs : false,
			},
		};
		const cntrlr = new AutocompleteController(searchControllerConfig, {
			client,
			store,
			urlManager,
			eventManager,
			profiler,
			logger,
			tracker,
		});

		cntrlr.on('afterStore', async ({ controller }: { controller: AutocompleteController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}

	static search(config: SnapifyConfig): SearchController {
		const clientConfig = {
			// apiHost: 'http://localhost:8080/api/v1',
		};

		const client = new Client(config.globals, clientConfig);
		const store = new SearchStore();
		const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker).detach();
		const eventManager = new EventManager();
		const profiler = new Profiler();
		const logger = new Logger();
		const tracker = new Tracker(config.globals);

		const searchControllerConfig = {
			id: 'search',
			settings: {
				redirects: {
					merchandising: false,
				},
			},
		};

		const cntrlr = new SearchController(searchControllerConfig, {
			client,
			store,
			urlManager,
			eventManager,
			profiler,
			logger,
			tracker,
		});

		cntrlr.on('afterStore', async ({ controller }: { controller: SearchController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}
}

// TODO have gloals use client param typing
export interface SnapifyConfig {
	globals: {
		siteId: string;
		[any: string]: any;
	};
}

export interface SnapifyACConfig {
	selector: string;
	id?: string;
	action?: string;
	globals: {
		siteId: string;
		filters?: string[];
		[any: string]: any;
	};
	settings?: {
		initializeFromUrl?: boolean;
		syncInputs?: boolean;
		facets?: {
			trim?: boolean;
		};
		redirects?: {
			enabled: boolean;
		};
	};
}

type AutocompleteControllerConfig = {
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
