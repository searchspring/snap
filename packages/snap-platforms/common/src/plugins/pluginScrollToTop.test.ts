import 'whatwg-fetch';

import { pluginScrollToTop, type ScrollBehavior } from './pluginScrollToTop';
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

let controller: SearchController;
let scrollMock: any;

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

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

describe('common/pluginScrollToTop', () => {
	beforeAll(async () => {
		scrollMock = jest.spyOn(global.window, 'scroll').mockImplementation(() => {});
	});

	beforeEach(() => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, createControllerServices());
	});

	afterEach(() => {
		scrollMock.mockClear();
	});

	it('can scroll with defaults', async () => {
		const config = {
			enabled: true,
		};

		expect(controller.type).toEqual('search');

		pluginScrollToTop(controller, config);
		await controller.search();

		await wait(10);

		expect(scrollMock).toHaveBeenCalled();
		expect(scrollMock).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
	});

	it('can scroll with options', async () => {
		const config = {
			enabled: true,
			options: {
				top: 100,
				left: 100,
				behavior: 'instant' as ScrollBehavior,
			},
		};

		pluginScrollToTop(controller, config);
		await controller.search();

		await wait(10);

		expect(scrollMock).toHaveBeenCalled();
		expect(scrollMock).toHaveBeenCalledWith(config.options);
	});

	it('can scroll to selector', async () => {
		const config = {
			enabled: true,
			selector: '#test-selector',
			options: {
				top: 100,
				left: 100,
				behavior: 'instant' as ScrollBehavior,
			},
		};

		global.document.body.innerHTML = '<div style="position: relative;"><div id="test-selector" style="position: absolute; top: 100px;"></div></div>';
		const element = document.querySelector('#test-selector');
		jest.spyOn(element as any, 'getBoundingClientRect').mockImplementation(() => {
			// return new DOMRect(0, 0, 100, 500) //100px wide, 500px tall
			return {
				top: 100,
			};
		});
		expect(element?.getBoundingClientRect().top).toEqual(100);

		// @ts-ignore - override the element's getBoundingClientRect method
		element.getBoundingClientRect = () => {
			return {
				top: 100,
			};
		};

		pluginScrollToTop(controller, config);
		await controller.search();

		await wait(10);

		expect(scrollMock).toHaveBeenCalled();
		expect(scrollMock).toHaveBeenCalledWith({ top: 200, left: 100, behavior: 'instant' });
	});

	it('can be disabled', async () => {
		const pluginConfig = {
			enabled: false,
		};

		pluginScrollToTop(controller, pluginConfig);
		await controller.search();

		await wait(10);

		expect(scrollMock).not.toHaveBeenCalled();
	});

	it('only applies to controllers of type=`search`', async () => {
		const controller = new RecommendationController({ ...searchConfig, tag: 'test' }, createControllerServices());

		expect(controller.type).not.toBe('search');

		pluginScrollToTop(controller);
		await controller.search();

		await wait(10);

		expect(scrollMock).not.toHaveBeenCalled();
	});
});
