import { v4 as uuidv4 } from 'uuid';

import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '../../../../snap-controller/src';
import { MockClient } from '../../../../snap-controller/src/__mocks__/MockClient';
import type { SearchControllerConfig } from '../../../../snap-controller/src/types';
import { ClientConfig } from '../../types';

const globals = { siteId: '8uyt2m' };

let searchConfig: SearchControllerConfig = {
	id: 'search',
	globals: {
		filters: [],
	},
	meta: {
		prefetch: false,
	},
	settings: {},
};

let clientConfig: ClientConfig = {
	meta: {
		prefetch: false,
	},
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = { urlManager };

let mockStorage = {};

describe('Search Controller', () => {
	beforeAll(() => {
		global.Storage.prototype.setItem = jest.fn((key, value) => {
			console.log(key, value);
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
	});

	beforeEach(() => {
		// make sure the fridge starts out empty for each test
		mockStorage = {};
	});

	afterAll(() => {
		// return our mocks to their original values
		// 🚨 THIS IS VERY IMPORTANT to avoid polluting future tests!
		//   global.Storage.prototype.setItem.mockReset()
		// global.Storage.prototype.getItem.mockReset()
	});

	beforeEach(() => {
		searchConfig.id = uuidv4().split('-').join('');
	});
	it('has results after search method called', async () => {
		const controller = new SearchController(searchConfig, {
			client: new Client(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const searchfn = jest.spyOn(controller, 'search');
		// const initfn = jest.spyOn(controller, 'init');

		// expect(initfn).not.toHaveBeenCalled();
		controller.init();
		// expect(initfn).toHaveBeenCalled();

		expect(controller instanceof SearchController).toBeTruthy();
		expect(controller.client instanceof Client).toBeTruthy();
		expect(controller.store instanceof SearchStore).toBeTruthy();
		expect(controller.urlManager instanceof UrlManager).toBeTruthy();
		expect(controller.eventManager instanceof EventManager).toBeTruthy();
		expect(controller.profiler instanceof Profiler).toBeTruthy();
		expect(controller.log instanceof Logger).toBeTruthy();
		expect(controller.search).toBeDefined();
		expect(controller.config.id).toBe(searchConfig.id);

		expect(controller.store.results.length).toBe(0);
		// expect(searchfn).not.toHaveBeenCalled();

		expect(global.Storage.prototype.getItem).toHaveBeenCalled();
		// expect(mockStorage['ss-networkcache']).toEqual({})

		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/defaultNoQuery.json
		// expect(searchfn).toHaveBeenCalled();

		expect(global.Storage.prototype.setItem).toHaveBeenCalled();
		expect(mockStorage['ss-networkcache']).toEqual('things');

		expect(controller.store.results.length).toBeGreaterThan(0);
	});
});
