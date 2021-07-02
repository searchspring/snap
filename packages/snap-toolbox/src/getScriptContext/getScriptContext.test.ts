import { getScriptContext } from './getScriptContext';

describe('getScriptContext', () => {
	it('expects a script tag as the first parameter', () => {
		const scriptTag = document.createElement('div');

		expect(() => {
			getScriptContext(scriptTag);
		}).toThrow();
	});

	it('expects an array of strings as the second parameter', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');

		expect(() => {
			// @ts-ignore
			getScriptContext(scriptTag, 'options');
		}).toThrow();

		expect(() => {
			// @ts-ignore
			getScriptContext(scriptTag, [1, 2, 3]);
		}).toThrow();

		expect(() => {
			// @ts-ignore
			getScriptContext(scriptTag, ['thing', 2, { one: 1 }]);
		}).toThrow();

		expect(() => {
			getScriptContext(scriptTag, ['options']);
		}).not.toThrow();
	});

	it('expects the script to have "searchspring" prefix in the type attribute', () => {
		expect(() => {
			const scriptTag = document.createElement('script');

			getScriptContext(scriptTag);
		}).toThrow();

		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.setAttribute('type', 'notsearchspring');

			getScriptContext(scriptTag);
		}).toThrow();

		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.setAttribute('type', 'searchspring');

			getScriptContext(scriptTag);
		}).not.toThrow();

		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.setAttribute('type', 'searchspring/recommend');

			getScriptContext(scriptTag);
		}).not.toThrow();
	});

	it('returns an object of variables containing all attributes', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.setAttribute('profile', 'trending');

		const vars = getScriptContext(scriptTag);

		expect(vars).toHaveProperty('type', 'searchspring/recommend');
		expect(vars).toHaveProperty('profile', 'trending');
	});

	it('returns an object of variables containing all attributes', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.setAttribute('profile', 'trending');

		const vars = getScriptContext(scriptTag);

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

		const vars = getScriptContext(scriptTag, ['siteId']);
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

		const vars = getScriptContext(scriptTag, ['func', 'options']);
		expect(vars.func()).toBe('returned value');
		expect(vars).toHaveProperty('options');
		expect(vars.options).toStrictEqual({
			siteId: 'abc123',
			categories: ['righteous', 'awesome', 'radical'],
		});
	});
});
