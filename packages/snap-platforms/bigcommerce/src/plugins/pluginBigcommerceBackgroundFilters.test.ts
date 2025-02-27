import {
	pluginBigcommerceBackgroundFilters as pluginBackgroundFilters,
	PluginBigcommerceBackgroundFiltersConfig as PluginBackgroundFilterConfig,
} from './pluginBigcommerceBackgroundFilters';
import { MockClient } from '@searchspring/snap-shared';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { RecommendationController, SearchController } from '@searchspring/snap-controller';
import { PluginBackgroundFilter } from '../../../common/src/types';

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

describe('bigcommerce/pluginBackgroundFilters', () => {
	beforeEach(() => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, createControllerServices());
		expect(controller.config.globals).toBeDefined();
		expect(controller.config.globals!.filters).toEqual([]);
	});

	it('it handles category background filters from context', async () => {
		const contextMock = {
			category: {
				id: 123,
				path: '/test-category',
				name: 'Test Category',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context.category).toStrictEqual(contextMock.category);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: 'categories_hierarchy',
				value: contextMock.category.path,
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
				id: 123,
				path: '/test-category',
				name: 'Test Category',
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
		]);
	});

	it('it handles brand background filters from context', async () => {
		const contextMock = {
			brand: {
				name: 'test-brand',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context.brand).toStrictEqual(contextMock.brand);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: 'brand',
				value: contextMock.brand.name,
				background: true,
			},
		]);
	});

	it('it handles brand background filters from context using a custom fieldName', async () => {
		const pluginConfig: PluginBackgroundFilterConfig = {
			fieldNames: {
				brand: 'custom_brand',
			},
		};

		const contextMock = {
			brand: {
				name: 'test-brand',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context.brand).toStrictEqual(contextMock.brand);

		pluginBackgroundFilters(controller, pluginConfig);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: pluginConfig.fieldNames?.brand,
				value: contextMock.brand.name,
				background: true,
			},
		]);
	});

	it('it has no background filters if empty context', async () => {
		const contextMock = {};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([]);
	});

	it('it trims and replaces special characters', async () => {
		const contextMock = {
			brand: {
				name: ' &amp; &lt; &gt; &quot; &#039; &#x27; - test-brand &#x27; &#039; &quot; &gt; &lt; &amp; - ',
			},
		};

		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: 'brand',
				value: `& < > " ' ' - test-brand ' ' " > < & -`,
				background: true,
			},
		]);
	});

	it('it can be disabled', async () => {
		const contextMock = {
			category: {
				id: 123,
				path: '/test-category',
				name: 'Test Category',
			},
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context.category).toStrictEqual(contextMock.category);

		pluginBackgroundFilters(controller, { enabled: false });
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([]);
	});

	it('only applies to controllers of type=`search`', async () => {
		const contextMock = {
			category: {
				id: 123,
				path: '/test-category',
				name: 'Test Category',
			},
		};

		const controller = new RecommendationController({ ...searchConfig, tag: 'test' }, createControllerServices(), contextMock);

		expect(controller.type).not.toBe('search');

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([]);
	});
});
