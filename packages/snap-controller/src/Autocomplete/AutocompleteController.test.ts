import { v4 as uuidv4 } from 'uuid';

import { AutocompleteStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

import { AutocompleteController, INPUT_DELAY } from './AutocompleteController';

import { MockClient } from '@searchspring/snap-shared';

let acConfig = {
	id: 'ac',
	selector: '#search_query',
	action: '',
	globals: {
		suggestions: { count: 4 },
		search: {
			query: { spellCorrection: true },
		},
		pagination: { pageSize: 6 },
	},
	settings: {
		initializeFromUrl: true,
		syncInputs: false,
		facets: { trim: true },
	},
};
const urlManager = new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker);
const services = { urlManager };
const globals = { siteId: 'ga9kq2' }; //TODO: change to 8uyt2m (snap.searchspring.io)
const badArgs = [
	{
		client: {},
		store: new AutocompleteStore(acConfig, services),
		urlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockClient(globals, {}),
		store: {},
		urlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockClient(globals, {}),
		store: new AutocompleteStore(acConfig, services),
		urlManager: {},
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockClient(globals, {}),
		store: new AutocompleteStore(acConfig, services),
		urlManager,
		eventManager: { events: null, fire: null, on: null },
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockClient(globals, {}),
		store: new AutocompleteStore(acConfig, services),
		urlManager,
		eventManager: {
			events: null,
			fire: null,
			on: function () {
				return;
			},
		},
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockClient(globals, {}),
		store: new AutocompleteStore(acConfig, services),
		urlManager,
		eventManager: new EventManager(),
		profiler: {},
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockClient(globals, {}),
		store: new AutocompleteStore(acConfig, services),
		urlManager,
		eventManager: new EventManager(),
		profiler: {
			setNamespace: function () {
				return;
			},
			create: null,
		},
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockClient(globals, {}),
		store: new AutocompleteStore(acConfig, services),
		urlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: {},
		tracker: new Tracker(globals),
	},
];

describe('Autocomplete Controller', () => {
	beforeEach(() => {
		acConfig.id = uuidv4().split('-').join('');
	});
	badArgs.forEach((args, index) => {
		it(`fails with bad constructor args ${index}`, () => {
			expect(() => {
				// @ts-ignore
				new AutocompleteController(acConfig, args);
			}).toThrow();
		});
	});

	it('has results after search method called', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const query = 'wh';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		controller.client.mockData.updateConfig({ autocomplete: 'autocomplete.query.wh' });
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/autocomplete.query.wh.json
		expect(controller.store.results.length).toBeGreaterThan(0);
		expect(controller.store.results.length).toBe(acConfig.globals.pagination.pageSize);
		expect(controller.store.terms.length).toBe(acConfig.globals.suggestions.count);
	});

	it('has no results if query is blank', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const query = '';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);
		controller.client.mockData.updateConfig({ autocomplete: 'autocomplete.query.blank' });
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/autocomplete.query.blank.json
		expect(controller.store.results.length).toBe(0);
	});

	it('sets query from urlManager (settings.initializeFromUrl)', async () => {
		// settings.initializeFromUrl is true by default

		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const query = 'wh';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		controller.client.mockData.updateConfig({ autocomplete: 'autocomplete.query.wh' });
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/autocomplete.query.wh.json
		expect(controller.store.results.length).toBeGreaterThan(0);
	});

	it('trims facets (settings.facets.trim)', async () => {
		// settings.facets.trim is true by default

		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const query = 'bumpers';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		controller.client.mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/autocomplete.query.bumpers.json
		expect(controller.store.results.length).toBeGreaterThan(0);
		const facetsWithValues = controller.store.facets.filter((facet) => facet.values?.length != 0);
		expect(facetsWithValues.length).toBe(controller.store.facets.length);
	});

	it('tests bind method without form (using config.action)', async () => {
		acConfig = {
			...acConfig,
			action: '/search',
		};
		const inputEl = document.createElement('input');
		inputEl.setAttribute('type', 'text');
		inputEl.setAttribute('id', 'search_query');
		document.body.appendChild(inputEl);

		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.init();
		await controller.bind();
		jest.spyOn(controller, 'setFocused');
		jest.spyOn(controller.store, 'reset');
		jest.spyOn(controller.urlManager, 'reset');

		// reset() should not be called input exists
		inputEl.value = 'wh';
		inputEl.dispatchEvent(new Event('focus'));
		inputEl.dispatchEvent(new Event('keyup'));

		// to deal with setTimeout used in focus event
		await new Promise((resolve) => setTimeout(resolve));

		expect(controller.store.reset).not.toHaveBeenCalled();
		expect(controller.urlManager.reset).not.toHaveBeenCalled();
		expect(controller.setFocused).toHaveBeenCalledTimes(1);

		// reset() to be called when input is blank
		inputEl.value = '';
		inputEl.dispatchEvent(new Event('focus'));
		inputEl.dispatchEvent(new Event('keyup'));

		// to deal with setTimeout used in focus event
		await new Promise((resolve) => setTimeout(resolve));

		expect(controller.store.reset).toHaveBeenCalled();
		expect(controller.urlManager.reset).toHaveBeenCalled();
		expect(controller.setFocused).toHaveBeenCalledTimes(2);

		// setFocused to be called if body clicked
		document.querySelector('body').dispatchEvent(new Event('click', { bubbles: true }));
		expect(controller.setFocused).toHaveBeenCalledTimes(3);

		delete window.location;
		window.location = {
			...window.location,
			href: null, // jest does not support window location changes
		};

		inputEl.value = 'wh';
		inputEl.dispatchEvent(new Event('focus'));
		inputEl.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, keyCode: 13 })); // Enter key

		// timeout needed due to beforeSubmit event and awaiting further input
		await new Promise((resolve) => setTimeout(resolve, INPUT_DELAY + 1));
		expect(window.location.href).toBe(`${acConfig.action}?search_query=${inputEl.value}`);
	});
});
