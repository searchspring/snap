import 'whatwg-fetch';

import { v4 as uuidv4 } from 'uuid';
import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '../../../../snap-controller/src';
import type { SearchControllerConfig } from '../../../../snap-controller/src/types';

const globals = { siteId: '8uyt2m' };

let searchConfig: SearchControllerConfig = {
	id: 'search',
	globals: {
		filters: [],
	},
	meta: {
		prefetch: false,
	},
	settings: {
		redirects: {
			merchandising: false,
		},
	},
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = { urlManager };

let mockStorage = {};

describe('Network Cache', () => {
	beforeAll(() => {
		global.Storage.prototype.setItem = jest.fn((key, value) => {
			// console.log(key, value);
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
		//@ts-ignore
		global.Storage.prototype.setItem.mockRestore();
		//@ts-ignore
		global.Storage.prototype.getItem.mockRestore();
	});

	beforeEach(() => {
		searchConfig.id = uuidv4().split('-').join('');
	});
	it('caches search responses and uses them', async () => {
		const controller = new SearchController(searchConfig, {
			client: new Client(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		expect(mockStorage['ss-networkcache']).toBeUndefined();

		const fetchfn = jest.spyOn(global.window, 'fetch');
		await controller.search();
		expect(fetchfn).toHaveBeenCalledTimes(1);

		expect(mockStorage['ss-networkcache']).toBeDefined();

		expect(global.Storage.prototype.getItem).toHaveBeenCalled();

		await controller.search();

		expect(global.Storage.prototype.setItem).toHaveBeenCalled();
		expect(mockStorage['ss-networkcache']).toBeDefined();
		expect(fetchfn).toHaveBeenCalledTimes(1);

		expect(controller.store.results.length).toBeGreaterThan(0);
	});
});
