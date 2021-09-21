import { FinderController, FinderControllerConfig } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { FinderStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import type { ClientConfig, ClientGlobals } from '@searchspring/snap-client';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';

import type { SnapControllerServices } from '../types';

export type SnapFinderControllerConfig = {
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: FinderControllerConfig;
};

export const createFinderController = (config: SnapFinderControllerConfig, services?: SnapControllerServices): FinderController => {
	const urlManager = services?.urlManager || new UrlManager(new UrlTranslator(config.url), reactLinker).detach(true);

	const cntrlr = new FinderController(config.controller, {
		client: services?.client || new Client(config.client.globals, config.client.config),
		store: services?.store || new FinderStore(config.controller, { urlManager }),
		urlManager,
		eventManager: services?.eventManager || new EventManager(),
		profiler: services?.profiler || new Profiler(),
		logger: services?.logger || new Logger(),
		tracker: services?.tracker || new Tracker(config.client.globals),
	});

	return cntrlr;
};
