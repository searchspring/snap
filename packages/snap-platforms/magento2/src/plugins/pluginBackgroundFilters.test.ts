import { pluginBackgroundFiltersMagento2 as pluginBackgroundFilters } from './pluginBackgroundFilters';
import { MockClient } from '@searchspring/snap-shared';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { RecommendationController, SearchController } from '@searchspring/snap-controller';

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

describe('magento2/pluginBackgroundFilters', () => {
	beforeEach(() => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, createControllerServices());
		expect(controller.config.globals).toBeDefined();
		expect(controller.config.globals!.filters).toEqual([]);
	});

	it('only applicable to SearchController', async () => {
		const contextMock = {};
		const controller = new RecommendationController({ ...searchConfig, tag: 'test' }, createControllerServices(), contextMock);

		expect(controller.type).not.toBe('search');

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([]);
	});

	it('it handles category background filters from context', async () => {
		const contextMock = {
			category: {
				path: '/test-category',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: 'category_hierarchy',
				value: contextMock.category.path,
				background: true,
			},
			{
				type: 'value',
				field: 'visibility',
				value: 'Catalog',
				background: true,
			},
		]);
	});

	it('it contains search visibility filter if no category context is specified', async () => {
		const contextMock = {};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: 'visibility',
				value: 'Search',
				background: true,
			},
		]);
	});
});
