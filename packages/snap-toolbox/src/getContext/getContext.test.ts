import { getContext } from './getContext';

describe('getContext', () => {
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
});
