import { h } from 'preact';

import '@testing-library/jest-dom/extend-expect';
import { cleanup, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { cookies } from '@searchspring/snap-toolbox';

import { Snap, SnapConfig, BRANCH_COOKIE, DEV_COOKIE } from './Snap';

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

const modifiedDate = '07 Jan 2022 22:42:39 GMT';

jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock as XMLHttpRequest);

describe('Snap Preact Integration', () => {
	beforeAll(() => {
		xhrMock.getResponseHeader = jest.fn(() => {
			// return "Last-Modified" date
			return `Fri, ${modifiedDate}`;
		});
	});

	beforeEach(() => {
		// @ts-ignore - modifying window
		delete window.location;

		// @ts-ignore - modifying window
		window.location = {
			href: 'https://www.merch.com?branch=branch',
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
});
