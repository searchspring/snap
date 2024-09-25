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

import { SearchController, getStorableRequestParams, generateHrefSelector } from './SearchController';
import type { SearchControllerConfig, BeforeSearchObj, RestorePositionObj, ElementPositionObj, AfterSearchObj } from '../types';
import type { SearchRequestModel } from '@searchspring/snapi-types';

const globals = { siteId: 'ga9kq2' };

const searchConfigDefault: SearchControllerConfig = {
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

	it(`allows mutation of response in 'afterSearch' middleware`, async function () {
		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.on('afterSearch', ({ response }: AfterSearchObj) => {
			response.search.results[0].mappings.core.name = 'mutated';
			response.meta.badges = {
				locations: {
					left: [
						{
							tag: 'left',
							name: 'Left',
						},
					],
					right: [
						{
							tag: 'right',
							name: 'Right',
						},
					],
					callout: [
						{
							tag: 'callout',
							name: 'Callout',
						},
					],
				},
				tags: {
					'free-shipping': {
						location: 'callout/callout',
						component: 'BadgeRectangle',
						priority: 1,
						enabled: true,
						parameters: {
							color: '#3A23AD',
							colorText: '#FFFFFF',
						},
					},
				},
			};
		});

		await controller.search();

		// store should have updated data
		expect(controller.store.results[0].mappings.core?.name).toBe('mutated');
		expect(Object.keys(controller.store.meta?.data.badges?.tags ?? {}).length).toBe(1);
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

		(controller.client as MockClient).mockData.updateConfig({ search: 'infinitePage3', siteId: '8uyt2m' });

		const searchfn = jest.spyOn(controller.client, 'search');

		const page = 3;
		controller.urlManager = controller.urlManager.set('page', page);
		expect(controller.params.pagination!.page).toBe(page);

		await controller.search();

		const { pageSize } = controller.store.pagination;
		expect(searchfn).toHaveBeenCalledTimes(page);

		expect(searchfn).toHaveBeenNthCalledWith(1, expect.objectContaining({ pagination: {} }));
		expect(searchfn).toHaveBeenNthCalledWith(2, expect.objectContaining({ pagination: { page: 2 }, search: { redirectResponse: 'full' } }));
		expect(searchfn).toHaveBeenNthCalledWith(3, expect.objectContaining({ pagination: { page: 3 }, search: { redirectResponse: 'full' } }));

		expect(controller.store.results.length).toBe(pageSize * page);

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
		const error = new Error('Too many requests try again later');

		controller.client.search = jest.fn(() => {
			throw { err: error, fetchDetails: { status: 429, url: 'test.com' } };
		});

		await controller.search();

		expect(controller.store.error).toStrictEqual({
			code: 429,
			type: 'warning',
			message: 'Too many requests try again later',
		});

		expect(handleError).toHaveBeenCalledWith(error, { status: 429, url: 'test.com' });
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

		const error = new Error('Invalid Search Request or Service Unavailable');
		controller.client.search = jest.fn(() => {
			throw { err: error, fetchDetails: { status: 500, url: 'test.com' } };
		});

		await controller.search();

		expect(controller.store.error).toStrictEqual({
			code: 500,
			type: 'error',
			message: 'Invalid Search Request or Service Unavailable',
		});

		expect(handleError).toHaveBeenCalledWith(error, { status: 500, url: 'test.com' });
		handleError.mockClear();
	});

	it(`stores scroll position in 'track.product.click' call`, async () => {
		const href = 'https://localhost:2222/product.html';
		// set initial DOM setup
		document.body.innerHTML = `<div class="ss__results"><div class="ss__result"><a class="link" href="${href}"></a></div></div>`;
		const selector = `DIV.ss__result A.link[href*=\"${href}\"]`;

		const controller = new SearchController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		let stringyParams = '';
		controller.on('beforeSearch', async (search: BeforeSearchObj, next: Next): Promise<void | boolean> => {
			stringyParams = JSON.stringify(getStorableRequestParams(search.request as SearchRequestModel));
		});

		await controller.search();

		const restorePositionFunc = jest.fn((selector?: string) => {
			console.log(selector);
		});

		const linkElem = document.querySelector('.link');

		controller.track.product.click({ target: linkElem } as MouseEvent, {
			mappings: { core: { url: href } },
			attributes: { intellisuggestData: '', intellisuggestSignature: '' },
		});

		const scrollMap = controller.storage.get('scrollMap');
		expect(scrollMap).toStrictEqual({
			[stringyParams]: {
				href,
				selector,
			},
		});
	});

	it(`fires 'restorePosition' event and passes a position when one has been stored to a recent query`, async () => {
		const href = 'https://localhost:2222/product.html';
		// set initial DOM setup
		document.body.innerHTML = `<div class="ss__results"><div class="ss__result"><a class="inner-a" href="${href}"></a></div></div>`;

		const scrollConfig: SearchStoreConfig = {
			...searchConfig,
			// add some filters, sorts, and pagination
			globals: {
				filters: [
					{
						// @ts-ignore
						type: 'value',
						field: 'color',
						value: 'green',
						background: false,
					},
				],
				sorts: [
					{
						field: 'price',
						// @ts-ignore
						direction: 'asc',
					},
				],
				pagination: {
					page: 3,
					pageSize: 30,
				},
			},
			settings: {
				restorePosition: {
					enabled: true,
				},
			},
		};

		const scrollPosition = {
			selector: `.ss__results .ss__result A[href*=\"${href}\"]`,
			href,
			// can't use real DOMRect...
			domRect: {
				bottom: 0,
				height: 0,
				left: 0,
				right: 0,
				top: 0,
				width: 0,
				x: 0,
				y: 0,
			} as DOMRect,
		};

		const controller = new SearchController(scrollConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(scrollConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.on('beforeSearch', async (search: BeforeSearchObj, next: Next): Promise<void | boolean> => {
			const stringyParams = getStorableRequestParams(search.request as SearchRequestModel);

			// set a scrollMap for testing
			const scrollMap: { [key: string]: ElementPositionObj } = {};

			scrollMap[JSON.stringify(stringyParams)] = scrollPosition;

			(search.controller as SearchController).storage.set('scrollMap', scrollMap);

			await next();
		});

		const restorePositionFunc = jest.fn((element?: ElementPositionObj) => {
			console.log(element);
		});

		controller.on('restorePosition', async (search: RestorePositionObj, next: Next) => {
			restorePositionFunc(search.element);

			await next();
		});

		await controller.search();

		await waitFor(() => {
			// expect window.scrollTo to have been called with our set value
			expect(restorePositionFunc).toHaveBeenCalledWith(scrollPosition);
		});
	});

	describe('generateHrefSelector', () => {
		const href = 'https://www.website.com/product.html';
		beforeEach(() => {
			document.body.innerHTML = `<div class="outer"><div class="inner"><a class="inner-a" href="${href}"><span class="inner-span"><span class="inner-inner-span"><span class="inner-inner-inner-span"></span></span></span></a></div></div>`;
		});

		it('generates a selector with parent element when href element is the element', () => {
			const elem = document.querySelector('.inner-a') as HTMLElement;
			const selector = generateHrefSelector(elem, href);
			expect(selector).toBe(`DIV.inner A.inner-a[href*=\"${href}\"]`);
		});

		it('generates a selector when an element with href is found within the element', () => {
			const elem = document.querySelector('.outer') as HTMLElement;
			const selector = generateHrefSelector(elem, href);
			expect(selector).toBe(`DIV.outer DIV.inner A.inner-a[href*=\"${href}\"]`);
		});

		it('does not generate a selector when an element with href is NOT found within the element', () => {
			const elem = document.querySelector('.outer') as HTMLElement;
			const selector = generateHrefSelector(elem, href + '/');
			expect(selector).toBeUndefined();
		});

		it('generates a selector when an inner element is passed with a parent containing an element with href', () => {
			const elem = document.querySelector('.inner-span') as HTMLElement;
			const selector = generateHrefSelector(elem, href);
			expect(selector).toBe(`DIV.inner A.inner-a[href*=\"${href}\"]`);
		});

		it('stops trying to generate a selector when an inner element is passed too many levels inside', () => {
			const elem = document.querySelector('.inner-inner-inner-span') as HTMLElement;
			const selector = generateHrefSelector(elem, href, 3);
			expect(selector).toBeUndefined();
		});

		it('generates a selector when an inner element is passed within levels specified of href element', () => {
			const elem = document.querySelector('.inner-inner-inner-span') as HTMLElement;
			const selector = generateHrefSelector(elem, href, 4);
			expect(selector).toBe(`DIV.inner A.inner-a[href*=\"${href}\"]`);
		});

		it('generates an escaped selector when classes with special characters are encountered', () => {
			document.body.innerHTML = `<div class="outer [brackets]"><div class="inner (parens)"><a class="inner-a w3ird!n3$$ pseudo:like:class" href="${href}"><span class="inner-span"><span class="inner-inner-span"><span class="inner-inner-inner-span"></span></span></span></a></div></div>`;

			const elem = document.querySelector('.outer') as HTMLElement;
			const selector = generateHrefSelector(elem, href);
			expect(selector).toBe(`DIV.outer.\\[brackets\\] DIV.inner.\\(parens\\) A.inner-a.w3ird\\!n3\\$\\$.pseudo\\:like\\:class[href*=\"${href}\"]`);
		});

		it('generates a selector when no class names are present on elements', () => {
			document.body.innerHTML = `<div class="outer"><div><span><a href="${href}"></a><span></div></div>`;

			const elem = document.querySelector('.outer') as HTMLElement;
			const selector = generateHrefSelector(elem, href);
			expect(selector).toBe(`DIV.outer DIV SPAN A[href*=\"${href}\"]`);
		});

		it('generates a selector when no class names are present on elements', () => {
			document.body.innerHTML = `<div class="outer"><div><div><span><a href="${href}"><span class="inner-span"></span></a><span></div></div></div>`;

			const elem = document.querySelector('.outer') as HTMLElement;
			const selector = generateHrefSelector(elem, href);
			expect(selector).toBe(`DIV.outer DIV DIV SPAN A[href*=\"${href}\"]`);
		});
	});
});
