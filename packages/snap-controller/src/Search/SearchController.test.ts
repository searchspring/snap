import { v4 as uuidv4 } from 'uuid';

import { Client } from '@searchspring/snap-client';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';

import { SearchController } from './SearchController';
import { MockClient } from '../__mocks__/MockClient';

const globals = { siteId: 'ga9kq2' }; // bbwheels

let searchConfig = {
	id: 'search',
	globals: {
		filters: [],
	},
	settings: {},
};

describe('Search Controller', () => {
	beforeEach(() => {
		searchConfig.id = uuidv4().split('-').join('');
	});
	it('has results after search method called', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const searchfn = jest.spyOn(controller, 'search');
		const initfn = jest.spyOn(controller, 'init');

		expect(initfn).not.toHaveBeenCalled();
		controller.init();
		expect(initfn).toHaveBeenCalled();

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
		expect(searchfn).not.toHaveBeenCalled();
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/defaultNoQuery.json
		expect(searchfn).toHaveBeenCalled();
		expect(controller.store.results.length).toBeGreaterThan(0);
	});

	it('tests merchandising redirect setting', async () => {
		// settings.redirects.merchandising is true by default

		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const redirectQuery = 'wheel'; // term redirects
		controller.urlManager = controller.urlManager.reset().set('query', redirectQuery);
		expect(controller.urlManager.state.query).toBe(redirectQuery);

		delete window.location;
		window.location = {
			...window.location,
			replace: jest.fn(),
		};
		controller.client.mockDataFile = 'wheel';
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/wheel.json
		expect(window.location.replace).toHaveBeenCalledTimes(1);
	});

	it('tests merchandising redirect setting with single result', async () => {
		// settings.redirects.merchandising is true by default

		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const redirectQuery = '40745sk'; // term yields 1 result
		controller.urlManager = controller.urlManager.reset().set('query', redirectQuery);
		expect(controller.urlManager.state.query).toBe(redirectQuery);

		delete window.location;
		window.location = {
			...window.location,
			replace: jest.fn(),
		};
		controller.client.mockDataFile = '40745sk';
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/40745sk.json
		expect(window.location.replace).toHaveBeenCalledTimes(1);
	});

	it('tests merchandising redirect setting disabled', async () => {
		searchConfig = {
			...searchConfig,
			settings: {
				redirects: {
					merchandising: false,
				},
			},
		};

		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		expect(controller.config.settings.redirects.merchandising).toBe(false);
		expect(controller.params.search.redirectResponse).toBe('full');

		controller.init();

		const redirectQuery = 'wheel'; // term redirects
		controller.urlManager = controller.urlManager.reset().set('query', redirectQuery);
		expect(controller.urlManager.state.query).toBe(redirectQuery);

		delete window.location;
		window.location = {
			...window.location,
			replace: jest.fn(),
		};
		controller.client.mockDataFile = 'wheel.redirectResponse.full';
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/wheel.redirectResponse.full.json
		// should not redirect whem redirectResponse='full'
		expect(window.location.replace).not.toHaveBeenCalled();
		expect(controller.store.results.length).toBeGreaterThan(0);
	});

	// TODO: beforeStore is missing from Controller
	const events = ['beforeSearch', 'afterSearch', 'afterStore'];
	events.forEach((event) => {
		it(`tests ${event} middleware err handled`, async function () {
			const controller = new SearchController(searchConfig, {
				client: new MockClient(globals, {}),
				store: new SearchStore(),
				urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});

			controller.on(event, () => false); // return false to stop middleware
			const spy = jest.spyOn(console, 'log');

			controller.init();
			await controller.search();

			expect(console.log).toHaveBeenCalledTimes(1);
			spy.mockClear();

			// store should not have been updated
			if (['beforeSearch', 'afterSearch'].includes(event)) {
				expect(controller.store.results.length).toBe(0);
			}
		});
	});

	it('can set landingPage param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const landingPageCampaign = '35x12-50r20-mud-tires';
		controller.urlManager = controller.urlManager.set('tag', landingPageCampaign);
		expect(controller.params.merchandising.landingPage).toBe(landingPageCampaign);
	});

	it('can set page param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const page = 2;
		controller.urlManager = controller.urlManager.set('page', page);
		expect(controller.params.pagination.page).toBe(page);
	});

	it('can set pageSize param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const pageSize = 72;
		controller.urlManager = controller.urlManager.set('pageSize', pageSize);
		expect(controller.params.pagination.pageSize).toBe(pageSize);
	});

	it('can set oq param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const oq = 'wheel';
		controller.urlManager = controller.urlManager.set('oq', [oq]);
		expect(controller.params.search.originalQuery).toBe(oq);
	});

	it('can set rq param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const rq = 'wheel';
		controller.urlManager = controller.urlManager.set('rq', [rq]);
		expect(controller.params.search.subQuery).toBe(rq);
	});

	it('can set sort param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const badsort = { price: 'ASC' };
		controller.urlManager = controller.urlManager.set('sort', badsort);
		expect(controller.params.sorts).toEqual([]);

		const sort = [{ field: 'price', direction: 'asc' }];
		controller.urlManager = controller.urlManager.set('sort', sort);
		expect(controller.params.sorts).toEqual([{ field: 'price', direction: 'asc' }]);
	});

	it('can set filter param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(),
			urlManager: new UrlManager(new QueryStringTranslator(), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.urlManager = controller.urlManager.set('filter', { color: 'blue' });
		expect(controller.params.filters).toEqual([{ type: 'value', field: 'color', value: 'blue' }]);
	});
});
