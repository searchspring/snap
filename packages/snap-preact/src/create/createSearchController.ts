import { PluginFunction, SearchController, RestorePositionObj } from '@searchspring/snap-controller';
import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager, Next } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import type { SnapControllerServices, SnapSearchControllerConfig } from '../types';

export default (config: SnapSearchControllerConfig, services?: SnapControllerServices): SearchController => {
	const urlManager = services?.urlManager || new UrlManager(new UrlTranslator(config.url), reactLinker);

	// set client mode
	if (config.mode && config.client) {
		config.client.config = config.client.config || {};
		config.client.config.mode = config.mode;
	}

	// attach creation plugin
	config.controller.plugins = config.controller.plugins || [];
	config.controller.plugins.unshift([creationPlugin as PluginFunction]);

	const cntrlr = new SearchController(
		config.controller,
		{
			client: services?.client || new Client(config.client!.globals, config.client!.config),
			store: services?.store || new SearchStore(config.controller, { urlManager }),
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

const creationPlugin = (controller: SearchController) => {
	// if infinite setting add a restorePosition handler
	if (controller.config.settings?.infinite?.restorePosition) {
		controller.on('restorePosition', async ({ controller, position }: RestorePositionObj, next: Next) => {
			const scrollToPosition = () => {
				return new Promise<void>((resolve) => {
					const checkTime = 50;
					const maxScrolls = 3;

					let checkCount = 0;
					let scrollBackCount = 0;

					const completeCheck = () => {
						window.clearInterval(checkInterval);

						resolve();
					};

					const checkInterval = window.setInterval(async () => {
						const elem = document.querySelector(position.selector!);

						if (elem) {
							const { y } = elem.getBoundingClientRect();

							if (y > 1 || y < -1) {
								elem.scrollIntoView();
								if (!scrollBackCount) controller.log.debug('restored position to: ', elem);
								scrollBackCount++;
							}

							// stop scrolling back after max
							if (scrollBackCount > maxScrolls) {
								completeCheck();
							}
						}

						if (checkCount > 900 / checkTime) {
							if (!elem) controller.log.debug('could not locate element with selector: ', position.selector);
							completeCheck();
						}

						checkCount++;
					}, checkTime);
				});
			};

			if (position.selector) await scrollToPosition();
			await next();
		});
	}
};
