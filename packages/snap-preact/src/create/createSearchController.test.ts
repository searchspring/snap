import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker, CoreMap, UrlTranslatorSettingsConfig } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import { createSearchController } from './index';

import type { SnapSearchControllerConfig } from '../types';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';

const createConfig: SnapSearchControllerConfig = {
	client: {
		globals: {
			siteId: '8uyt2m',
		},
		config: {
			meta: {
				cache: {
					purgeable: false,
				},
			},
		},
	},
	controller: {
		id: 'search',
	},
	context: {
		shopper: {
			id: 'snapdev',
		},
		custom: {
			testing: true,
		},
	},
};

describe('createSearchController', () => {
	beforeEach(() => {
		delete window.searchspring;
	});

	it('throws when incomplete configuration is used', () => {
		expect(() => {
			// @ts-ignore - testing invalid config passed
			const controller = createSearchController({});
		}).toThrow();

		expect(() => {
			const bareConfig = {
				controller: {
					id: 'ac',
				},
			};

			// @ts-ignore - testing invalid config passed
			const controller = createSearchController(bareConfig);
		}).toThrow();

		expect(() => {
			const bareConfig = {
				client: {
					globals: {
						siteId: 'xxxxxx',
					},
				},
			};

			// @ts-ignore - testing invalid config passed
			const controller = createSearchController(bareConfig);
		}).toThrow();
	});

	it('creates an search controller', () => {
		const controller = createSearchController(createConfig);

		expect(controller).toBeDefined();
		expect(controller.id).toBe(createConfig.controller.id);
		expect(controller.context).toBe(createConfig.context);
		expect(controller.config.tag).toBe(createConfig.controller.tag);

		// services
		expect(controller.client).toBeDefined();
		expect(controller.store).toBeDefined();
		expect(controller.urlManager).toBeDefined();
		expect(controller.eventManager).toBeDefined();
		expect(controller.profiler).toBeDefined();
		expect(controller.log).toBeDefined();
		expect(controller.tracker).toBeDefined();

		// other
		expect(controller.urlManager.detached).not.toBeDefined();
		// Property is private and only accessible within class
		// @ts-ignore
		expect(controller.client.globals.siteId).toBe(createConfig.client.globals.siteId);
		// Property is private and only accessible within class
		// @ts-ignore
		expect(controller.client.config.meta.cache.purgeable).toBe(createConfig.client.config.meta.cache.purgeable);
		// Property is private and only accessible within class
		// @ts-ignore
		expect(controller.tracker.globals.siteId).toBe(createConfig.client.globals.siteId);
	});

	it('creates an search controller with custom UrlTranslator config', () => {
		const customUrlConfig: SnapSearchControllerConfig = {
			...createConfig,
			url: {
				settings: {
					coreType: 'query',
					customType: 'query',
				},
				parameters: {
					core: {
						query: { name: 'query', type: 'query' },
						page: { name: 'p', type: 'query' },
					},
				},
			},
		};
		const controller = createSearchController(customUrlConfig);

		expect(controller).toBeDefined();
		expect(controller.urlManager).toBeDefined();

		const translatorConfig = controller.urlManager.getTranslatorConfig() as UrlTranslatorConfig;
		// check for custom settings
		for (const [key, value] of Object.entries((customUrlConfig.url as UrlTranslatorConfig).settings || {})) {
			expect(translatorConfig.settings![key as keyof UrlTranslatorSettingsConfig]).toBe(value);
		}
		// check for custom parameter configuration
		for (const [key, value] of Object.entries((customUrlConfig.url as UrlTranslatorConfig).parameters!.core || {})) {
			expect(translatorConfig.parameters!.core![key as keyof CoreMap]).toStrictEqual(value);
		}
	});

	describe('custom services', () => {
		it('creates an search controller with custom Client service', () => {
			const clientConfig = { siteId: 'custom' };
			const customClient = new Client(clientConfig);

			const controller = createSearchController(createConfig, { client: customClient });

			expect(controller).toBeDefined();
			expect(controller.client).toBe(customClient);
			// Property is private and only accessible within class
			// @ts-ignore
			expect(controller.client.globals.siteId).toBe(clientConfig.siteId);
		});

		it('creates an search controller with custom Store service', () => {
			const storeConfig = {
				...createConfig.controller,
				settings: {
					facets: {
						pinFiltered: false,
					},
				},
			};
			const customUrlManager = new UrlManager(new UrlTranslator(), reactLinker);
			const customStore = new SearchStore(storeConfig, { urlManager: customUrlManager });

			const controller = createSearchController(createConfig, { store: customStore });

			expect(controller).toBeDefined();
			expect(controller.store).toBe(customStore);
		});

		it('creates an search controller with custom UrlManager service', () => {
			const customTranslatorConfig = {
				settings: {
					coreType: 'hash',
				},
			} as UrlTranslatorConfig;
			const customUrlManager = new UrlManager(new UrlTranslator(customTranslatorConfig), reactLinker);
			const controller = createSearchController(createConfig, { urlManager: customUrlManager });

			expect(controller).toBeDefined();
			expect(controller.urlManager.detached).not.toBeDefined();

			const translatorConfig = controller.urlManager.getTranslatorConfig() as UrlTranslatorConfig;
			expect(translatorConfig.settings?.coreType).toBe(customTranslatorConfig.settings!.coreType);
		});

		it('creates an search controller with custom EventManager service', () => {
			const customEventManager = new EventManager();

			const controller = createSearchController(createConfig, { eventManager: customEventManager });

			expect(controller).toBeDefined();
			expect(controller.eventManager).toBe(customEventManager);
		});

		it('creates an search controller with custom Profiler service', () => {
			const customProfiler = new Profiler('customProfiler');

			const controller = createSearchController(createConfig, { profiler: customProfiler });

			expect(controller).toBeDefined();
			expect(controller.profiler).toBe(customProfiler);
			expect(controller.profiler.namespace).toBe('customProfiler');
		});

		it('creates an search controller with custom Logger service', () => {
			const customLogger = new Logger('customLogger');

			const controller = createSearchController(createConfig, { logger: customLogger });

			expect(controller).toBeDefined();
			expect(controller.log).toBe(customLogger);
		});

		it('creates an search controller with custom Tracker service', () => {
			const customTracker = new Tracker({ siteId: 'custom' });

			const controller = createSearchController(createConfig, { tracker: customTracker });

			expect(controller).toBeDefined();
			expect(controller.tracker).toBe(customTracker);
			expect(controller.tracker.globals.siteId).toBe('custom');
		});
	});
});
