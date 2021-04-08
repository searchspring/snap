/* searchspring imports */
import SnapClient from '@searchspring/snap-client-javascript';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
// import { SearchController } from '@searchspring/snap-controller-search';

import { Logger } from '@searchspring/snap-logger';
import { SearchController } from '@searchspring/snap-controller';
import { SearchStore } from '@searchspring/snap-store-mobx';

export class Snapify {
	static search(config: SnapifyConfig): SearchController {
		const clientConfig = {
			// apiHost: 'http://localhost:8080/api/v1',
		};

		const client = new SnapClient(config.globals, clientConfig);
		const store = new SearchStore();
		const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker).detach();
		const eventManager = new EventManager();
		const profiler = new Profiler();
		const logger = new Logger();

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

/*
const baseConfig = {
	siteId: 'scmq7n',
}

const searchConfig = {
	globals: baseConfig
}

const acConfig = {
	globals: baseConfig,
	limit: 4,
	trendingSearches: {
		limit: 4
	}
}

const finderConfig1 = {
	globals: baseConfig,
	finderFields: [
		'year',
		'make',
		'model'
	]
}

const search = Snapify.search(baseConfig);


const autocomplete = new Snapify.autocomplete(config);
const finder1 = new Snapify.finder(config);
const finder2 = new Snapify.finder(config);
const finder3 = new Snapify.finder(config);

*/
