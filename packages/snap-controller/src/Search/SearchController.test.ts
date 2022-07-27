import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';
import { waitFor } from '@testing-library/preact';

import { Client } from '@searchspring/snap-client';
import { SearchStore, SearchStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager, Next } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { MockClient } from '@searchspring/snap-shared';
import { getSessionId } from '@searchspring/snap-toolbox';

import { SearchController } from './SearchController';
import type { SearchControllerConfig } from '../types';

const globals = { siteId: 'ga9kq2' };

let searchConfigDefault: SearchControllerConfig = {
	id: 'search',
	globals: {
		filters: [],
	},
	settings: {},
};
let searchConfig: SearchStoreConfig;
const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = { urlManager };

describe('Search Controller', () => {
	beforeEach(() => {
		searchConfig = { ...searchConfigDefault };
		searchConfig.id = uuidv4().split('-').join('');
	});

	it('has results after search method called', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
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
		await controller.search();
		expect(searchfn).toHaveBeenCalled();
		expect(controller.store.results.length).toBeGreaterThan(0);

		searchfn.mockClear();
		initfn.mockClear();
	});

	it('tests merchandising redirect setting', async () => {
		// settings.redirects.merchandising is true by default

		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const redirectQuery = 'wheel'; // term redirects
		controller.urlManager = controller.urlManager.reset().set('query', redirectQuery);
		expect(controller.urlManager.state.query).toBe(redirectQuery);

		//@ts-ignore
		delete window.location;
		window.location = {
			...window.location,
			replace: jest.fn(),
		};
		(controller.client as MockClient).mockData.updateConfig({ search: 'wheel' });
		await controller.search();
		expect(window.location.replace).toHaveBeenCalledTimes(1);
	});

	it('tests merchandising redirect setting with single result', async () => {
		// settings.redirects.merchandising is true by default

		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const redirectQuery = '40745sk'; // term yields 1 result
		controller.urlManager = controller.urlManager.reset().set('query', redirectQuery);
		expect(controller.urlManager.state.query).toBe(redirectQuery);

		//@ts-ignore
		delete window.location;
		window.location = {
			...window.location,
			replace: jest.fn(),
		};
		(controller.client as MockClient).mockData.updateConfig({ search: '40745sk' });
		await controller.search();
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
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		expect(controller.config.settings!.redirects!.merchandising).toBe(false);
		expect(controller.params.search!.redirectResponse).toBe('full');

		controller.init();

		const redirectQuery = 'wheel'; // term redirects
		controller.urlManager = controller.urlManager.reset().set('query', redirectQuery);
		expect(controller.urlManager.state.query).toBe(redirectQuery);
		//@ts-ignore
		delete window.location;
		window.location = {
			...window.location,
			replace: jest.fn(),
		};
		(controller.client as MockClient).mockData.updateConfig({ search: 'wheel.redirectResponse.full' });
		await controller.search();

		// should not redirect whem redirectResponse='full'
		expect(window.location.replace).not.toHaveBeenCalled();
		expect(controller.store.results.length).toBeGreaterThan(0);
	});

	it('tests infinite setting', async () => {
		searchConfig = {
			...searchConfig,
			settings: {
				infinite: {
					backfill: 5,
				},
			},
		};

		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		expect(controller.config.settings!.infinite!.backfill).toBe(searchConfig.settings!.infinite!.backfill);

		await controller.search();
		expect(controller.store.results.length).toBeGreaterThan(0);
	});

	const events = ['init', 'beforeSearch', 'afterSearch', 'afterStore'];
	events.forEach((event) => {
		it(`tests ${event} middleware err handled`, async function () {
			const controller = new SearchController(searchConfig, {
				client: new MockClient(globals, {}),
				store: new SearchStore(searchConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});

			controller.on(event, () => false); // return false to stop middleware
			const spy = jest.spyOn(controller.log, 'warn');

			controller.init();
			await controller.search();

			expect(spy).toHaveBeenCalledWith(`'${event}' middleware cancelled`);
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
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const landingPageCampaign = '35x12-50r20-mud-tires';
		controller.urlManager = controller.urlManager.set('tag', landingPageCampaign);
		expect(controller.params.merchandising!.landingPage).toBe(landingPageCampaign);
	});

	it('can set page param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const page = 2;
		controller.urlManager = controller.urlManager.set('page', page);
		expect(controller.params.pagination!.page).toBe(page);
	});

	it('can set pageSize param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const pageSize = 72;
		controller.urlManager = controller.urlManager.set('pageSize', pageSize);
		expect(controller.params.pagination!.pageSize).toBe(pageSize);
	});

	it('can set oq param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const oq = 'wheel';
		controller.urlManager = controller.urlManager.set('oq', oq);
		expect(controller.params.search!.originalQuery).toBe(oq);
	});

	it('can set rq param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const rq = 'wheel';
		controller.urlManager = controller.urlManager.set('rq', rq);
		expect(controller.params.search!.subQuery).toBe(rq);
	});

	it('can set sort param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
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
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.urlManager = controller.urlManager.set('filter', { color: 'blue' });
		expect(controller.params.filters).toEqual([{ type: 'value', field: 'color', value: 'blue' }]);
	});

	it('can invoke controller track.product.click', async () => {
		searchConfig = {
			...searchConfig,
			settings: {
				infinite: {
					backfill: 5,
				},
			},
		};
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const clickfn = jest.spyOn(controller.tracker.track.product, 'click');

		await controller.search();

		const result = controller.store.results[0];
		const { intellisuggestData, intellisuggestSignature } = result.attributes;
		const href = result.mappings.core?.url;
		const event = new Event('click');

		const storagefn = jest.spyOn(controller.storage, 'set');

		controller.track.product.click(event as any, result);

		expect(clickfn).toHaveBeenCalledWith({
			intellisuggestData,
			intellisuggestSignature,
			href,
		});
		expect(storagefn).toHaveBeenCalledTimes(1);

		clickfn.mockClear();
		storagefn.mockClear();
	});

	it('backfills results', async () => {
		searchConfig = {
			...searchConfig,
			settings: {
				infinite: {
					backfill: 5,
				},
			},
		};
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const searchfn = jest.spyOn(controller.client, 'search');

		const page = 3;
		controller.urlManager = controller.urlManager.set('page', page);
		expect(controller.params.pagination!.page).toBe(page);

		await controller.search();

		const { defaultPageSize } = controller.store.pagination;

		expect(controller.store.results.length).toBe(defaultPageSize * page);
		expect(searchfn).toHaveBeenCalledTimes(page);

		searchfn.mockClear();
	});

	it('reset scrollMap when page > settings.infinite.backfill', async () => {
		searchConfig = {
			...searchConfig,
			settings: {
				infinite: {
					backfill: 5,
				},
			},
		};
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const storageSetfn = jest.spyOn(controller.storage, 'set');

		const page = searchConfig.settings!.infinite!.backfill! + 1;
		controller.urlManager = controller.urlManager.set('page', page);
		expect(controller.params.pagination!.page).toBe(page);

		await controller.search();

		expect(storageSetfn).toHaveBeenCalledWith('scrollMap', {});

		storageSetfn.mockClear();
	});

	it('can set personalization cart param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const items = ['product123', 'product456'];
		controller.tracker.cookies.cart.add(items);
		expect(controller.params.personalization!.cart).toEqual(items.join(','));
	});

	it('can set personalization lastViewed param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const product = { sku: 'product123' };
		controller.tracker.track.product.view(product);

		expect(controller.params.personalization!.lastViewed).toEqual(product.sku);
	});

	it('can set personalization shopper param', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const shopper = { id: 'user123' };
		controller.tracker.track.shopper.login(shopper);

		expect(controller.params.personalization!.shopper).toEqual(shopper.id);
	});

	it('does not search if previous search params are the same', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const searchfn = jest.spyOn(controller.client, 'search');

		await controller.search();
		expect(searchfn).toHaveBeenCalledTimes(1);

		await controller.search();
		expect(searchfn).toHaveBeenCalledTimes(2); // a 2nd search is called due to redirectResponse setting (store.loaded)

		await controller.search();
		expect(searchfn).toHaveBeenCalledTimes(2); // should not search again
		searchfn.mockClear();
	});

	const errorEvents = ['init', 'beforeSearch', 'afterSearch', 'afterStore'];
	errorEvents.forEach((event) => {
		it(`logs error if middleware throws in ${event}`, async function () {
			const controller = new SearchController(searchConfig, {
				client: new MockClient(globals, {}),
				store: new SearchStore(searchConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});

			const middleware = jest.fn(() => {
				throw new Error('middleware error');
			});
			controller.on(event, middleware);

			expect(middleware).not.toHaveBeenCalled();

			const logErrorfn = jest.spyOn(controller.log, 'error');
			await controller.search();

			expect(middleware).toHaveBeenCalledTimes(1);
			expect(logErrorfn).toHaveBeenCalledWith(`error in '${event}' middleware`);

			logErrorfn.mockClear();
		});
	});

	it('logs error if 429', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const handleError = jest.spyOn(controller, 'handleError');

		controller.client.search = jest.fn(() => {
			throw 429;
		});

		await controller.search();

		expect(controller.store.error).toStrictEqual({
			code: 429,
			type: 'warning',
			message: 'Too many requests try again later',
		});

		expect(handleError).toHaveBeenCalledWith(429);
		handleError.mockClear();
	});

	it('logs error if 500', async () => {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const handleError = jest.spyOn(controller, 'handleError');

		controller.client.search = jest.fn(() => {
			throw 500;
		});

		await controller.search();

		expect(controller.store.error).toStrictEqual({
			code: 500,
			type: 'error',
			message: 'Invalid Search Request or Service Unavailable',
		});

		expect(handleError).toHaveBeenCalledWith(500);
		handleError.mockClear();
	});

	it('uses scrollMap to scroll to previous position when infinite backfill is set', async () => {
		searchConfig = {
			...searchConfig,
			settings: {
				infinite: {
					backfill: 5,
				},
			},
		};
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const scrollHeightSpy = jest.spyOn(document.documentElement, 'scrollHeight', 'get').mockImplementation(() => 1000);
		const userId = controller.tracker.getUserId();
		const sessionId = getSessionId();
		const stringyParams = JSON.stringify({
			filters: [],
			tracking: {
				userId: userId,
				sessionId: sessionId,
			},
		});

		// set a scrollMap for testing
		const scrollMap: { [key: string]: any } = {};
		scrollMap[stringyParams] = 777;
		controller.storage.set('scrollMap', scrollMap);

		await controller.search();

		const scrollSpy = jest.spyOn(window, 'scrollTo');

		await waitFor(() => {
			// expect window.scrollTo to have been called with our set value
			expect(scrollSpy).toHaveBeenCalledWith(0, 777);
		});

		scrollHeightSpy.mockClear();
	});
});
