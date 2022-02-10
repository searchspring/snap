import { configure as configureMobx, extendObservable } from 'mobx';

import { SearchController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import type { SnapControllerServices, SnapSearchControllerConfig } from '../types';

configureMobx({ useProxies: 'never' });

export default (config: SnapSearchControllerConfig, services?: SnapControllerServices): SearchController => {
	const urlManager = services?.urlManager || new UrlManager(new UrlTranslator(config.url), reactLinker);
	const client = services?.client || new Client(config.client.globals, config.client.config);

	const cntrlr = new SearchController(config.controller, {
		client,
		store: services?.store || new SearchStore(config.controller, { urlManager }),
		urlManager,
		eventManager: services?.eventManager || new EventManager(),
		profiler: services?.profiler || new Profiler(),
		logger: services?.logger || new Logger(),
		tracker: services?.tracker || new Tracker(config.client.globals, { client }),
	});

	return cntrlr;
};
