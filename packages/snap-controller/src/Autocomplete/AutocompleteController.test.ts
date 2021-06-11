import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';

import { AutocompleteStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

import { AutocompleteController } from './AutocompleteController';
import { MockSnapClient } from '../__mocks__/MockSnapClient';

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

const globals = { siteId: 'ga9kq2' }; //TODO: change to 8uyt2m (snap.searchspring.io)
const badArgs = [
	{
		client: {},
		store: new AutocompleteStore(),
		urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockSnapClient(globals, { meta: { prefetch: false } }),
		store: {},
		urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockSnapClient(globals, { meta: { prefetch: false } }),
		store: new AutocompleteStore(),
		urlManager: {},
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockSnapClient(globals, { meta: { prefetch: false } }),
		store: new AutocompleteStore(),
		urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
		eventManager: { events: null, fire: null, on: null },
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockSnapClient(globals, { meta: { prefetch: false } }),
		store: new AutocompleteStore(),
		urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
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
		client: new MockSnapClient(globals, { meta: { prefetch: false } }),
		store: new AutocompleteStore(),
		urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
		eventManager: new EventManager(),
		profiler: {},
		logger: new Logger(),
		tracker: new Tracker(globals),
	},
	{
		client: new MockSnapClient(globals, { meta: { prefetch: false } }),
		store: new AutocompleteStore(),
		urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
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
		client: new MockSnapClient(globals, { meta: { prefetch: false } }),
		store: new AutocompleteStore(),
		urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
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
			let errorCaught = false;
			try {
				new AutocompleteController(acConfig, args);
			} catch (e) {
				errorCaught = true;
			}
			expect(errorCaught).toBeTruthy();
		});
	});

	it('has results after search method called', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockSnapClient(globals, { meta: { prefetch: false } }),
			store: new AutocompleteStore(),
			urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const query = 'wh';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		controller.client.mockDataFile = 'autocomplete.query.wh';
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/autocomplete.query.wh.json
		expect(controller.store.results.length).toBeGreaterThan(0);
		expect(controller.store.results.length).toBe(acConfig.globals.pagination.pageSize);
		expect(controller.store.terms.length).toBe(acConfig.globals.suggestions.count);
	});

	it('has no results if query is blank', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockSnapClient(globals, { meta: { prefetch: false } }),
			store: new AutocompleteStore(),
			urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const query = '';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);
		controller.client.mockDataFile = 'autocomplete.query.blank';
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/autocomplete.query.blank.json
		expect(controller.store.results.length).toBe(0);
	});

	it('sets query from urlManager (settings.initializeFromUrl)', async () => {
		// settings.initializeFromUrl is true by default

		const controller = new AutocompleteController(acConfig, {
			client: new MockSnapClient(globals, { meta: { prefetch: false } }),
			store: new AutocompleteStore(),
			urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const query = 'wh';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		controller.client.mockDataFile = 'autocomplete.query.wh';
		await controller.search(); // /src/__mocks__/data/ga9kq2/searches/autocomplete.query.wh.json
		expect(controller.store.results.length).toBeGreaterThan(0);
	});

	it('trims facets (settings.facets.trim)', async () => {
		// settings.facets.trim is true by default

		const controller = new AutocompleteController(acConfig, {
			client: new MockSnapClient(globals, { meta: { prefetch: false } }),
			store: new AutocompleteStore(),
			urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();

		const query = 'bumpers';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		controller.client.mockDataFile = 'autocomplete.query.bumpers';
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
			client: new MockSnapClient(globals, { meta: { prefetch: false } }),
			store: new AutocompleteStore(),
			urlManager: new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker),
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.init();
		controller.bind();
		jest.spyOn(controller, 'setFocused');
		jest.spyOn(controller.store, 'reset');
		jest.spyOn(controller.urlManager, 'reset');

		// reset() should not be called input exists
		inputEl.value = 'wh';
		inputEl.dispatchEvent(new Event('focus'));
		inputEl.dispatchEvent(new Event('keyup'));
		expect(controller.store.reset).not.toHaveBeenCalled();
		expect(controller.urlManager.reset).not.toHaveBeenCalled();
		expect(controller.setFocused).toHaveBeenCalledTimes(1);

		// reset() to be called when input is blank
		inputEl.value = '';
		inputEl.dispatchEvent(new Event('focus'));
		inputEl.dispatchEvent(new Event('keyup'));
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
		expect(window.location.href).toBe(`${acConfig.action}?search_query=${inputEl.value}`);
	});
});
