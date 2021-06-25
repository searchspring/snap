/* searchspring imports */
import { Client } from '@searchspring/snap-client';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';

import { Logger } from '@searchspring/snap-logger';
import { SearchController, AutocompleteController, RecommendationController, RecommendationControllerConfig } from '@searchspring/snap-controller';
import { AutocompleteStore, SearchStore, RecommendationStore } from '@searchspring/snap-store-mobx';
import { Tracker } from '@searchspring/snap-tracker';

const clientConfig = {
	// apiHost: 'http://localhost:8080/api/v1',
};

const controllers = {};

export class Snapify {
	static recommendation(config: RecommendationControllerConfig): RecommendationController {
		if (controllers[config.id]) {
			return controllers[config.id];
		}

		const client = new Client(config.globals, clientConfig);
		const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker).detach();
		const tracker = new Tracker(config.globals);
		const store = new RecommendationStore({}, { urlManager });
		const eventManager = new EventManager();
		const profiler = new Profiler();
		const logger = new Logger();

		const RecommendationConfig = {
			id: config.id,
			tag: config.tag,
			globals: config.globals,
		};

		const cntrlr = (controllers[config.id] = new RecommendationController(RecommendationConfig, {
			client,
			store,
			urlManager,
			eventManager,
			profiler,
			logger,
			tracker,
		}));

		cntrlr.on('afterStore', async ({ controller }: { controller: RecommendationController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}
	static autocomplete(config: SnapifyACConfig): AutocompleteController {
		if (controllers[config.id]) {
			return controllers[config.id];
		}

		const client = new Client(config.globals, clientConfig);
		const urlManager = new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker);
		const tracker = new Tracker(config.globals);
		const store = new AutocompleteStore({}, { urlManager });

		const eventManager = new EventManager();
		const profiler = new Profiler();
		const logger = new Logger();

		const searchControllerConfig: AutocompleteControllerConfig = {
			id: config.id,
			selector: config.selector,
			settings: {
				initializeFromUrl: config && config.settings && config.settings.initializeFromUrl ? config.settings.initializeFromUrl : false,
				syncInputs: config && config.settings && config.settings.syncInputs ? config.settings.syncInputs : false,
			},
		};
		const cntrlr = (controllers[config.id] = new AutocompleteController(searchControllerConfig, {
			client,
			store,
			urlManager,
			eventManager,
			profiler,
			logger,
			tracker,
		}));

		cntrlr.on('afterStore', async ({ controller }: { controller: AutocompleteController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}

	static search(config: SnapifyConfig): SearchController {
		if (controllers[config.id]) {
			return controllers[config.id];
		}

		const client = new Client(config.globals, clientConfig);
		const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker).detach();
		const tracker = new Tracker(config.globals);
		const store = new SearchStore({}, { urlManager });
		const eventManager = new EventManager();
		const profiler = new Profiler();
		const logger = new Logger();

		const searchControllerConfig = {
			id: config.id,
			settings: {
				redirects: {
					merchandising: false,
				},
			},
		};

		const cntrlr = (controllers[config.id] = new SearchController(searchControllerConfig, {
			client,
			store,
			urlManager,
			eventManager,
			profiler,
			logger,
			tracker,
		}));

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
	id: string;
	globals: {
		siteId: string;
		[any: string]: any;
	};
}

export interface SnapifyACConfig {
	id: string;
	selector: string;
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
