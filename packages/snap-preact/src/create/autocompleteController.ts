import { AutocompleteController, AutocompleteControllerConfig } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { AutocompleteStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import type { ClientConfig, ClientGlobals } from '@searchspring/snap-client';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';

import type { SnapControllerServices } from '../types';

export type SnapAutocompleteControllerConfig = {
	url?: UrlTranslatorConfig;
	client?: {
		globals: ClientGlobals;
		config?: ClientConfig;
	};
	controller: AutocompleteControllerConfig;
};

export const createAutocompleteController = (config: SnapAutocompleteControllerConfig, services?: SnapControllerServices): AutocompleteController => {
	const urlManager = services?.urlManager || new UrlManager(new UrlTranslator(config.url), reactLinker).detach();

	const cntrlr = new AutocompleteController(config.controller, {
		client: services?.client || new Client(config.client.globals, config.client.config),
		store: services?.store || new AutocompleteStore(config.controller, { urlManager }),
		urlManager,
		eventManager: services?.eventManager || new EventManager(),
		profiler: services?.profiler || new Profiler(),
		logger: services?.logger || new Logger(),
		tracker: services?.tracker || new Tracker(config.client.globals),
	});

	return cntrlr;
};
