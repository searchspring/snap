import { Client } from '@searchspring/snap-client';
import { FinderStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import { createFinderController } from './index';

import type { SnapFinderControllerConfig } from '../types';
import type { UrlTranslatorConfig } from '@searchspring/snap-url-manager';

const createConfig: SnapFinderControllerConfig = {
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
		id: 'finder',
		url: '/',
		fields: [
			{
				field: 'size_footwear',
				label: 'Size',
			},
			{
				field: 'color_family',
				label: 'Color',
			},
			{
				field: 'brand',
				label: 'Brand',
			},
		],
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

describe('createFinderController', () => {
	beforeEach(() => {
		delete window.searchspring;
	});

	it('throws when incomplete configuration is used', () => {
		expect(() => {
			// @ts-ignore - testing invalid config passed
			const controller = createFinderController({});
		}).toThrow();

		expect(() => {
			const bareConfig = {
				controller: {
					id: 'ac',
				},
			};

			// @ts-ignore - testing invalid config passed
			const controller = createFinderController(bareConfig);
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
			const controller = createFinderController(bareConfig);
		}).toThrow();
	});

	it('creates an finder controller', () => {
		const controller = createFinderController(createConfig);

		expect(controller).toBeDefined();
		expect(controller.id).toBe(createConfig.controller.id);
		expect(controller.context).toBe(createConfig.context);
		expect(controller.config.url).toBe(createConfig.controller.url);
		expect(controller.config.fields).toStrictEqual(createConfig.controller.fields);

		// services
		expect(controller.client).toBeDefined();
		expect(controller.store).toBeDefined();
		expect(controller.urlManager).toBeDefined();
		expect(controller.eventManager).toBeDefined();
		expect(controller.profiler).toBeDefined();
		expect(controller.log).toBeDefined();
		expect(controller.tracker).toBeDefined();

		// other
		expect(controller.urlManager.detached).toBeDefined();
		expect(controller.client.globals.siteId).toBe(createConfig.client.globals.siteId);
		expect(controller.client.config.meta.cache.purgeable).toBe(createConfig.client.config.meta.cache.purgeable);
		expect(controller.tracker.globals.siteId).toBe(createConfig.client.globals.siteId);
	});

	it('creates an finder controller with custom UrlTranslator config', () => {
		const customUrlConfig = {
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
		const controller = createFinderController(customUrlConfig as SnapFinderControllerConfig);

		expect(controller).toBeDefined();
		expect(controller.urlManager).toBeDefined();

		const translatorConfig = controller.urlManager.getTranslatorConfig() as UrlTranslatorConfig;
		// check for custom settings
		for (const [key, value] of Object.entries(customUrlConfig.url.settings)) {
			expect(translatorConfig.settings[key]).toBe(value);
		}
		// check for custom parameter configuration
		for (const [key, value] of Object.entries(customUrlConfig.url.parameters.core)) {
			expect(translatorConfig.parameters.core[key]).toStrictEqual(value);
		}
	});

	describe('custom services', () => {
		it('creates an finder controller with custom Client service', () => {
			const clientConfig = { siteId: 'custom' };
			const customClient = new Client(clientConfig);

			const controller = createFinderController(createConfig, { client: customClient });

			expect(controller).toBeDefined();
			expect(controller.client).toBe(customClient);
			expect(controller.client.globals.siteId).toBe(clientConfig.siteId);
		});

		it('creates an finder controller with custom Store service', () => {
			const storeConfig = {
				...createConfig.controller,
				settings: {
					facets: {
						pinFiltered: false,
					},
				},
			};
			const customUrlManager = new UrlManager(new UrlTranslator(), reactLinker);
			const customStore = new FinderStore(storeConfig, { urlManager: customUrlManager });

			const controller = createFinderController(createConfig, { store: customStore });

			expect(controller).toBeDefined();
			expect(controller.store).toBe(customStore);
		});

		it('creates an finder controller with custom UrlManager service', () => {
			const customTranslatorConfig = {
				settings: {
					coreType: 'hash',
				},
			} as UrlTranslatorConfig;
			const customUrlManager = new UrlManager(new UrlTranslator(customTranslatorConfig), reactLinker);
			const controller = createFinderController(createConfig, { urlManager: customUrlManager });

			expect(controller).toBeDefined();
			expect(controller.urlManager.detached).toBeDefined();

			const translatorConfig = controller.urlManager.getTranslatorConfig() as UrlTranslatorConfig;
			expect(translatorConfig.settings.coreType).toBe(customTranslatorConfig.settings.coreType);
		});

		it('creates an finder controller with custom EventManager service', () => {
			const customEventManager = new EventManager();

			const controller = createFinderController(createConfig, { eventManager: customEventManager });

			expect(controller).toBeDefined();
			expect(controller.eventManager).toBe(customEventManager);
		});

		it('creates an finder controller with custom Profiler service', () => {
			const customProfiler = new Profiler('customProfiler');

			const controller = createFinderController(createConfig, { profiler: customProfiler });

			expect(controller).toBeDefined();
			expect(controller.profiler).toBe(customProfiler);
			expect(controller.profiler.namespace).toBe('customProfiler');
		});

		it('creates an finder controller with custom Logger service', () => {
			const customLogger = new Logger({ prefix: 'customLogger' });

			const controller = createFinderController(createConfig, { logger: customLogger });

			expect(controller).toBeDefined();
			expect(controller.log).toBe(customLogger);
		});

		it('creates an finder controller with custom Tracker service', () => {
			const customTracker = new Tracker({ siteId: 'custom' });

			const controller = createFinderController(createConfig, { tracker: customTracker });

			expect(controller).toBeDefined();
			expect(controller.tracker).toBe(customTracker);
			expect(controller.tracker.globals.siteId).toBe('custom');
		});
	});
});
