import { h, render } from 'preact';

import { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { SearchStore, AutocompleteStore, RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import type { ClientConfig, ClientGlobals } from '@searchspring/snap-client';
import type { SearchControllerConfig, AutocompleteControllerConfig, RecommendationControllerConfig } from '@searchspring/snap-controller';

type CreateConfig = {
	client: {
		globals?: ClientGlobals;
		config?: ClientConfig;
	};
	controller: SearchControllerConfig | AutocompleteControllerConfig | RecommendationControllerConfig;
};

const controllers = {};
const client = {
	globals: { siteId: '8uyt2m' },
};
export class Snapify {
	static recommendation(config: RecommendationControllerConfig): RecommendationController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr: RecommendationController = (controllers[id] = createRecommendationController({ client, controller: config }));

		cntrlr.on('afterStore', async ({ controller }: { controller: RecommendationController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}
	static autocomplete(config: AutocompleteControllerConfig): AutocompleteController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr: AutocompleteController = (controllers[id] = createAutocompleteController({ client, controller: config }));

		cntrlr.on('afterStore', async ({ controller }: { controller: AutocompleteController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}

	static search(config: SearchControllerConfig): SearchController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr: SearchController = (controllers[id] = createSearchController({ client, controller: config }));

		cntrlr.on('afterStore', async ({ controller }: { controller: SearchController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}
}

function createSearchController(config: CreateConfig): SearchController {
	const urlManager = new UrlManager(new UrlTranslator(), reactLinker);

	const cntrlr = new SearchController(config.controller as SearchControllerConfig, {
		client: new Client(config.client.globals, config.client.config),
		store: new SearchStore(config.controller as SearchControllerConfig, { urlManager }),
		urlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(config.client.globals),
	});

	return cntrlr;
}

function createRecommendationController(config: CreateConfig): RecommendationController {
	const urlManager = new UrlManager(new UrlTranslator(), reactLinker).detach(true);
	const cntrlr = new RecommendationController(config.controller as RecommendationControllerConfig, {
		client: new Client(config.client.globals, config.client.config),
		store: new RecommendationStore(config.controller as RecommendationControllerConfig, { urlManager }),
		urlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(config.client.globals),
	});

	return cntrlr;
}

function createAutocompleteController(config: CreateConfig): AutocompleteController {
	const urlManager = new UrlManager(new UrlTranslator(), reactLinker).detach();

	const cntrlr = new AutocompleteController(config.controller as AutocompleteControllerConfig, {
		client: new Client(config.client.globals, config.client.config),
		store: new AutocompleteStore(config.controller as AutocompleteControllerConfig, { urlManager }),
		urlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(config.client.globals),
	});

	return cntrlr;
}
