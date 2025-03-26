import { h } from 'preact';
import 'whatwg-fetch';
import '@testing-library/jest-dom';
import { cleanup, waitFor } from '@testing-library/preact';

import { cookies } from '@searchspring/snap-toolbox';

import { Snap, SnapConfig, DEV_COOKIE, BRANCH_PARAM, BRANCH_COOKIE } from './Snap';
import { SHOPIFY_WEBPIXEL_STORAGE_KEY } from './configureSnapFeatures';

const baseConfig: SnapConfig = {
	client: {
		globals: {
			siteId: 'xxxxxx',
		},
	},
};
const context = {
	config: {},
	shopper: {
		id: 'snapdev',
	},
};

const xhrMock: Partial<XMLHttpRequest> = {
	DONE: 4,
	open: jest.fn(),
	send: jest.fn(),
	setRequestHeader: jest.fn(),
	status: 200,
	readyState: 4,
};

const MODIFIED_DATE = '07 Jan 2022 22:42:39 GMT';

// mock xhr so network requests do not occur
jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock as XMLHttpRequest);

// mocks fetch so beacon client does not make network requests
jest.spyOn(global.window, 'fetch').mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

describe('Snap Preact Integration', () => {
	beforeAll(() => {
		xhrMock.getResponseHeader = jest.fn(() => {
			// return "Last-Modified" date
			return `Fri, ${MODIFIED_DATE}`;
		});
	});

	beforeEach(() => {
		// @ts-ignore - modifying window
		delete window.location;

		// @ts-ignore - modifying window
		window.location = {
			href: 'https://www.merch.com',
		};

		const contextString = `config = ${JSON.stringify(context.config)}; shopper = ${JSON.stringify(context.shopper)};`;
		document.body.innerHTML = `<script id="searchspring-context">${contextString}</script>`;
	});

	afterEach(cleanup);

	afterAll(() => jest.clearAllMocks);

	it(`has a default mode of 'production'`, () => {
		const snap = new Snap(baseConfig);

		// @ts-ignore - accessing private property
		expect(snap.mode).toBe('production');
		// @ts-ignore - accessing private property
		expect(snap.client.mode).toBe('production');
	});

	it(`automatically grabs context from #searchspring-context using 'getContext'`, () => {
		const snap = new Snap(baseConfig);

		expect(snap.context).toStrictEqual(context);
	});

	it(`merges context from #searchspring-context with context in the config and the context takes priority`, () => {
		const contextConfig = {
			...baseConfig,
			context: {
				shopper: {
					id: 'snapper',
				},
				category: 'something',
			},
		};
		const snap = new Snap(contextConfig);

		expect(snap.context).toStrictEqual({ ...context, category: 'something' });
	});

	it(`can use the 'config' in a script context to set context`, () => {
		const config = {
			context: {
				category: 'something',
			},
		};

		const contextString = `config = ${JSON.stringify(config)}; shopper = ${JSON.stringify(context.shopper)};`;
		document.body.innerHTML = `<script id="searchspring-context">${contextString}</script>`;

		const snap = new Snap(baseConfig);

		expect(snap.context).toStrictEqual({ ...context, config: config, category: 'something' });
	});

	it(`can use the 'config' in a script context to set siteId`, () => {
		const config = {
			client: {
				globals: {
					siteId: 'yyyyyy',
				},
			},
		};

		const contextString = `config = ${JSON.stringify(config)}; shopper = ${JSON.stringify(context.shopper)};`;
		document.body.innerHTML = `<script id="searchspring-context">${contextString}</script>`;

		const snap = new Snap(baseConfig);

		expect(snap.context).toStrictEqual({ ...context, config: config });
		// @ts-ignore - verifying globals using context set siteId
		expect(snap.client.globals.siteId).toBe(config.client.globals.siteId);
	});

	it(`takes the dev param from the URL and sets the mode`, async () => {
		// @ts-ignore
		window.location = {
			href: 'https://www.merch.com?dev',
		};

		const productionConfig: SnapConfig = {
			...baseConfig,
			mode: 'production',
		};

		const snap = new Snap(productionConfig);

		// @ts-ignore - accessing private property
		expect(snap.mode).toBe('development');
		// @ts-ignore - accessing private property
		expect(snap.client.mode).toBe('development');

		const devCookie = cookies.get(DEV_COOKIE);
		expect(devCookie).toBe('1');
		cookies.unset(DEV_COOKIE);
	});

	it(`takes the dev param from the URL and sets the mode (production)`, async () => {
		// @ts-ignore
		window.location = {
			href: 'https://www.merch.com?dev=false',
		};

		const snap = new Snap(baseConfig);

		// @ts-ignore - accessing private property
		expect(snap.mode).toBe('production');
		// @ts-ignore - accessing private property
		expect(snap.client.mode).toBe('production');

		const devCookie = cookies.get(DEV_COOKIE);
		expect(devCookie).toBeFalsy();
		cookies.unset(DEV_COOKIE);
	});

	it(`takes the ss_attribution param from the URL and sets the Beacon context`, async () => {
		const key = 'ssAttribution';

		// nothing in storage initially
		// @ts-ignore
		window.location = {
			href: 'https://www.merch.com',
		};
		const snap1 = new Snap(baseConfig);

		expect(snap1.tracker.getContext().attribution).toBeUndefined();

		// should add attribution to storage from url
		// @ts-ignore
		window.location = {
			href: 'https://www.merch.com?ss_attribution=email:emailTag',
		};
		const snap2 = new Snap(baseConfig);
		expect(snap2.tracker.getContext().attribution).toStrictEqual([{ type: 'email', id: 'emailTag' }]);

		// remove attribution query param, but ensure that sessionStorage value still set
		// @ts-ignore
		window.location = {
			href: 'https://www.merch.com',
		};
		const snap3 = new Snap(baseConfig);
		expect(snap3.tracker.getContext().attribution).toStrictEqual([{ type: 'email', id: 'emailTag' }]);

		// change attribution to email:differentEmailTag
		// @ts-ignore
		window.location = {
			href: 'https://www.merch.com?ss_attribution=email:differentEmailTag',
		};
		const snap4 = new Snap(baseConfig);
		expect(snap4.tracker.getContext().attribution).toStrictEqual([
			{ type: 'email', id: 'differentEmailTag' },
			{ type: 'email', id: 'emailTag' },
		]);
	});

	it(`will throw an error when a branch override is in found`, async () => {
		const branchName = 'branch';

		// @ts-ignore
		window.location = {
			href: `https://www.merch.com?${BRANCH_PARAM}=${branchName}`,
		};

		expect(() => {
			new Snap(baseConfig);
		}).toThrow();

		// wait for rendering of BranchOverride component
		await waitFor(() => {
			const overrideElement = document.querySelector('.ss__branch-override')!;
			expect(overrideElement).toBeDefined();
		});

		// clean up
		cookies.unset(BRANCH_COOKIE);
		cookies.unset(DEV_COOKIE);
	});

	it(`will register doNotTrack with the tracker when ssWebPixel storage is found`, async () => {
		// set up
		const mockStorage: {
			[key: string]: string;
		} = {};
		global.Storage.prototype.setItem = jest.fn((key, value) => {
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);

		// stringified web pixel identifier
		global.Storage.prototype.setItem(SHOPIFY_WEBPIXEL_STORAGE_KEY, '{"enabled":true,"siteId":"abc123","version":"0.1.1"}');
		// end set up

		const snap = new Snap(baseConfig);
		// @ts-ignore private
		expect(snap.config.tracker?.config?.doNotTrack).toBeDefined();
		// @ts-ignore private
		expect(snap.config.tracker?.config?.doNotTrack).toHaveLength(3);

		// @ts-ignore private
		expect(snap.tracker.doNotTrack).toStrictEqual(['product.view', 'cart.view', 'order.transaction']);

		// clean up
		// return our mocks to their original values
		// 🚨 THIS IS VERY IMPORTANT to avoid polluting future tests!
		// @ts-ignore
		global.Storage.prototype.setItem.mockRestore();
		// @ts-ignore
		global.Storage.prototype.getItem.mockRestore();
	});
});
