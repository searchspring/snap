import { getContext } from './getContext';

describe('getContext', () => {
	beforeAll(() => {
		// used to test global variable assignment in evaluation
		const globalScriptTag = document.createElement('script');
		globalScriptTag.innerHTML = 'const globalVar = "constant";';

		document.head.append(globalScriptTag);
	});

	beforeEach(() => {
		document.body.innerHTML = '';
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

		// empty array should not throw
		expect(() => {
			getContext([], scriptTag);
		}).not.toThrow();
	});

	it('expects a script tag as the second parameter if provided', () => {
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

	it(`automatically finds script in document when it has an 'id' that starts with "searchspring"`, () => {
		expect(() => {
			const id = 'searchspring-variables';
			const scriptTag = document.createElement('script');
			scriptTag.id = id;

			document.body.appendChild(scriptTag);

			const context = getContext();
			expect(context).toStrictEqual({});
		}).not.toThrow();
	});

	it(`automatically finds script in document when it has a 'src' that matches "snapui.searchspring.io"`, () => {
		const siteId = 'y56s6x';
		expect(() => {
			const src = `https://snapui.searchspring.io/${siteId}/test/bundle.js`;
			const scriptTag = document.createElement('script');
			scriptTag.src = src;

			document.body.appendChild(scriptTag);

			const context = getContext();
			expect(context).toStrictEqual({});
		}).not.toThrow();
	});

	it(`returns src siteId over if siteID is not set as a context variable`, () => {
		const siteId = 'y56s6x';
		expect(() => {
			const src = `https://snapui.searchspring.io/${siteId}/test/bundle.js`;
			const scriptTag = document.createElement('script');
			scriptTag.src = src;

			document.body.appendChild(scriptTag);

			const context = getContext(['siteId']);
			expect(context).toStrictEqual({ siteId: siteId });
		}).not.toThrow();
	});

	it(`returns context siteId over src siteID`, () => {
		const siteId = 'y56s6x';
		const otherSiteId = 'test12';
		expect(() => {
			const src = `https://snapui.searchspring.io/${siteId}/test/bundle.js`;
			const scriptTag = document.createElement('script');
			scriptTag.src = src;
			scriptTag.innerHTML = `
				siteId = ${JSON.stringify(otherSiteId)};
			`;
			document.body.appendChild(scriptTag);

			const context = getContext(['siteId']);
			expect(context).toStrictEqual({ siteId: otherSiteId });
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

	it('can get context from script attributes if requested', () => {
		const scriptTag = document.createElement('script');
		scriptTag.id = 'searchspring-context';
		scriptTag.setAttribute('profile', 'trending');

		const vars = getContext(['id', 'profile'], scriptTag);

		expect(vars).toHaveProperty('id', 'searchspring-context');
		expect(vars).toHaveProperty('profile', 'trending');
	});

	it('only gets attributes from the script that are part of the requested variables', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.setAttribute('id', 'searchspring-recommend');
		scriptTag.innerHTML = `
			siteId = 'abc123';
			shopperId = 'snap';
		`;

		const vars = getContext(['siteId'], scriptTag);
		expect(vars).toHaveProperty('siteId', 'abc123');
		expect(vars).not.toHaveProperty('type', 'searchspring/recommend');
		expect(vars).not.toHaveProperty('id', 'searchspring-recommend');
		expect(vars).not.toHaveProperty('shopperId', 'snap');
	});

	it('can be told which variables to evaluate returns an object containing those variables', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.setAttribute('id', 'searchspring-recommend');
		scriptTag.innerHTML = `
			siteId = 'abc123';
			shopperId = 'snap';
		`;

		const vars = getContext(['siteId', 'shopperId', 'type', 'id'], scriptTag);
		expect(vars).toHaveProperty('siteId', 'abc123');
		expect(vars).toHaveProperty('shopperId', 'snap');
		expect(vars).toHaveProperty('type', 'searchspring/recommend');
		expect(vars).toHaveProperty('id', 'searchspring-recommend');
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

	it('supports evaluation of all valid javascript - errors will not throw but will be undefined', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.innerHTML = `
			error = window.dne.property
		`;

		let vars: { [key: string]: any } = {};
		expect(() => {
			vars = getContext(['error'], scriptTag);
		}).not.toThrow();
		expect(vars?.error).toBeUndefined();
	});

	it('does not throw an error when variables exist already, but are not in evaluation list', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.setAttribute('id', 'searchspring-recommend');
		scriptTag.innerHTML = `
			siteId = 'abc123';
			globalVar = 'snap';
		`;

		expect(() => {
			getContext(['error'], scriptTag);
		}).not.toThrow();
	});

	it('does not attempt to evaluate variable assignments when they are within quotes', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring/recommend');
		scriptTag.setAttribute('id', 'searchspring-recommend');
		scriptTag.innerHTML = 'format = "<span class=money>${{amount}}</span>";';

		expect(() => {
			const vars = getContext(['format'], scriptTag);

			expect(vars).toHaveProperty('format', '<span class=money>${{amount}}</span>');
		}).not.toThrow();
	});

	it('throws an error when JavaScript keywords are provided in the evaluate array', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');

		// invalid param that should throw
		expect(() => {
			getContext(['class'], scriptTag);
		}).toThrow('getContext: JavaScript keywords are not allowed in evaluate array');

		expect(() => {
			getContext(['const'], scriptTag);
		}).toThrow('getContext: JavaScript keywords are not allowed in evaluate array');

		expect(() => {
			getContext(['if'], scriptTag);
		}).toThrow('getContext: JavaScript keywords are not allowed in evaluate array');
	});

	it('throws an error when JavaScript keywords are found in script inner variables', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			class = "should-not-evaluate";
			const = "should-not-evaluate";
			if = "should-not-evaluate";
			validVar = "should-evaluate";
		`;

		expect(() => {
			getContext(['validVar'], scriptTag);
		}).toThrow('getContext: JavaScript keywords cannot be used as variable names in script');
	});
});

describe('variable name parsing', () => {
	it('correctly identifies variable names when quotes are present', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			realVar = "something = 123";
			anotherVar = 'test = value';
			actualValue = 456;
		`;

		const vars = getContext(['realVar', 'anotherVar', 'actualValue', 'something', 'test'], scriptTag);
		expect(Object.keys(vars)).toHaveLength(3);
		expect(vars).toHaveProperty('realVar', 'something = 123');
		expect(vars).toHaveProperty('anotherVar', 'test = value');
		expect(vars).toHaveProperty('actualValue', 456);
		expect(vars).not.toHaveProperty('something');
		expect(vars).not.toHaveProperty('test');
	});

	it('handles template literals correctly', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			template = \`
				<div>
					\${value}
					\${name}
				</div>
			\`;
			actual = "real value";
		`;

		const vars = getContext(['template', 'actual', 'value', 'name'], scriptTag);
		expect(Object.keys(vars)).toHaveLength(2);
		expect(vars).toHaveProperty('template');
		expect(vars).toHaveProperty('actual', 'real value');
	});

	it('handles HTML attributes that look like assignments', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			html = '<div class="test" data-value="something = 123"></div>';
			value = 'real value';
		`;

		const vars = getContext(['html', 'value'], scriptTag);
		expect(Object.keys(vars)).toHaveLength(2);
		expect(vars).toHaveProperty('html');
		expect(vars).toHaveProperty('value', 'real value');
	});

	it('handles nested quotes correctly', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			config = "{ \\"nested = value\\": true }";
			actual = 123;
		`;

		const vars = getContext(['config', 'actual', 'nested'], scriptTag);
		expect(Object.keys(vars)).toHaveLength(2);
		expect(vars).toHaveProperty('config');
		expect(vars).toHaveProperty('actual', 123);
		expect(vars).not.toHaveProperty('nested');
	});
});

describe('javascript keywords', () => {
	it('filters out javascript keywords from evaluation', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			class = "should-not-evaluate";
			const = "should-not-evaluate";
			if = "should-not-evaluate";
			validVar = "should-evaluate";
		`;

		expect(() => {
			const vars = getContext(['class', 'const', 'if', 'validVar'], scriptTag);
		}).toThrow('getContext: JavaScript keywords are not allowed in evaluate array');
	});

	it('allows javascript keywords in object properties and string values', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			config = {
				class: "my-class",
				const: "my-const",
				if: true
			};
		`;

		const vars = getContext(['config'], scriptTag);
		expect(vars).toHaveProperty('config');
		expect(vars.config).toEqual({
			class: 'my-class',
			const: 'my-const',
			if: true,
		});
	});
});
