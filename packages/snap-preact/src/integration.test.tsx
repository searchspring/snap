import { h } from 'preact';

import '@testing-library/jest-dom/extend-expect';
import { waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Snap, BRANCH_COOKIE } from './Snap';

const baseConfig = {
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

		delete window.location;

		// @ts-ignore
		window.location = {
			href: 'https://www.merch.com?branch=branch',
		};
	});

	beforeEach(() => {
		const contextString = `config = ${JSON.stringify(context.config)}; shopper = ${JSON.stringify(context.shopper)};`;
		document.body.innerHTML = `<script id="searchspring-context">${contextString}</script>`;
	});

	afterAll(() => jest.clearAllMocks);

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

	it(`takes the branch param from the URL and add a new script block`, async () => {
		const url = 'https://snapui.searchspring.io/xxxxxx/branch/bundle.js';

		// handle mock XHR of bundle file
		expect(xhrMock.open).toBeCalledWith('HEAD', url, true);

		// wait for rendering of new script block
		await waitFor(() => {
			const overrideElement = document.querySelector(`script[${BRANCH_COOKIE}]`);
			expect(overrideElement).toBeInTheDocument();
			expect(overrideElement).toHaveAttribute('src', url);
		});
	});
});
