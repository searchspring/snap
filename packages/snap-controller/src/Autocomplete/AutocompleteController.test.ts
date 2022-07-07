import { v4 as uuidv4 } from 'uuid';

import { AutocompleteStore } from '@searchspring/snap-store-mobx';
import type { AutocompleteStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { AutocompleteController, INPUT_DELAY as _INPUT_DELAY } from './AutocompleteController';
import { waitFor } from '@testing-library/preact';

import { MockClient } from '@searchspring/snap-shared';

const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const INPUT_DELAY = _INPUT_DELAY + 10;

let acConfigBase = {
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

let acConfig: AutocompleteStoreConfig = {
	id: 'ac',
	selector: '',
};

const urlManager = new UrlManager(new QueryStringTranslator({ queryParameter: 'search_query' }), reactLinker);
const services = { urlManager };
const globals = { siteId: 'ga9kq2' };
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
		document.body.innerHTML = '<div><input type="text" id="search_query"></div>';
		acConfig = Object.assign({}, acConfigBase); // reset config
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

	it('can submit with form with original query when corrected query', async () => {
		document.body.innerHTML = '<div><form action="/search.html"><input type="text" id="search_query"></form></div>';
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'corrected', siteId: '8uyt2m' });

		controller.bind();
		let inputEl: HTMLInputElement | null;
		let form: HTMLFormElement | null;
		let query = 'dresss';

		await waitFor(() => {
			inputEl = document.querySelector(controller.config.selector);
		});

		form = inputEl!.form;

		inputEl!.value = query;
		inputEl!.focus();
		inputEl!.dispatchEvent(new Event('keyup'));

		await waitFor(() => {
			controller.search();
		});
		let beforeSubmitfn = jest.spyOn(controller.eventManager, 'fire');
		form?.dispatchEvent(new Event('submit', { bubbles: true }));

		await waitFor(() => {
			let oqInputEl: HTMLInputElement | null = form!.querySelector('input[name="oq"]');
			expect(oqInputEl!).toBeDefined();
			expect(oqInputEl!.value).toBe(query);
		});

		beforeSubmitfn!.mockClear();
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

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.wh' });
		controller.search();

		await waitFor(() => {
			expect(controller.store.results.length).toBeGreaterThan(0);
			expect(controller.store.results.length).toBe(acConfig.globals!.pagination!.pageSize);
			expect(controller.store.terms.length).toBe(acConfig.globals!.suggestions!.count);
		});
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
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.blank' });
		controller.search();

		await waitFor(() => {
			expect(controller.store.results.length).toBe(0);
		});
	});

	it('unbinds inputs', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.bind();

		controller.unbind();

		let inputEl: HTMLInputElement | null;

		await waitFor(() => {
			inputEl = document.querySelector(controller.config.selector);
		});

		const query = 'bumpers';
		inputEl!.value = query;
		inputEl!.focus();
		inputEl!.dispatchEvent(new Event('keyup'));
		expect(controller.urlManager.state.query).toBe(undefined);
	});

	it('can bind to input after input has been focused', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		let setFocusedfn: any;

		await waitFor(() => {
			controller.init();
			setFocusedfn = jest.spyOn(controller, 'setFocused');

			const inputEl: HTMLInputElement | null = document.querySelector(controller.config.selector);
			const query = 'bumpers';
			inputEl!.value = query;
			inputEl!.focus();

			expect(controller.urlManager.state.query).toBe(undefined);
			expect(setFocusedfn).toHaveBeenCalledTimes(0);
		});

		await waitFor(() => {
			controller.bind();
			expect(setFocusedfn).toHaveBeenCalledTimes(1);
			setFocusedfn.mockClear();
		});
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

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
		controller.search();

		await waitFor(() => {
			expect(controller.store.results.length).toBeGreaterThan(0);
			const facetsWithValues = controller.store.facets.filter((facet) => facet.values?.length != 0);
			expect(facetsWithValues.length).toBe(controller.store.facets.length);
		});
	});

	it('syncs inputs (settings.syncInputs)', async () => {
		acConfig.settings!.syncInputs = true;
		acConfig.selector = '.ss-ac';
		document.body.innerHTML = '<div><input type="text" class="ss-ac"/><input type="text" class="ss-ac"/></div>';

		const inputEl1: HTMLInputElement = document.querySelectorAll('.ss-ac')[0] as HTMLInputElement;
		const inputEl2: HTMLInputElement = document.querySelectorAll('.ss-ac')[1] as HTMLInputElement;

		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.bind();

		await waitFor(() => {
			const query = 'bumpers';

			inputEl1.value = query;
			inputEl1.focus();
			inputEl1.dispatchEvent(new Event('keyup'));

			expect(inputEl1.value).toBe(query);
			expect(inputEl2.value).toBe(query);
		});
	});

	it('can invoke controller track.product.click', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const clickfn = jest.spyOn(controller.track.product, 'click');

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
		controller.search();

		await waitFor(() => {
			const event = new Event('click');

			const logWarnfn = jest.spyOn(controller.log, 'warn');

			controller.track.product.click(event as any, {});

			expect(clickfn).toHaveBeenCalledWith(event, {});
			expect(logWarnfn).toHaveBeenCalledWith('product.click tracking is not currently supported in this controller type');

			clickfn.mockClear();
			logWarnfn.mockClear();
		});
	});

	it('can set personalization cart param', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
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
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
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
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
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

	it('resets inputs', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		let inputEl: HTMLInputElement | null;
		let query: string;
		controller.bind();

		await waitFor(() => {
			inputEl = document.querySelector(controller.config.selector);
			query = 'bumpers';
			inputEl!.value = query;
			inputEl!.focus();
			inputEl!.dispatchEvent(new Event('keyup'));
		});

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
		controller.search();
		const storeResetfn = jest.spyOn(controller.store, 'reset');

		await waitFor(() => {
			expect(inputEl!.value).toBe(query);
		});

		controller.reset();

		await waitFor(() => {
			expect(storeResetfn).toHaveBeenCalledTimes(1);
			expect(inputEl!.value).toBe('');
		});

		storeResetfn.mockClear();
	});

	it('looses focus on escKey', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.bind();
		let inputEl: HTMLInputElement | null;

		await waitFor(() => {
			inputEl = document.querySelector(controller.config.selector);
		});
		inputEl!.focus();

		expect(document.activeElement).toBe(inputEl!);

		const setFocusedfn = jest.spyOn(controller, 'setFocused');
		inputEl!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: KEY_ESCAPE }));

		expect(setFocusedfn).toHaveBeenCalledTimes(1);

		expect(document.activeElement).not.toBe(inputEl!);
		expect(document.activeElement).toBe(document.body);

		setFocusedfn.mockClear();
	});

	it('looses focus on document click', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		let inputEl: HTMLInputElement | null;
		controller.bind();

		await waitFor(() => {
			inputEl = document.querySelector(controller.config.selector);
			inputEl!.focus();
		});

		await waitFor(() => {
			expect(document.activeElement).toBe(inputEl);
		});

		const setFocusedfn = jest.spyOn(controller, 'setFocused');

		inputEl!.dispatchEvent(new Event('click', { bubbles: true })); // should not loose focus

		expect(setFocusedfn).not.toHaveBeenCalled();
		expect(controller.store.state.focusedInput).toBe(inputEl!);
		expect(document.activeElement).toBe(inputEl!);

		const divEl = document.querySelector('div');
		divEl!.dispatchEvent(new Event('click', { bubbles: true }));

		expect(setFocusedfn).toHaveBeenCalledTimes(1);
		expect(controller.store.state.focusedInput).toBe(undefined);

		setFocusedfn.mockClear();
	});
	it('can submit with form', async () => {
		document.body.innerHTML = '<div><form action="/search.html"><input type="text" id="search_query"></form></div>';
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.bind();
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });

		let inputEl: HTMLInputElement | null;
		await waitFor(() => {
			inputEl = document.querySelector(controller.config.selector);
		});

		const query = 'bumpers';
		inputEl!.value = query;
		inputEl!.focus();
		inputEl!.dispatchEvent(new Event('keyup'));

		const form = inputEl!.form;
		const beforeSubmitfn = jest.spyOn(controller.eventManager, 'fire');

		form?.dispatchEvent(new Event('submit', { bubbles: true }));
		//this timeout seems to be needed. Cant replace with waitFor
		await new Promise((resolve) => setTimeout(resolve, INPUT_DELAY));

		expect(beforeSubmitfn).toHaveBeenCalledWith('beforeSubmit', {
			controller,
			input: inputEl!,
		});

		beforeSubmitfn.mockClear();
	});

	it('can submit without form and config.action with original query', async () => {
		document.body.innerHTML = '<div><input type="text" id="search_query"></div>';
		acConfig.action = '/search.html';

		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'corrected', siteId: '8uyt2m' });

		controller.bind();
		let inputEl: HTMLInputElement | null;

		await waitFor(() => {
			inputEl = document.querySelector(controller.config.selector);
		});

		const query = 'dresss';
		inputEl!.value = query;
		inputEl!.focus();
		inputEl!.dispatchEvent(new Event('keyup'));

		inputEl!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: KEY_ENTER }));

		await waitFor(() => {
			expect(controller.store.search.originalQuery).toBeDefined();
		});
		//@ts-ignore
		delete window.location;
		window.location = {
			...window.location,
			href: '', // jest does not support window location changes
		};

		inputEl!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: KEY_ENTER }));

		await waitFor(() => {
			expect(window.location.href).toContain(`oq=${query}`);
			expect(window.location.href).toContain(acConfig.action);
		});
	});

	it('tests bind method without form (using config.action)', async () => {
		acConfig = {
			...acConfig,
			action: '/search',
		};
		const inputEl = document.createElement('input');
		inputEl!.setAttribute('type', 'text');
		inputEl!.setAttribute('id', 'search_query');
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

		controller.bind();
		const setFocusedfn = jest.spyOn(controller, 'setFocused');
		const storeResetfn = jest.spyOn(controller.store, 'reset');
		const urlManagerResetfn = jest.spyOn(controller.urlManager, 'reset');

		await waitFor(() => {
			// reset() should not be called input exists
			inputEl!.value = 'wh';
			inputEl!.focus();
			inputEl!.dispatchEvent(new Event('keyup'));
		});

		await waitFor(() => {
			expect(storeResetfn).not.toHaveBeenCalled();
			expect(urlManagerResetfn).not.toHaveBeenCalled();
			expect(setFocusedfn).toHaveBeenCalledTimes(1);

			// reset() to be called when input is blank
			inputEl!.value = '';
			inputEl!.dispatchEvent(new Event('focus'));
			inputEl!.dispatchEvent(new Event('keyup'));
		});

		await waitFor(() => {
			expect(storeResetfn).toHaveBeenCalled();
			expect(urlManagerResetfn).toHaveBeenCalled();
			expect(setFocusedfn).toHaveBeenCalledTimes(2);

			// setFocused to be called if body clicked
			document.querySelector('body')!.dispatchEvent(new Event('click', { bubbles: true }));
		});

		await waitFor(() => {
			expect(setFocusedfn).toHaveBeenCalledTimes(3);

			//@ts-ignore
			delete window.location;
			window.location = {
				...window.location,
				href: '', // jest does not support window location changes
			};

			inputEl!.value = 'wh';
			inputEl!.focus();
			inputEl!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: KEY_ENTER }));
		});

		await waitFor(() => {
			expect(window.location.href).toBe(`${acConfig.action}?search_query=${inputEl!.value}`);
		});

		setFocusedfn.mockClear();
		storeResetfn.mockClear();
		urlManagerResetfn.mockClear();
	});

	it('logs error if middleware throws in beforeSearch', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const query = 'bumpers';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		const middleware = jest.fn(() => {
			throw new Error('middleware error');
		});
		const event = 'beforeSearch';
		controller.on(event, middleware);

		expect(middleware).not.toHaveBeenCalled();

		const logErrorfn = jest.spyOn(controller.log, 'error');

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
		controller.search();

		await waitFor(() => {
			expect(middleware).toHaveBeenCalledTimes(1);
			expect(logErrorfn).toHaveBeenCalledWith(`error in '${event}' middleware`);

			logErrorfn.mockClear();
		});
	});

	it('logs error if middleware throws in afterSearch', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const query = 'bumpers';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		const middleware = jest.fn(() => {
			throw new Error('middleware error');
		});
		const event = 'afterSearch';
		controller.on(event, middleware);

		expect(middleware).not.toHaveBeenCalled();

		const logErrorfn = jest.spyOn(controller.log, 'error');

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
		controller.search();
		await waitFor(() => {
			expect(middleware).toHaveBeenCalledTimes(1);
			expect(logErrorfn).toHaveBeenCalledWith(`error in '${event}' middleware`);

			logErrorfn.mockClear();
		});
	});

	it('logs error if middleware throws in afterStore', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const query = 'bumpers';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		const middleware = jest.fn(() => {
			throw new Error('middleware error');
		});
		const event = 'afterStore';
		controller.on(event, middleware);

		expect(middleware).not.toHaveBeenCalled();

		const logErrorfn = jest.spyOn(controller.log, 'error');

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
		controller.search();
		await waitFor(() => {
			expect(middleware).toHaveBeenCalledTimes(1);
			expect(logErrorfn).toHaveBeenCalledWith(`error in '${event}' middleware`);

			logErrorfn.mockClear();
		});
	});

	it('logs error if middleware throws in focusChange', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const middleware = jest.fn(() => {
			throw new Error('middleware error');
		});
		const event = 'focusChange';
		controller.on(event, middleware);

		expect(middleware).not.toHaveBeenCalled();

		const logErrorfn = jest.spyOn(controller.log, 'error');

		const inputEl: HTMLInputElement | null = document.querySelector(controller.config.selector);
		const query = 'bumpers';
		inputEl!.value = query;
		inputEl!.focus();

		controller.bind();
		await waitFor(() => {
			expect(middleware).toHaveBeenCalledTimes(1);
			expect(logErrorfn).toHaveBeenCalledWith(`error in '${event}' middleware`);

			logErrorfn.mockClear();
		});
	});

	it(`tests focusChange middleware err handled`, async function () {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const middleware = jest.fn(() => {
			return false; // return false to stop middleware
		});
		const event = 'focusChange';
		controller.on(event, middleware);

		expect(middleware).not.toHaveBeenCalled();

		const spy = jest.spyOn(controller.log, 'warn');

		const inputEl: HTMLInputElement | null = document.querySelector(controller.config.selector);
		const query = 'bumpers';
		inputEl!.value = query;
		inputEl!.focus();

		controller.bind();
		await waitFor(() => {
			expect(middleware).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(`'${event}' middleware cancelled`);
			spy.mockClear();
		});
	});

	const events = ['beforeSearch', 'afterSearch', 'afterStore'];
	events.forEach((event) => {
		it(`tests ${event} middleware err handled`, async function () {
			const controller = new AutocompleteController(acConfig, {
				client: new MockClient(globals, {}),
				store: new AutocompleteStore(acConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});

			const query = 'bumpers';
			controller.urlManager = controller.urlManager.reset().set('query', query);
			expect(controller.urlManager.state.query).toBe(query);

			const middleware = jest.fn(() => {
				return false; // return false to stop middleware
			});
			controller.on(event, middleware);

			expect(middleware).not.toHaveBeenCalled();

			const spy = jest.spyOn(controller.log, 'warn');

			(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
			controller.search();
			await waitFor(() => {
				expect(middleware).toHaveBeenCalledTimes(1);
				expect(spy).toHaveBeenCalledWith(`'${event}' middleware cancelled`);

				spy.mockClear();
			});
		});
	});

	it('logs error if middleware throws in beforeSubmit when submit with form', async () => {
		document.body.innerHTML = '<div><form action="/search.html"><input type="text" id="search_query"></form></div>';
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.bind();
		let inputEl: HTMLInputElement | null;
		const query = 'bumpers';
		const middleware = jest.fn(() => {
			throw new Error('middleware error');
		});
		const event = 'beforeSubmit';
		await waitFor(() => {
			(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
			controller.on(event, middleware);
		});

		expect(middleware).not.toHaveBeenCalled();

		inputEl = document.querySelector(controller.config.selector);
		inputEl!.value = query;
		inputEl!.focus();
		inputEl!.dispatchEvent(new Event('keyup'));

		const logErrorfn = jest.spyOn(controller.log, 'error');
		const form = inputEl!.form;
		form?.dispatchEvent(new Event('submit', { bubbles: true }));

		await waitFor(() => {
			expect(middleware).toHaveBeenCalled();
			expect(logErrorfn).toHaveBeenCalledWith(`error in '${event}' middleware`);
		});

		logErrorfn.mockClear();
	});

	it('tests beforeSubmit middleware err handled using form', async () => {
		document.body.innerHTML = '<div><form action="/search.html"><input type="text" id="search_query"></form></div>';
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.bind();
		const middleware = jest.fn(() => {
			return false; // return false to stop middleware
		});
		let inputEl: HTMLInputElement | null;
		const event = 'beforeSubmit';
		await waitFor(() => {
			(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'autocomplete.query.bumpers' });
			controller.on(event, middleware);
		});

		expect(middleware).not.toHaveBeenCalled();

		inputEl = document.querySelector(controller.config.selector);
		const query = 'bumpers';
		inputEl!.value = query;
		inputEl!.focus();
		inputEl!.dispatchEvent(new Event('keyup'));

		const spy = jest.spyOn(controller.log, 'warn');

		const form = inputEl!.form;
		form?.dispatchEvent(new Event('submit', { bubbles: true }));

		await waitFor(() => {
			expect(middleware).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(`'${event}' middleware cancelled`);
		});
		spy.mockClear();
	});

	it('logs error if middleware throws in beforeSubmit using enter key', async () => {
		acConfig.action = '/search.html';

		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.bind();

		const middleware = jest.fn(() => {
			throw new Error('middleware error');
		});
		const event = 'beforeSubmit';
		const logErrorfn = jest.spyOn(controller.log, 'error');
		await waitFor(() => {
			controller.on(event, middleware);
		});
		expect(middleware).not.toHaveBeenCalled();

		const inputEl: HTMLInputElement | null = document.querySelector(controller.config.selector);
		const query = 'bumpers';
		inputEl!.value = query;
		inputEl!.focus();
		inputEl!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: KEY_ENTER }));
		await waitFor(() => {
			expect(middleware).toHaveBeenCalled();
			expect(logErrorfn).toHaveBeenCalledWith(`error in '${event}' middleware`);
		});
		logErrorfn.mockClear();
	});

	it('tests beforeSubmit middleware err handled using enter key', async () => {
		acConfig.action = '/search.html';

		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.bind();

		const middleware = jest.fn(() => {
			return false; // return false to stop middleware
		});
		const event = 'beforeSubmit';
		const spy = jest.spyOn(controller.log, 'warn');
		await waitFor(() => {
			controller.on(event, middleware);
		});

		expect(middleware).not.toHaveBeenCalled();

		const inputEl: HTMLInputElement | null = document.querySelector(controller.config.selector);
		const query = 'bumpers';
		inputEl!.value = query;
		inputEl!.focus();
		inputEl!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: KEY_ENTER }));

		await waitFor(() => {
			expect(middleware).toHaveBeenCalledTimes(1);
			expect(spy).toHaveBeenCalledWith(`'${event}' middleware cancelled`);
		});
		spy.mockClear();
	});

	it('logs error if 429', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.client.autocomplete = jest.fn(() => {
			throw 429;
		});

		const query = 'bumpers';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		controller.search();

		await waitFor(() => {
			expect(controller.store.error).toStrictEqual({
				code: 429,
				type: 'warning',
				message: 'Too many requests try again later',
			});
		});
	});

	it('logs error if 500', async () => {
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.client.autocomplete = jest.fn(() => {
			throw 500;
		});

		const query = 'bumpers';
		controller.urlManager = controller.urlManager.reset().set('query', query);
		expect(controller.urlManager.state.query).toBe(query);

		controller.search();
		await waitFor(() => {
			expect(controller.store.error).toStrictEqual({
				code: 500,
				type: 'error',
				message: 'Invalid Search Request or Service Unavailable',
			});
		});
	});

	it('can search trending terms', async () => {
		acConfig.settings!.trending = {
			limit: 5,
			showResults: true,
		};
		const controller = new AutocompleteController(acConfig, {
			client: new MockClient(globals, {}),
			store: new AutocompleteStore(acConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'default', siteId: '8uyt2m' });

		const searchTrendingfn = jest.spyOn(controller, 'searchTrending');
		const trendingfn = jest.spyOn(controller.client, 'trending');

		controller.bind();
		await waitFor(() => {
			expect(searchTrendingfn).toHaveBeenCalledTimes(1);
			expect(trendingfn).toHaveBeenCalledTimes(1);

			expect(controller.store.trending.length).toBeGreaterThan(0);

			// first trending term should be active upon focus
			expect(controller.store.trending[0].active).toBe(false);
			const inputEl: HTMLInputElement | null = document.querySelector(controller.config.selector);
			inputEl!.focus();
		});

		await waitFor(() => {
			expect(controller.store.trending[0].active).toBe(true);
			// test retrieving trending terms from storage
			controller.searchTrending();
		});

		await waitFor(() => {
			expect(searchTrendingfn).toHaveBeenCalledTimes(2);
			expect(trendingfn).toHaveBeenCalledTimes(1); // should not have been called again
			searchTrendingfn.mockClear();
			trendingfn.mockClear();
		});
	});
});
