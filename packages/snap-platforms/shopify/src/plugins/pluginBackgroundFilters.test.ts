import { pluginBackgroundFilters } from './pluginBackgroundFilters';
import { MockClient } from '@searchspring/snap-shared';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '@searchspring/snap-controller';

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager: urlManager,
};
let searchConfig = {
	id: 'search',
};

const globals = { siteId: '8uyt2m' };
const searchConfigDefault = {
	id: 'search',
	globals: {
		filters: [],
	},
	settings: {},
};
let controller: any;

// function to recreate fresh services for each test (otherwise globals are shared)
const createControllerServices = () => {
	return {
		client: new MockClient(globals, {}),
		store: new SearchStore(searchConfig, services),
		urlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	};
};

describe('shopify/pluginBackgroundFilters', () => {
	beforeEach(() => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, createControllerServices());
		expect(controller.config.globals).toBeDefined();
		expect(controller.config.globals!.filters).toEqual([]);
	});

	it('it handles category background filters from context', async () => {
		const contextMock = {
			collection: {
				name: 'Test Category',
				handle: '/test-category',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: 'collection_handle',
				value: contextMock.collection.handle,
				background: true,
			},
		]);
	});

	it('it handles vendor background filters from context', async () => {
		const contextMock = {
			collection: {
				name: 'Test Vendor',
				handle: 'vendors',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: 'vendor',
				value: contextMock.collection.name,
				background: true,
			},
		]);
	});

	it('it handles product types background filters from context', async () => {
		const contextMock = {
			collection: {
				name: 'Test Product Type',
				handle: 'types',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: 'product_type',
				value: contextMock.collection.name,
				background: true,
			},
		]);
	});

	it('it handles tags background filters from context', async () => {
		const contextMock = {
			collection: {
				handle: 'vendors',
				name: 'Test Vendor',
			},
			tags: 'tag1 | tag2 | tag3',
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		const tagFilters = contextMock.tags.split('|').map((tag) => {
			return {
				type: 'value',
				field: 'ss_tags',
				value: tag.trim(),
				background: true,
			};
		});

		expect(controller.config.globals!.filters).toStrictEqual(
			[
				{
					type: 'value',
					field: 'vendor',
					value: contextMock.collection.name,
					background: true,
				},
			].concat(tagFilters)
		);
	});

	it('it has no background filters if empty context', async () => {
		const contextMock = {};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([]);
	});
});
