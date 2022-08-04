import { configure as configureMobx, extendObservable } from 'mobx';

import { AutocompleteController } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { AutocompleteStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import type { SnapControllerServices, SnapAutocompleteControllerConfig } from '../types';

configureMobx({ useProxies: 'never', isolateGlobalState: true });

export default (config: SnapAutocompleteControllerConfig, services?: SnapControllerServices): AutocompleteController => {
	const urlManager = (services?.urlManager || new UrlManager(new UrlTranslator(config.url), reactLinker)).detach(true);

	// set client mode
	if (config.mode && config.client) {
		config.client.config = config.client.config || {};
		config.client.config.mode = config.mode;
	}

	const cntrlr = new AutocompleteController(
		config.controller,
		{
			client: services?.client || new Client(config.client!.globals, config.client!.config),
			store: services?.store || new AutocompleteStore(config.controller, { urlManager }),
			urlManager,
			eventManager: services?.eventManager || new EventManager(),
			profiler: services?.profiler || new Profiler(),
			logger: services?.logger || new Logger({ mode: config.mode }),
			tracker: services?.tracker || new Tracker(config.client!.globals),
		},
		config.context
	);

	return cntrlr;
};
