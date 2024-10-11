import { pluginStoreLogger } from './pluginStoreLogger';
import { MockClient } from '@searchspring/snap-shared';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '@searchspring/snap-controller';
import { AppMode } from '@searchspring/snap-toolbox';

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
let logMock: any;

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

const controllerServices: any = {
	client: new MockClient(globals, {}),
	store: new SearchStore(searchConfig, services),
	urlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(globals),
};

describe('pluginScrollToTop', () => {
	beforeEach(() => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, controllerServices);
		logMock = jest.spyOn(controller.log, 'debug').mockImplementation(() => {});
	});

	afterEach(() => {
		logMock.mockClear();
	});

	it('requires config.enabled', async () => {
		const config = {
			enabled: false,
		};

		pluginStoreLogger(controller, config);
		await controller.search();

		expect(logMock).not.toHaveBeenCalled();
	});

	it('does not log if controllerIds does not match string', async () => {
		const config = {
			enabled: true,
			controllerIds: ['dne'],
		};

		pluginStoreLogger(controller, config);
		await controller.search();

		expect(logMock).not.toHaveBeenCalled();
	});

	it('does not log if controllerIds does not match regex', async () => {
		const config = {
			enabled: true,
			controllerIds: [/dne/],
		};

		pluginStoreLogger(controller, config);
		await controller.search();

		expect(logMock).not.toHaveBeenCalled();
	});

	it('does not log if controllerTypes does not match', async () => {
		const config = {
			enabled: true,
			controllerTypes: ['autocomplete'],
		};

		pluginStoreLogger(controller, config);
		await controller.search();

		expect(logMock).not.toHaveBeenCalled();
	});

	it('logs if controllerIds matches string', async () => {
		const config = {
			enabled: true,
			controllerIds: ['search'],
		};

		pluginStoreLogger(controller, config);
		await controller.search();

		expect(logMock).toHaveBeenCalled();
	});

	it('logs if controllerIds matches regex', async () => {
		const config = {
			enabled: true,
			controllerIds: [/search/],
		};
		expect(controller.id).toBe('search');
		expect(controller.id).toMatch(/search/);

		pluginStoreLogger(controller, config);
		await controller.search();

		expect(logMock).toHaveBeenCalled();
	});

	it('logs if controllerTypes matches', async () => {
		const config = {
			enabled: true,
			controllerTypes: ['search'],
		};

		pluginStoreLogger(controller, config);
		await controller.search();

		expect(logMock).toHaveBeenCalled();
	});

	it('can log the store with defaults', async () => {
		const config = {
			enabled: true,
		};

		pluginStoreLogger(controller, config);
		await controller.search();

		expect(logMock).toHaveBeenCalled();
		expect(logMock).toHaveBeenCalledWith('store', expect.any(Object));
	});
});
