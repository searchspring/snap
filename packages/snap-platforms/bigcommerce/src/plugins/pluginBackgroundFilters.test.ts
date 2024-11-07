import { pluginBackgroundFiltersBigcommerce as pluginBackgroundFilters } from './pluginBackgroundFilters';
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
				field: 'categories_hierarchy',
				value: contextMock.category.path,
				background: true,
			},
		]);
	});

	it('it handles brand background filters from context', async () => {
		const contextMock = {
			brand: 'test-brand',
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context).toStrictEqual(contextMock);

		pluginBackgroundFilters(controller);
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			{
				type: 'value',
				field: 'brand',
				value: contextMock.brand,
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
			brand: ' &amp; &lt; &gt; &quot; &#039; &#x27; - test-brand &#x27; &#039; &quot; &gt; &lt; &amp; - ',
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
});
