import { getContext } from './getContext';

describe('getContext', () => {
	beforeEach(() => (document.body.innerHTML = ''));

	it('expects a script tag as the second parameter', () => {
		const divTag = document.createElement('div');

		// invalid param that should throw
		expect(() => {
			// @ts-ignore
			getContext([], divTag);
		}).toThrow();

		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		// invalid param that should throw
		expect(() => {
			// @ts-ignore
			getContext([], scriptTag);
		}).not.toThrow();
	});

	it('expects an array of strings as the first parameter', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');

		// invalid param that should throw
		expect(() => {
			// @ts-ignore
			getContext('options', scriptTag);
		}).toThrow();

		// invalid param that should throw
		expect(() => {
			// @ts-ignore
			getContext([1, 2, 3], scriptTag);
		}).toThrow();

		// invalid param that should throw
		expect(() => {
			// @ts-ignore
			getContext(['thing', 2, { one: 1 }], scriptTag);
		}).toThrow();

		// invalid param that should throw
		expect(() => {
			getContext(['options'], scriptTag);
		}).not.toThrow();
	});

	it(`automatically finds script in document when it has an 'id' that starts with "searchspring"`, () => {
		expect(() => {
			const id = 'searchspring-variables';
			const scriptTag = document.createElement('script');
			scriptTag.id = id;

			document.body.appendChild(scriptTag);

			const context = getContext([]);
			expect(context).toHaveProperty('id', id);
		}).not.toThrow();
	});

	it(`automatically finds script in document when it has a 'src' that matches "snapui.searchspring.io"`, () => {
		expect(() => {
			const src = 'https://snapui.searchspring.io/y56s6x/test/bundle.js';
			const scriptTag = document.createElement('script');
			scriptTag.src = src;

			document.body.appendChild(scriptTag);

			const context = getContext([]);
			expect(context).toHaveProperty('src', src);
		}).not.toThrow();
	});

	it('when multiple possible context scripts are found automatically, it uses the one with innerHTML', () => {
		const id = 'searchspring-context';
		const shopperObject = {
			id: 'snaptest',
		};

		const snapScriptTestTag = document.createElement('script');
		snapScriptTestTag.src = 'https://snapui.searchspring.io/y56s6x/test/bundle.js';
		document.body.appendChild(snapScriptTestTag);

		const scriptTag = document.createElement('script');
		scriptTag.id = id;
		scriptTag.innerHTML = `
			shopper = ${JSON.stringify(shopperObject)};
		`;
		document.body.appendChild(scriptTag);

		const snapScriptTag = document.createElement('script');
		snapScriptTag.src = 'https://snapui.searchspring.io/y56s6x/bundle.js';
		document.body.appendChild(snapScriptTag);

		const context = getContext(['shopper']);
		expect(context.shopper).toStrictEqual(shopperObject);
	});

	it('expects the script to have "searchspring" prefix in the id or type attribute', () => {
		expect(() => {
			const scriptTag = document.createElement('script');

			getContext([], scriptTag);
		}).toThrow();

		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.id = 'search';

			getContext([], scriptTag);
		}).toThrow();

		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.id = 'searchspring';

			getContext([], scriptTag);
		}).not.toThrow();

		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.id = 'searchspring-context';

			getContext([], scriptTag);
		}).not.toThrow();

		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.setAttribute('type', 'notsearchspring');

			getContext([], scriptTag);
		}).toThrow();

		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.setAttribute('type', 'searchspring');

			getContext([], scriptTag);
		}).not.toThrow();

		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.setAttribute('type', 'searchspring/recommend');

			getContext([], scriptTag);
		}).not.toThrow();
	});

	it('returns an object of variables containing all attributes', () => {
		const scriptTag = document.createElement('script');
		scriptTag.id = 'searchspring-context';
		scriptTag.setAttribute('profile', 'trending');

		const vars = getContext([], scriptTag);

		expect(vars).toHaveProperty('id', 'searchspring-context');
		expect(vars).toHaveProperty('profile', 'trending');
	});

	it('returns an object of variables containing all attributes', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.setAttribute('profile', 'trending');

		const vars = getContext([], scriptTag);

		expect(vars).toHaveProperty('type', 'searchspring/recommend');
		expect(vars).toHaveProperty('profile', 'trending');
	});

	it('can be told which variables to evaluate returns an object containing those variables', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.innerHTML = `
			siteId = 'abc123';
			shopperId = 'snap';
		`;

		const vars = getContext(['siteId'], scriptTag);
		expect(vars).toHaveProperty('type', 'searchspring/recommend');
		expect(vars).toHaveProperty('siteId', 'abc123');
		expect(vars).not.toHaveProperty('shopperId', 'snap');
	});

	it('supports evaluation of all valid javascript', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.innerHTML = `
			func = () => 'returned value';
			options = {
				siteId: 'abc123',
				categories: ['righteous', 'awesome', 'radical']
			};
		`;

		const vars = getContext(['func', 'options'], scriptTag);
		expect(vars.func()).toBe('returned value');
		expect(vars).toHaveProperty('options');
		expect(vars.options).toStrictEqual({
			siteId: 'abc123',
			categories: ['righteous', 'awesome', 'radical'],
		});
	});

	it('supports evaluation of all valid javascript', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.innerHTML = `
			error = window.dne.property
		`;

		expect(() => {
			getContext(['error'], scriptTag);
		}).toThrow();
	});
});
