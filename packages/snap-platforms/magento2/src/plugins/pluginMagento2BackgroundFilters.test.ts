import {
	pluginMagento2BackgroundFilters as pluginBackgroundFilters,
	PluginMagento2BackgroundFiltersConfig as PluginBackgroundFilterConfig,
} from './pluginMagento2BackgroundFilters';
import { MockClient } from '@searchspring/snap-shared';
import { AutocompleteStore, SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';

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

	it('it can set visibility filter using a custom fieldName', async () => {
		const pluginConfig = {
			fieldNames: {
				visibility: 'custom_visibility',
			},
		};
		const contextMock = {};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller, pluginConfig);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: pluginConfig.fieldNames.visibility,
				value: 'Search',
				background: true,
			},
		]);
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

	it('it handles category background filters using a custom fieldName', async () => {
		const pluginConfig: PluginBackgroundFilterConfig = {
			fieldNames: {
				category: 'custom_category',
			},
		};

		const contextMock = {
			category: {
				path: '/test-category',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context.category).toStrictEqual(contextMock.category);

		pluginBackgroundFilters(controller, pluginConfig);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: pluginConfig.fieldNames?.category,
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

	it('also applies visibility background filtering to autocomplete controllers', async () => {
		const autoCompleteConfig = { ...searchConfig, selector: '.no_selector' };
		const autocompleteServices = createControllerServices();
		// @ts-ignore - changing store type
		autocompleteServices.store = new AutocompleteStore(autoCompleteConfig, services);

		const contextMock = {
			category: {
				path: '/test-category',
			},
		};

		const controller = new AutocompleteController(autoCompleteConfig, autocompleteServices, contextMock);

		expect(controller.type).toBe('autocomplete');

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

	it('it can be disabled', async () => {
		const contextMock = {
			category: {
				path: '/test-category',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context.category).toStrictEqual(contextMock.category);

		pluginBackgroundFilters(controller, { enabled: false });
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([]);
	});

	it('does not apply for recommendation controllers', async () => {
		const contextMock = {
			category: {
				path: '/test-category',
			},
		};

		const controller = new RecommendationController({ ...searchConfig, tag: 'test' }, createControllerServices(), contextMock);

		expect(controller.type).not.toBe('search');
		expect(controller.type).toBe('recommendation');

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([]);
	});
});
