import 'whatwg-fetch';

import { cleanup, waitFor } from '@testing-library/preact';

import { MockClient } from '@searchspring/snap-shared';
import { Tracker, TrackerGlobals } from '@searchspring/snap-tracker';
import { Logger } from '@searchspring/snap-logger';
import { cookies } from '@searchspring/snap-toolbox';

import type { SearchControllerConfig, AutocompleteControllerConfig } from '@searchspring/snap-controller';

import { Snap, SnapConfig, DEV_COOKIE } from './Snap';
import type { AutocompleteStore } from '@searchspring/snap-store-mobx';
import { ClientGlobals } from '@searchspring/snap-client';

const generateBaseConfig = (): SnapConfig => {
	return {
		client: {
			globals: {
				siteId: '8uyt2m',
			},
		},
	};
};

const Component = (props: any) => {
	const controller = props.controller;
	return <div className="injectedComponent">{controller.type}</div>;
};

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

const resetAllCookies = () => {
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf('=');
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
	}
};

// attribute click tracking tests before snap-preact tests as it deletes window.searchspring
describe('Attribute Click Tracking', () => {
	afterEach(() => {
		global.document.body.innerHTML = '';
	});

	afterAll(() => {
		resetAllCookies();
	});

	it('can track ss-track-cart-add', async () => {
		const attribute = 'ss-track-cart-add';
		const skus = ['abc123'];

		global.document.body.innerHTML = `<div>
			<button ${attribute}='${skus.join(',')}'></button>
		</div>`;

		const baseConfig = generateBaseConfig();
		const snap = new Snap(baseConfig);
		const trackEvent = jest.spyOn(snap.tracker.cookies.cart, 'add');

		const clickEvent = new Event('click', {
			bubbles: true, // required because our click event is attached to the document
		});

		const button = global.document.querySelector(`[${attribute}]`);
		button?.dispatchEvent(clickEvent);

		expect(trackEvent).toHaveBeenCalledWith(skus);
		expect(global.document.cookie).toContain(`ssCartProducts=${encodeURIComponent(skus.join(','))}`);

		trackEvent.mockRestore();
	});

	it('can track ss-track-cart-remove', async () => {
		const attribute = 'ss-track-cart-remove';
		const skus = ['abc123'];

		global.document.body.innerHTML = `<div>
			<button ${attribute}='${skus.join(',')}'></button>
		</div>`;

		const baseConfig = generateBaseConfig();
		const snap = new Snap(baseConfig);
		const trackEvent = jest.spyOn(snap.tracker.cookies.cart, 'remove');

		const clickEvent = new Event('click', {
			bubbles: true, // required because our click event is attached to the document
		});

		const button = global.document.querySelector(`[${attribute}]`);
		button?.dispatchEvent(clickEvent);

		expect(trackEvent).toHaveBeenCalledWith(skus);
		expect(global.document.cookie).not.toContain(`${skus[0]}`);

		trackEvent.mockRestore();
	});

	it('can track ss-track-cart-clear', async () => {
		const attribute = 'ss-track-cart-clear';

		global.document.body.innerHTML = `<div>
			<button ${attribute}></button>
		</div>`;

		const baseConfig = generateBaseConfig();
		const snap = new Snap(baseConfig);
		const trackEvent = jest.spyOn(snap.tracker.cookies.cart, 'clear');

		// first add products to cart
		const skus = ['abc123', 'def456'];
		snap.tracker.cookies.cart.add(skus);
		expect(global.document.cookie).toContain(`ssCartProducts=${encodeURIComponent(skus.join(','))}`);

		const clickEvent = new Event('click', {
			bubbles: true, // required because our click event is attached to the document
		});

		const button = global.document.querySelector(`[${attribute}]`);
		button?.dispatchEvent(clickEvent);

		expect(trackEvent).toHaveBeenCalledTimes(1);
		expect(global.document.cookie).not.toContain(`${skus[0]}`);
		expect(global.document.cookie).not.toContain(`${skus[1]}`);

		trackEvent.mockRestore();
	});

	it('can track ss-track-intellisuggest and ss-track-intellisuggest-signature', async () => {
		const intellisuggestData = 'intellisuggestData';
		const intellisuggestSignature = 'intellisuggestSignature';
		const href = '/search';

		global.document.body.innerHTML = `<div>
			<a 
				href='${href}' 
				ss-track-intellisuggest='${intellisuggestData}' 
				ss-track-intellisuggest-signature='${intellisuggestSignature}'>
			</a>
		</div>`;

		const baseConfig = generateBaseConfig();
		const snap = new Snap(baseConfig);
		const trackEvent = jest.spyOn(snap.tracker.track.product, 'click');

		const clickEvent = new Event('click', {
			bubbles: true, // required because our click event is attached to the document
		});

		const button = global.document.querySelector('[ss-track-intellisuggest][ss-track-intellisuggest-signature]');
		button?.dispatchEvent(clickEvent);

		expect(trackEvent).toHaveBeenCalled();

		trackEvent.mockRestore();
	});

	it('can track if nested element is clicked', async () => {
		const attribute = 'ss-track-cart-add';
		const skus = ['abc123'];

		global.document.body.innerHTML = `<div>
			<button ${attribute}='${skus.join(',')}'>
				<span class='click'>Click Me</span>
			</button>
		</div>`;

		const baseConfig = generateBaseConfig();
		const snap = new Snap(baseConfig);
		const trackEvent = jest.spyOn(snap.tracker.cookies.cart, 'add');

		const clickEvent = new Event('click', {
			bubbles: true, // required because our click event is attached to the document
		});

		const span = global.document.querySelector('span.click');
		span?.dispatchEvent(clickEvent);

		expect(trackEvent).toHaveBeenCalledWith(skus);
		expect(global.document.cookie).toContain(`ssCartProducts=${encodeURIComponent(skus.join(','))}`);

		trackEvent.mockRestore();
	});
});

describe('Snap Preact', () => {
	beforeEach(() => {
		delete window.searchspring;

		document.body.innerHTML = `<script id="searchspring-context"></script><div id="searchspring-content" style="min-height: 100vh"></div>`;
	});

	afterEach(cleanup);

	it('throws if configuration is not provided', () => {
		expect(() => {
			// @ts-ignore - testing bad instantiation
			new Snap();
		}).toThrow();
	});

	it('throws if configuration is not complete', () => {
		const config = {
			client: {},
		};

		expect(() => {
			// @ts-ignore - testing bad instantiation
			new Snap(config);
		}).toThrow();
	});

	it('uses the logger to log an error when no context is found', () => {
		const baseConfig = generateBaseConfig();
		document.body.innerHTML = '';

		const logger = new Logger({ prefix: 'Snap Preact ' });
		const spy = jest.spyOn(console, 'error');
		new Snap(baseConfig, { logger });
		expect(spy).toHaveBeenCalledWith('Snap failed to find global context');

		spy.mockClear();
	});

	it('creates a proper Snap object with minimal configuration', () => {
		const baseConfig = generateBaseConfig();
		const snap = new Snap(baseConfig);

		// services are defined
		expect(snap.logger).toBeDefined();
		expect(snap.client).toBeDefined();
		expect(snap.tracker).toBeDefined();

		// snap passes the app mode down to the client config
		const extendedBaseConfig = { ...baseConfig };
		extendedBaseConfig.client!.config = {
			mode: 'production',
		};

		// properties are defined
		// @ts-ignore - accessing private property
		expect(snap.config).toStrictEqual(extendedBaseConfig);
		expect(snap.context).toStrictEqual({});
		expect(snap.controllers).toStrictEqual({});
		// @ts-ignore - accessing private property
		expect(snap.mode).toBe('production');
		// @ts-ignore - accessing private property
		expect(snap.logger.mode).toBe('production');
		// @ts-ignore - accessing private property
		expect(snap.client.mode).toBe('production');

		// @ts-ignore - checking private property
		expect(snap.client.globals.siteId).toBe(baseConfig.client.globals.siteId);
	});

	it('merges config found in context and prioritizes the config found in the context', () => {
		document.body.innerHTML = `<script id="searchspring-context">config = { client: { globals: { siteId: 'yyyyyy' } } };</script>`;
		const baseConfig = generateBaseConfig();
		const snap = new Snap(baseConfig);

		// @ts-ignore - checking private property
		expect(snap.client.globals.siteId).toBe('yyyyyy');
	});

	it('merges contexts and prioritizes the context found in the script', () => {
		document.body.innerHTML = `<script id="searchspring-context">shopper = { id: 'snapdevscript' };</script>`;
		const baseConfig = generateBaseConfig();
		const contextConfig = {
			...baseConfig,
			context: {
				shopper: {
					id: 'snapdevconfig',
				},
			},
		};

		const snap = new Snap(contextConfig);
		expect(snap.context.shopper!.id).toBe('snapdevscript');
	});

	it('has mode setting functionality via cookie', () => {
		cookies.set(DEV_COOKIE, '1', 'Lax', 3600000);
		const baseConfig = generateBaseConfig();
		const snap = new Snap(baseConfig);

		// snap passes the app mode down to the client config
		const extendedBaseConfig = { ...baseConfig };
		extendedBaseConfig.client!.config = {
			mode: 'development',
		};

		// properties are defined
		// @ts-ignore - accessing private property
		expect(snap.config).toStrictEqual(baseConfig);

		// @ts-ignore - accessing private property
		expect(snap.mode).toBe('development');
		// @ts-ignore - accessing private property
		expect(snap.logger.mode).toBe('development');
		// @ts-ignore - accessing private property
		expect(snap.client.mode).toBe('development');

		cookies.unset(DEV_COOKIE);
	});

	it('exposes itself globally on the window', () => {
		const baseConfig = generateBaseConfig();
		const snap = new Snap(baseConfig);
		expect(window.searchspring).toBeDefined();
		expect(window.searchspring.context).toBe(snap.context);
		expect(window.searchspring.client).toBe(snap.client);
	});

	it('automatically tracks the shopper id when provided', () => {
		const baseConfig = generateBaseConfig();
		const contextConfig = {
			...baseConfig,
			context: {
				shopper: {
					id: 'snapdev',
				},
			},
		};

		const tracker = new Tracker(contextConfig.client!.globals as TrackerGlobals);
		const spy = jest.spyOn(tracker.track.shopper, 'login');
		new Snap(contextConfig, { tracker });
		expect(spy).toHaveBeenCalledWith({ id: contextConfig.context.shopper.id });

		spy.mockClear();
	});

	it('automatically sets the shopper cart when provided', () => {
		const baseConfig = generateBaseConfig();
		const contextConfig = {
			...baseConfig,
			context: {
				shopper: {
					id: 'snapdev',
					cart: [
						{ uid: 'sku1', qty: 1, price: 100 },
						{ uid: 'sku2', qty: 2, price: 200 },
						{ uid: 'sku3', qty: 3, price: 300 },
					],
				},
			},
		};
		const snap = new Snap(contextConfig);
		expect(snap.tracker.storage.cart.get()).toEqual(contextConfig.context.shopper.cart);
	});

	it('automatically picks up the merchandising segments when provided', () => {
		const baseConfig = generateBaseConfig();
		const contextConfig = {
			...baseConfig,
			context: {
				merchandising: {
					segments: ['segment1', 'segment2'],
				},
			},
		};
		const snap = new Snap(contextConfig);
		// @ts-ignore
		expect(snap.client.globals.merchandising).toEqual(contextConfig.context.merchandising);
	});

	it('can send beacon error events from error event listener', () => {
		// Define the addEventListener method with a Jest mock function
		const events: {
			[key: string]: EventListenerOrEventListenerObject;
		} = {};
		window.addEventListener = jest.fn((event, callback) => {
			events[event] = callback;
		});
		window.removeEventListener = jest.fn((event) => {
			delete events[event];
		});

		const tracker = new Tracker(generateBaseConfig().client!.globals as TrackerGlobals);
		const spy = jest.spyOn(tracker.track, 'error');
		new Snap(generateBaseConfig(), { tracker });

		const error = new ErrorEvent('error', {
			error: new Error('test error'),
			message: 'something went wrong!',
			lineno: 1,
			filename: 'https://snapui.searchspring.io/test.js',
		});

		// @ts-ignore - jest event listener mock
		events.error(error);

		expect(spy).toHaveBeenCalled();
		spy.mockClear();
	});

	it('can send beacon error events using handlers.error method', () => {
		const tracker = new Tracker(generateBaseConfig().client!.globals as TrackerGlobals);
		const spy = jest.spyOn(tracker.track, 'error');
		const snap = new Snap(generateBaseConfig(), { tracker });

		const error = new ErrorEvent('error', {
			error: new Error('test error'),
			message: 'something went wrong!',
			lineno: 1,
			filename: 'https://snapui.searchspring.io/test.js',
		});

		snap.handlers.error(error);

		expect(spy).toHaveBeenCalled();
		spy.mockClear();
	});

	describe('creates search controllers via config', () => {
		it(`can create a search controller`, () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
								settings: {
									redirects: {
										merchandising: false,
									},
								},
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			const search = snap.controllers.search;
			expect(search).toBeDefined();
			expect(search.id).toBe('search');
			expect(search.type).toBe('search');
			expect((search.config as SearchControllerConfig).settings!.redirects!.merchandising).toBe(false);

			// it has not searched and is not searching
			expect(search.store.loading).toBe(false);
			expect(search.store.loaded).toBe(false);
		});

		it(`can create multiple search controllers`, () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'searchOne',
							},
						},
						{
							config: {
								id: 'searchTwo',
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			expect(snap.controllers.searchOne).toBeDefined();
			expect(snap.controllers.searchTwo).toBeDefined();
		});

		it(`logs an error when attempting to create search controller with the same id`, () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
						},
						{
							config: {
								id: 'search',
							},
						},
					],
				},
			};

			const logger = new Logger();
			const spy = jest.spyOn(logger, 'error');

			// valid config - no errors logged
			new Snap(searchConfig, { logger });

			expect(spy).toHaveBeenCalledWith(`Controller with id 'search' is already defined`);

			const snap = new Snap(searchConfig);

			expect(snap.controllers.search).toBeDefined();
		});

		it(`does not run the controller 'search' method when a targeter is NOT found`, async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-dne',
									hideTarget: true,
									component: () => {
										return Component;
									},
								},
							],
						},
					],
				},
			};

			const client = new MockClient(searchConfig.client!.globals as ClientGlobals);
			const spy = jest.spyOn(client, 'search');
			const snap = new Snap(searchConfig, { client });

			const search = snap.controllers.search;
			expect(search).toBeDefined();

			await wait();

			expect(spy).toHaveBeenCalledTimes(0);
			expect(search.store.loading).toBe(false);
			expect(search.store.loaded).toBe(false);

			spy.mockClear();
		});

		it(`logs an error when targeter has invalid configuration`, async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-content',
									hideTarget: true,
									component: () => Component,
								},
							],
						},
					],
				},
			};

			const logger = new Logger();
			const spy = jest.spyOn(logger, 'error');

			const client = new MockClient(searchConfig.client!.globals as ClientGlobals);

			// valid config - no errors logged
			new Snap(searchConfig, { client, logger });
			expect(spy).toHaveBeenCalledTimes(0);

			// invalid config - logs error due to missing selector

			// @ts-ignore - deleting required property
			delete searchConfig.controllers.search[0].targeters[0].selector;
			delete window.searchspring.controller.search;
			new Snap(searchConfig, { client, logger });
			expect(spy).toHaveBeenCalledTimes(1);

			// invalid config - logs error due to missing component
			searchConfig.controllers.search[0].targeters[0].selector = '#searchspring-content';

			// @ts-ignore - deleting required property
			delete searchConfig.controllers.search[0].targeters[0].component;
			delete window.searchspring.controller.search;
			new Snap(searchConfig, { client, logger });
			expect(spy).toHaveBeenCalledTimes(2);

			spy.mockClear();
		});

		it(`runs the controller 'search' method when a targeter selector is found`, async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-content',
									hideTarget: true,
									component: () => {
										return Component;
									},
								},
							],
						},
					],
				},
			};

			const client = new MockClient(searchConfig.client!.globals as ClientGlobals);
			const spy = jest.spyOn(client, 'search');
			const snap = new Snap(searchConfig, { client });

			const search = snap.controllers.search;
			expect(search).toBeDefined();

			await waitFor(() => {
				expect(search.store.loaded).toBe(true);
			});

			expect(spy).toHaveBeenCalledTimes(1);
			expect(search.store.loading).toBe(false);
			expect(search.store.loaded).toBe(true);

			spy.mockClear();
		});

		it(`runs the onTarget function when a targeter selector is found`, async () => {
			const baseConfig = generateBaseConfig();
			const onTarget = jest.fn();

			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-content',
									hideTarget: true,
									onTarget,
									component: () => Component,
								},
							],
						},
					],
				},
			};

			const client = new MockClient(searchConfig.client!.globals as ClientGlobals);
			const snap = new Snap(searchConfig, { client });

			const search = snap.controllers.search;
			expect(search).toBeDefined();

			await wait();

			expect(onTarget).toHaveBeenCalledTimes(1);
		});

		it(`removes 'min-height' from target by default`, async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-content',
									hideTarget: true,
									component: () => {
										return Component;
									},
								},
							],
						},
					],
				},
			};

			let contentElem = document.querySelector('#searchspring-content');
			expect(contentElem).not.toBeNull();

			// initially element has a minHeight
			expect((contentElem as HTMLElement).style.minHeight).toBe('100vh');

			const client = new MockClient(searchConfig.client!.globals as ClientGlobals);
			const snap = new Snap(searchConfig, { client });

			// wait is needed due to promise usage (async)
			await wait(200);

			// after onTarget resolves element minHeight is removed
			expect((contentElem as HTMLElement).style.minHeight).toBe('');
		});

		it(`will render the component before the search resolves`, async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-content',
									hideTarget: true,
									component: () => {
										return Component;
									},
								},
							],
						},
					],
				},
			};

			const client = new MockClient(searchConfig.client!.globals as ClientGlobals, undefined, { delay: 50 });
			const snap = new Snap(searchConfig, { client });

			const search = await snap.getController('search');

			expect(search).not.toBeNull();
			expect(search.store.loaded).toBe(false);

			let injectedComponent = document.querySelector('.injectedComponent');
			expect(injectedComponent).toBeNull();

			await wait(50);

			expect(search.store.loaded).toBe(false);
			expect(search.store.loading).toBe(true);

			injectedComponent = document.querySelector('.injectedComponent');
			expect(injectedComponent).not.toBeNull();

			await wait(150);

			expect(search.store.loaded).toBe(true);
			expect(search.store.loading).toBe(false);
		});

		it(`can be configured to render the component after the search resolves using 'renderAfterSearch'`, async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									selector: '#searchspring-content',
									renderAfterSearch: true,
									hideTarget: true,
									component: () => {
										return Component;
									},
								},
							],
						},
					],
				},
			};

			const client = new MockClient(searchConfig.client!.globals as ClientGlobals, undefined, { delay: 50 });
			const snap = new Snap(searchConfig, { client });

			const search = await snap.getController('search');

			expect(search).not.toBeNull();
			expect(search.store.loaded).toBe(false);

			let injectedComponent = document.querySelector('.injectedComponent');
			expect(injectedComponent).toBeNull();

			await wait(50);

			expect(search.store.loaded).toBe(false);
			expect(search.store.loading).toBe(true);

			injectedComponent = document.querySelector('.injectedComponent');
			expect(injectedComponent).toBeNull();

			await wait(150);

			expect(search.store.loaded).toBe(true);
			expect(search.store.loading).toBe(false);

			await wait(50);

			injectedComponent = document.querySelector('.injectedComponent');
			expect(injectedComponent).not.toBeNull();
		});

		it(`runs the controller 'search' method when prefetch is set when selector not found`, async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
							targeters: [
								{
									prefetch: true,
									selector: '#searchspring-dne',
									hideTarget: true,
									component: () => {
										return Component;
									},
								},
							],
						},
					],
				},
			};

			const client = new MockClient(searchConfig.client!.globals as ClientGlobals);
			const spy = jest.spyOn(client, 'search');
			const snap = new Snap(searchConfig, { client });

			const search = snap.controllers.search;
			expect(search).toBeDefined();

			await wait();

			expect(spy).toHaveBeenCalledTimes(1);
			expect(search.store.loading).toBe(false);
			expect(search.store.loaded).toBe(true);

			spy.mockClear();
		});
	});

	describe('creates autocomplete controllers via config', () => {
		it(`can create an autocomplete controller`, async () => {
			const baseConfig = generateBaseConfig();
			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								id: 'ac',
								selector: '.ss-ac-input',
								settings: {
									initializeFromUrl: false,
								},
							},
						},
					],
				},
			};
			const snap = new Snap(acConfig);

			const autocomplete = await snap.getController('ac');
			expect(autocomplete.id).toBe('ac');
			expect(autocomplete.type).toBe('autocomplete');
			expect((autocomplete.config as AutocompleteControllerConfig).settings!.initializeFromUrl).toBe(false);

			// it has not searched and is not searching
			expect(autocomplete.store.loading).toBe(false);
			expect(autocomplete.store.loaded).toBe(false);
		});

		it(`can create multiple autocomplete controllers`, async () => {
			const baseConfig = generateBaseConfig();
			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input-one',
								id: 'acOne',
							},
						},
						{
							config: {
								selector: '.ss-ac-input-two',
								id: 'acTwo',
							},
						},
					],
				},
			};
			const snap = new Snap(acConfig);
			const [acOne, acTwo] = await snap.getControllers('acOne', 'acTwo');
			expect(acOne.id).toBe('acOne');
			expect(acOne.type).toBe('autocomplete');
			expect(acTwo.id).toBe('acTwo');
			expect(acTwo.type).toBe('autocomplete');
		});

		it(`logs an error when targeter has invalid configuration`, async () => {
			const baseConfig = generateBaseConfig();
			document.body.innerHTML = `<script id="searchspring-context"></script><input type="text" class="ss-ac-input"/>`;

			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input',
								id: 'ac',
							},
							targeters: [
								{
									selector: '.ss-ac-input',
									hideTarget: true,
									component: async () => Component,
								},
							],
						},
					],
				},
			};

			const client = new MockClient(acConfig.client!.globals as ClientGlobals);
			const logger = new Logger();
			const spy = jest.spyOn(logger, 'error');

			new Snap(acConfig, { client, logger });
			await wait();
			expect(spy).toHaveBeenCalledTimes(0);
			// @ts-ignore - deleting required property
			delete acConfig.controllers.autocomplete[0].targeters[0].selector;
			new Snap(acConfig, { client, logger });
			expect(spy).toHaveBeenCalledTimes(1);

			acConfig.controllers.autocomplete[0].targeters[0].selector = '#searchspring-content';
			// @ts-ignore - deleting required property
			delete acConfig.controllers.autocomplete[0].targeters[0].component;
			new Snap(acConfig, { client, logger });
			expect(spy).toHaveBeenCalledTimes(2);

			spy.mockClear();
		});

		it(`creates targeter provided in config`, async () => {
			const baseConfig = generateBaseConfig();
			document.body.innerHTML = `<script id="searchspring-context"></script><input type="text" class="ss-ac-input"/>`;

			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input',
								id: 'ac',
							},
							targeters: [
								{
									name: 'acTarget',
									selector: '.ss-ac-input',
									hideTarget: true,
									component: async () => Component,
								},
							],
						},
					],
				},
			};
			const client = new MockClient(acConfig.client!.globals as ClientGlobals);
			const snap = new Snap(acConfig, { client });
			const ac = await snap.getController('ac');
			await wait();
			expect(ac.id).toBe('ac');
			expect(ac.targeters.acTarget).toBeDefined();
			expect((ac.store as AutocompleteStore).state.input).toBeUndefined();
		});

		it(`runs the onTarget function when a targeter selector is found`, async () => {
			const baseConfig = generateBaseConfig();
			const onTarget = jest.fn();

			document.body.innerHTML = `<script id="searchspring-context"></script><input type="text" class="ss-ac-input"/>`;

			const acConfig = {
				...baseConfig,
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input',
								id: 'ac',
							},
							targeters: [
								{
									selector: '.ss-ac-input',
									hideTarget: true,
									component: async () => Component,
									onTarget,
								},
							],
						},
					],
				},
			};
			const client = new MockClient(acConfig.client!.globals as ClientGlobals);
			const snap = new Snap(acConfig, { client });
			await snap.getController('ac');
			await wait();
			expect(onTarget).toHaveBeenCalledTimes(1);
		});

		it(`sets integratedSpellCorrection feature flag`, async () => {
			const baseConfig = generateBaseConfig();

			document.body.innerHTML = `<script id="searchspring-context"></script><input type="text" class="ss-ac-input"/>`;

			const acConfig = {
				...baseConfig,
				features: {
					integratedSpellCorrection: {
						enabled: true,
					},
				},
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input',
								id: 'ac',
							},
							targeters: [
								{
									selector: '.ss-ac-input',
									hideTarget: true,
									component: async () => Component,
								},
							],
						},
					],
				},
			};
			const client = new MockClient(acConfig.client!.globals as ClientGlobals);
			const snap = new Snap(acConfig, { client });
			const ac = await snap.getController('ac');
			await wait();

			// @ts-ignore - private class variable
			expect(snap.config.client.config?.autocomplete?.requesters?.suggest?.globals?.integratedSpellCorrection).toBe(true);
			expect((ac.config as AutocompleteControllerConfig).settings!.integratedSpellCorrection).toBe(true);
			expect((ac.config as AutocompleteControllerConfig).globals!.search?.query?.spellCorrection).toBe(true);
		});

		it(`preserves controller integratedSpellCorrection setting when feature flag is set`, async () => {
			const baseConfig = generateBaseConfig();

			document.body.innerHTML = `<script id="searchspring-context"></script><input type="text" class="ss-ac-input"/>`;

			const acConfig = {
				...baseConfig,
				features: {
					integratedSpellCorrection: {
						enabled: true,
					},
				},
				controllers: {
					autocomplete: [
						{
							config: {
								selector: '.ss-ac-input',
								id: 'ac',
								settings: {
									integratedSpellCorrection: false,
								},
							},
							targeters: [
								{
									selector: '.ss-ac-input',
									hideTarget: true,
									component: async () => Component,
								},
							],
						},
					],
				},
			};
			const client = new MockClient(acConfig.client!.globals as ClientGlobals);
			const snap = new Snap(acConfig, { client });
			const ac = await snap.getController('ac');
			await wait();

			// @ts-ignore - private class variable
			expect(snap.config.client.config?.autocomplete?.requesters?.suggest?.globals?.integratedSpellCorrection).toBe(true);
			expect((ac.config as AutocompleteControllerConfig).settings!.integratedSpellCorrection).toBe(false);
			expect((ac.config as AutocompleteControllerConfig).globals!.search?.query?.spellCorrection).toBe(undefined);
		});
	});

	describe('creates finder controllers via config', () => {
		it(`can create a finder controller`, async () => {
			const baseConfig = generateBaseConfig();
			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finder',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
						},
					],
				},
			};
			const snap = new Snap(finderConfig);

			const finder = await snap.getController('finder');
			expect(finder.id).toBe('finder');
			expect(finder.type).toBe('finder');

			// it has not searched and is not searching
			expect(finder.store.loading).toBe(false);
			expect(finder.store.loaded).toBe(false);
		});

		it(`can create multiple finder controllers`, async () => {
			const baseConfig = generateBaseConfig();
			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finderOne',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
						},
						{
							config: {
								id: 'finderTwo',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
						},
					],
				},
			};
			const snap = new Snap(finderConfig);
			const [finderOne, finderTwo] = await snap.getControllers('finderOne', 'finderTwo');
			expect(finderOne.id).toBe('finderOne');
			expect(finderOne.type).toBe('finder');
			expect(finderTwo.id).toBe('finderTwo');
			expect(finderTwo.type).toBe('finder');
		});

		it(`logs an error when targeter has invalid configuration`, async () => {
			const baseConfig = generateBaseConfig();
			document.body.innerHTML = `<script id="searchspring-context"></script><div id="searchspring-finder-hierarchy"></div>`;

			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finder',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
							targeters: [
								{
									name: 'finder_hierarchy',
									selector: '#searchspring-finder-hierarchy',
									component: async () => Component,
								},
							],
						},
					],
				},
			};

			const client = new MockClient(finderConfig.client!.globals as ClientGlobals);
			const logger = new Logger();
			const spy = jest.spyOn(logger, 'error');

			new Snap(finderConfig, { client, logger });
			await wait();
			expect(spy).toHaveBeenCalledTimes(0);

			// @ts-ignore - deleting required property
			delete finderConfig.controllers.finder[0].targeters[0].selector;
			new Snap(finderConfig, { client, logger });
			await wait();
			expect(spy).toHaveBeenCalledTimes(1);

			finderConfig.controllers.finder[0].targeters[0].selector = '#searchspring-content';
			// @ts-ignore - deleting required property
			delete finderConfig.controllers.finder[0].targeters[0].component;
			new Snap(finderConfig, { client, logger });
			await wait();
			expect(spy).toHaveBeenCalledTimes(2);

			spy.mockClear();
		});

		it(`creates targeter provided in config`, async () => {
			const baseConfig = generateBaseConfig();
			document.body.innerHTML = `<script id="searchspring-context"></script><div id="searchspring-finder-hierarchy"></div>`;

			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finder',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
							targeters: [
								{
									name: 'finderTargeter',
									selector: '#searchspring-finder-hierarchy',
									component: async () => Component,
								},
							],
						},
					],
				},
			};

			const client = new MockClient(finderConfig.client!.globals as ClientGlobals);
			const snap = new Snap(finderConfig, { client });
			const finder = await snap.getController('finder');
			await wait();
			expect(finder.id).toBe('finder');
			expect(finder.targeters.finderTargeter).toBeDefined();
		});

		it(`runs the onTarget function when a targeter selector is found`, async () => {
			const baseConfig = generateBaseConfig();
			const onTarget = jest.fn();

			document.body.innerHTML = `<script id="searchspring-context"></script><div id="searchspring-finder-hierarchy"></div>`;

			const finderConfig = {
				...baseConfig,
				controllers: {
					finder: [
						{
							config: {
								id: 'finder',
								url: '/',
								fields: [
									{
										field: 'ss_category_hierarchy',
									},
								],
							},
							targeters: [
								{
									name: 'finderTargeter',
									selector: '#searchspring-finder-hierarchy',
									component: async () => Component,
									onTarget,
								},
							],
						},
					],
				},
			};

			const client = new MockClient(finderConfig.client!.globals as ClientGlobals);
			const snap = new Snap(finderConfig, { client });
			await snap.getController('finder');
			await wait();
			expect(onTarget).toHaveBeenCalledTimes(1);
		});
	});

	describe('creates recommendation controllers via config', () => {
		it(`can create a recommendation controller`, async () => {
			const baseConfig = generateBaseConfig();
			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecs',
								tag: 'trending',
							},
						},
					],
				},
			};
			const snap = new Snap(recommendationConfig);

			const finder = await snap.getController('trendingRecs');
			expect(finder.id).toBe('trendingRecs');
			expect(finder.type).toBe('recommendation');

			// it has not searched and is not searching
			expect(finder.store.loading).toBe(false);
			expect(finder.store.loaded).toBe(false);
		});

		it(`can create multiple recommendation controllers`, async () => {
			const baseConfig = generateBaseConfig();
			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecsOne',
								tag: 'trending',
							},
						},
						{
							config: {
								id: 'trendingRecsTwo',
								tag: 'trending',
							},
						},
					],
				},
			};
			const snap = new Snap(recommendationConfig);
			const [trendingRecsOne, trendingRecsTwo] = await snap.getControllers('trendingRecsOne', 'trendingRecsTwo');
			expect(trendingRecsOne.id).toBe('trendingRecsOne');
			expect(trendingRecsOne.type).toBe('recommendation');
			expect(trendingRecsTwo.id).toBe('trendingRecsTwo');
			expect(trendingRecsTwo.type).toBe('recommendation');
		});

		it(`logs an error when targeter has invalid configuration`, async () => {
			const baseConfig = generateBaseConfig();
			document.body.innerHTML = `<script id="searchspring-context"></script><div id="ss-trending-recs"></div>`;

			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecs',
								tag: 'trending',
							},
							targeters: [
								{
									name: 'recsTargeter',
									selector: '#ss-trending-recs',
									component: async () => Component,
								},
							],
						},
					],
				},
			};

			const client = new MockClient(recommendationConfig.client!.globals as ClientGlobals);
			const logger = new Logger();
			const spy = jest.spyOn(logger, 'error');

			new Snap(recommendationConfig, { client, logger });
			await wait();
			expect(spy).toHaveBeenCalledTimes(0);

			// @ts-ignore - deleting required property
			delete recommendationConfig.controllers.recommendation[0].targeters[0].selector;
			new Snap(recommendationConfig, { client, logger });
			expect(spy).toHaveBeenCalledTimes(1);

			recommendationConfig.controllers.recommendation[0].targeters[0].selector = '#ss-trending-recs';
			// @ts-ignore - deleting required property
			delete recommendationConfig.controllers.recommendation[0].targeters[0].component;
			new Snap(recommendationConfig, { client, logger });
			expect(spy).toHaveBeenCalledTimes(2);

			spy.mockClear();
		});

		it(`creates targeter provided in config`, async () => {
			const baseConfig = generateBaseConfig();
			document.body.innerHTML = `<script id="searchspring-context"></script><div id="ss-trending-recs"></div>`;

			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecs',
								tag: 'trending',
							},
							targeters: [
								{
									name: 'recsTargeter',
									selector: '#ss-trending-recs',
									component: async () => Component,
								},
							],
						},
					],
				},
			};
			const client = new MockClient(recommendationConfig.client!.globals as ClientGlobals);
			const snap = new Snap(recommendationConfig, { client });
			const recommendation = await snap.getController('trendingRecs');
			await wait();
			expect(recommendation.id).toBe('trendingRecs');
			expect(recommendation.targeters.recsTargeter).toBeDefined();
		});

		it(`runs the onTarget function when a targeter selector is found`, async () => {
			const baseConfig = generateBaseConfig();
			const onTarget = jest.fn();

			document.body.innerHTML = `<script id="searchspring-context"></script><div id="ss-trending-recs"></div>`;

			const recommendationConfig = {
				...baseConfig,
				controllers: {
					recommendation: [
						{
							config: {
								id: 'trendingRecs',
								tag: 'trending',
							},
							targeters: [
								{
									name: 'recsTargeter',
									selector: '#ss-trending-recs',
									component: async () => Component,
									onTarget,
								},
							],
						},
					],
				},
			};
			const client = new MockClient(recommendationConfig.client!.globals as ClientGlobals);
			const snap = new Snap(recommendationConfig, { client });
			await snap.getController('trendingRecs');
			await wait();
			expect(onTarget).toHaveBeenCalledTimes(1);
		});
	});

	describe('creates eventManager', () => {
		it('creates eventManager on snap instance and adds functions to window', () => {
			const baseConfig = generateBaseConfig();
			const snap = new Snap(baseConfig);

			expect(snap.eventManager).toBeDefined();
			expect(snap.eventManager.events).toBeDefined();
			expect(snap.eventManager.fire).toBeDefined();
			expect(snap.eventManager.on).toBeDefined();

			expect(window.searchspring.on).toBeDefined();
			expect(window.searchspring.fire).toBeDefined();

			const func = jest.fn();

			const data = { test: true };
			snap.eventManager.on('testEvent', (data) => func(data));

			expect(func).not.toHaveBeenCalled();

			snap.eventManager.fire('testEvent', data);

			expect(func).toHaveBeenCalledWith(data);
		});
	});

	describe(`the 'getInstantiator' method`, () => {
		it('rejects if requested instantiator does not exist', async () => {
			const baseConfig = generateBaseConfig();
			const snap = new Snap(baseConfig);

			await expect(async () => {
				await snap.getInstantiator('recommendation');
			}).rejects.toBe(`getInstantiator could not find instantiator with id: recommendation`);
		});

		it('returns an instantiator when the requested id exists', async () => {
			const baseConfig = generateBaseConfig();
			const instantiatorConfig = {
				...baseConfig,
				instantiators: {
					recommendation: {
						components: {
							thing: () => Component,
						},
						config: {
							branch: 'production',
						},
					},
				},
			};

			const snap = new Snap(instantiatorConfig);

			const instantiator = await snap.getInstantiator('recommendation');
			expect(instantiator).toBeDefined();
			expect(instantiator.config.config.branch).toBe('production');
		});
	});

	describe(`the 'getController(s)' method`, () => {
		it('rejects if requested controller does not exist', async () => {
			const baseConfig = generateBaseConfig();
			const snap = new Snap(baseConfig);

			await expect(async () => {
				await snap.getController('search');
			}).rejects.toBe(`getController could not find controller with id: search`);
		});

		it('returns a controller with the requested id when it exists', async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'search',
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			const search = await snap.getController('search');
			expect(search).toBeDefined();
			expect(search.id).toBe('search');
		});

		it('rejects if requested controller does not exist', async () => {
			const baseConfig = generateBaseConfig();
			const snap = new Snap(baseConfig);

			await expect(async () => {
				await snap.getControllers('searchOne', 'searchTwo');
			}).rejects.toBe(`getController could not find controller with id: searchOne`);
		});

		it('rejects if requested controller does not exist', async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'searchOne',
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			await expect(async () => {
				await snap.getControllers('searchOne', 'searchTwo');
			}).rejects.toBe(`getController could not find controller with id: searchTwo`);
		});

		it('returns controllers with the requested ids when they exists', async () => {
			const baseConfig = generateBaseConfig();
			const searchConfig = {
				...baseConfig,
				controllers: {
					search: [
						{
							config: {
								id: 'searchOne',
							},
						},
						{
							config: {
								id: 'searchTwo',
							},
						},
					],
				},
			};
			const snap = new Snap(searchConfig);

			const [searchOne, searchTwo] = await snap.getControllers('searchOne', 'searchTwo');
			expect(searchOne).toBeDefined();
			expect(searchOne.id).toBe('searchOne');
			expect(searchTwo).toBeDefined();
			expect(searchTwo.id).toBe('searchTwo');
		});
	});

	describe(`the 'createController' method`, () => {
		it('can create a search controller', async () => {
			const baseConfig = generateBaseConfig();
			const snap = new Snap(baseConfig);
			const searchConfig = {
				id: 's',
			};

			const search = await snap.createController('search', searchConfig);
			expect(search.id).toBe(searchConfig.id);
			expect(search.type).toBe('search');
		});

		it('can create an autocomplete controller', async () => {
			const baseConfig = generateBaseConfig();
			const snap = new Snap(baseConfig);
			const autocompleteConfig = {
				id: 'ac',
			};

			const autocomplete = await snap.createController('autocomplete', autocompleteConfig);
			expect(autocomplete.id).toBe(autocompleteConfig.id);
			expect(autocomplete.type).toBe('autocomplete');
		});

		it('can create a finder controller', async () => {
			const baseConfig = generateBaseConfig();
			const snap = new Snap(baseConfig);
			const finderConfig = {
				id: 'f',
			};

			const finder = await snap.createController('finder', finderConfig);
			expect(finder.id).toBe(finderConfig.id);
			expect(finder.type).toBe('finder');
		});

		it('can create a recommendation controller', async () => {
			const baseConfig = generateBaseConfig();
			const snap = new Snap(baseConfig);
			const recommendationConfig = {
				tag: 'profile',
				id: 'rec',
			};

			const recommendation = await snap.createController('recommendation', recommendationConfig);
			expect(recommendation.id).toBe(recommendationConfig.id);
			expect(recommendation.type).toBe('recommendation');
		});

		it('executes an optional callback function when creating a controller', async () => {
			const baseConfig = generateBaseConfig();
			const snap = new Snap(baseConfig);
			const searchConfig = {
				id: 's',
			};

			const callback = jest.fn();
			const search = await snap.createController('search', searchConfig, undefined, undefined, undefined, callback);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(callback).toHaveBeenCalledWith(search);
		});
	});
});
