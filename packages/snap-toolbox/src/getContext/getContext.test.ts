import { getContext } from './getContext';

describe('getContext', () => {
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

	it('expects getContent to throw error if no script is provided and no id or type attribute', () => {
		expect(() => {
			const scriptTag = document.createElement('script');
			document.body.appendChild(scriptTag);

			getContext([]);
		}).toThrow();
	});

	it('expects getContent to not throw error if no script is provided and id attribute exists', () => {
		expect(() => {
			const scriptTag = document.createElement('script');
			scriptTag.id = 'searchspring-context';
			document.body.appendChild(scriptTag);

			getContext([]);
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

	it('logs an error when there is invalid syntax in the script context', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			valid = 'valid';
			invalid = syntax error;
		`;

		const consoleError = jest.spyOn(console, 'error');

		expect(() => {
			const context = getContext(['valid', 'invalid'], scriptTag);
			expect(consoleError).toHaveBeenCalledWith("getContext: error evaluating 'valid'");
			expect(consoleError).toHaveBeenCalledWith("getContext: error evaluating 'invalid'");
			expect(context).toStrictEqual({});
		}).not.toThrow();

		consoleError.mockRestore();
	});

	it('does not throw an error when keywords are provided in the evaluate array, but logs an error', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');

		const consoleError = jest.spyOn(console, 'error');

		expect(() => {
			// invalid param that should generate an error - `getContext: JavaScript keyword found: '${item}'! Please use a different variable name.`
			getContext(['class', 'const', 'if', 'valid'], scriptTag);
			expect(consoleError).toHaveBeenCalledWith("getContext: JavaScript keyword found: 'class'! Please use a different variable name.");
			expect(consoleError).toHaveBeenCalledWith("getContext: JavaScript keyword found: 'const'! Please use a different variable name.");
			expect(consoleError).toHaveBeenCalledWith("getContext: JavaScript keyword found: 'if'! Please use a different variable name.");
			expect(consoleError).not.toHaveBeenCalledWith("getContext: JavaScript keyword found: 'valid'! Please use a different variable name.");

			expect(consoleError).toHaveBeenCalledTimes(3);
		}).not.toThrow();

		consoleError.mockRestore();
	});

	it('does not throw when keywords are using in inner script variables but logs an error and returns an empty context', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			class = "should-not-evaluate";
			const = "should-not-evaluate";
			if = "should-not-evaluate";
			validVar = "should-evaluate";
		`;

		const consoleError = jest.spyOn(console, 'error');

		expect(() => {
			const context = getContext(['validVar'], scriptTag);

			expect(consoleError).toHaveBeenCalledWith("getContext: JavaScript keyword found: 'class'! Please use a different variable name.");
			expect(consoleError).toHaveBeenCalledWith("getContext: JavaScript keyword found: 'const'! Please use a different variable name.");
			expect(consoleError).toHaveBeenCalledWith("getContext: JavaScript keyword found: 'if'! Please use a different variable name.");
			expect(consoleError).not.toHaveBeenCalledWith("getContext: JavaScript keyword found: 'validVar'! Please use a different variable name.");

			expect(consoleError).toHaveBeenCalledWith("getContext: error evaluating 'validVar'");

			// logs above errors plus the actual error when attempting to evaluate "validVar"
			expect(consoleError).toHaveBeenCalledTimes(5);

			expect(context).toStrictEqual({});
		}).not.toThrow();

		consoleError.mockRestore();
	});

	it('allows javascript keywords in object properties and string values', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			config = {
				class: "class",
				const: "const",
				if: true
			};
		`;

		const vars = getContext(['config'], scriptTag);
		expect(vars).toHaveProperty('config');
		expect(vars.config).toEqual({
			class: 'class',
			const: 'const',
			if: true,
		});
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

describe('variable name parsing tolerates comments', () => {
	it('does not declare literal names found in comments when evaluating', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		// the function forces the evaluation path; the comments contain `word =` patterns with literal names, which cannot be declared
		scriptTag.innerHTML = `
			// when true = the shopper is logged in
			/* null = nothing; see https://example.com/docs */
			siteId = 'abc123'; // url = "https://example.com/it's"
			func = () => 'returned value';
		`;

		const consoleError = jest.spyOn(console, 'error').mockImplementation();
		const vars = getContext(['siteId', 'func'], scriptTag);
		expect(vars.siteId).toBe('abc123');
		expect(vars.func()).toBe('returned value');
		expect(consoleError).not.toHaveBeenCalled();
		consoleError.mockRestore();
	});

	it('does not treat comment markers inside strings as comments', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			url = "https://example.com/path"; // comment
			glob = '/* not a comment */';
			after = 'value';
			func = () => after;
		`;

		const vars = getContext(['url', 'glob', 'after', 'func'], scriptTag);
		expect(vars).toMatchObject({ url: 'https://example.com/path', glob: '/* not a comment */', after: 'value' });
		expect(vars.func()).toBe('value');
	});
});

describe('scripts that cannot be evaluated either', () => {
	it('does not throw on nesting too deep for the parser or the engine', () => {
		const depth = 100000;
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `siteId = 'abc123'; value = ${'['.repeat(depth)}${']'.repeat(depth)};`;

		const consoleError = jest.spyOn(console, 'error').mockImplementation();
		expect(() => getContext(['siteId', 'value'], scriptTag)).not.toThrow();
		consoleError.mockRestore();
	});
});

describe('CSP safe static parsing', () => {
	it('does not construct a Function for declarative context scripts', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			// context variables go here
			siteId = 'abc123';
			shopper = {
				id: 'snapdev',
				cart: [{ uid: 'product123_red', parentId: 'product123', sku: 'product123_red', price: 99.99, qty: 1 }],
			};
			currency = { code: 'EUR' };
		`;

		const functionSpy = jest.spyOn(global, 'Function');

		const vars = getContext(['siteId', 'shopper', 'currency'], scriptTag);

		expect(functionSpy).not.toHaveBeenCalled();
		expect(vars).toStrictEqual({
			siteId: 'abc123',
			shopper: {
				id: 'snapdev',
				cart: [{ uid: 'product123_red', parentId: 'product123', sku: 'product123_red', price: 99.99, qty: 1 }],
			},
			currency: { code: 'EUR' },
		});

		functionSpy.mockRestore();
	});

	it('parses platform rendered scripts with entities, blank lines and irregular whitespace', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		// shape emitted by liquid/php/handlebars conditional template blocks
		scriptTag.innerHTML = `

				shopper = { id : "12345", group : "2" };


				category = { id : "185", name : "Some &quot;Quoted&quot; Category", path : "Kitchen>Sinks" };

			format = '\${{amount}}';
		`;

		const functionSpy = jest.spyOn(global, 'Function');

		const vars = getContext(['shopper', 'category', 'format'], scriptTag);

		expect(functionSpy).not.toHaveBeenCalled();
		expect(vars).toStrictEqual({
			shopper: { id: '12345', group: '2' },
			category: { id: '185', name: 'Some &quot;Quoted&quot; Category', path: 'Kitchen>Sinks' },
			format: '${{amount}}',
		});

		functionSpy.mockRestore();
	});
});

describe('behavior under a CSP that blocks unsafe-eval', () => {
	let functionSpy: jest.SpyInstance;

	beforeEach(() => {
		// getContext evaluates via the global `Function` constructor - this mock stands in for a CSP without 'unsafe-eval'
		functionSpy = jest.spyOn(global, 'Function').mockImplementation(() => {
			throw new EvalError(`Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script`);
		});
	});

	afterEach(() => {
		functionSpy.mockRestore();
	});

	it('still resolves fully declarative context scripts', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			siteId = 'abc123';
			merchandising = { segments: ['country:canada'] };
		`;

		const vars = getContext(['siteId', 'merchandising'], scriptTag);
		expect(vars).toStrictEqual({
			siteId: 'abc123',
			merchandising: { segments: ['country:canada'] },
		});
	});

	it('reads nothing from a script that also contains unsupported code, and says what and where', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			siteId = 'abc123';
			func = () => 'returned value';
			shopper = { id: 'snapdev' };
		`;

		const consoleError = jest.spyOn(console, 'error').mockImplementation();

		const vars = getContext(['siteId', 'func', 'shopper'], scriptTag);
		expect(vars).toStrictEqual({});

		// a single error naming the unsupported statement - no per-variable errors
		expect(consoleError).toHaveBeenCalledTimes(1);
		expect(consoleError.mock.calls[0][0]).toContain(`Content Security Policy ('unsafe-eval') or Trusted Types policy blocks evaluation`);
		expect(consoleError.mock.calls[0][0]).toContain(`unexpected '(' (line 3)`);

		consoleError.mockRestore();
	});

	it('attempts evaluation once per call - every blocked attempt is a separate CSP violation', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			siteId = 'abc123';
			func = () => 'returned value';
			shopper = { id: 'snapdev' };
		`;
		jest.spyOn(console, 'error').mockImplementation();

		getContext(['siteId', 'func', 'shopper'], scriptTag);
		expect(functionSpy).toHaveBeenCalledTimes(1);

		jest.mocked(console.error).mockRestore();
	});

	it('still takes the siteId from the script src and reads script attributes', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('src', 'https://snapui.searchspring.io/abc123/bundle.js');
		scriptTag.setAttribute('id', 'searchspring-context');
		scriptTag.setAttribute('branch', 'production');
		scriptTag.innerHTML = `
			shopper = { id: 'snapdev' };
			func = () => 'returned value';
		`;
		jest.spyOn(console, 'error').mockImplementation();

		const vars = getContext(['siteId', 'shopper', 'func', 'branch'], scriptTag);
		expect(vars).toStrictEqual({ siteId: 'abc123', branch: 'production' });

		jest.mocked(console.error).mockRestore();
	});
});

describe('evaluation fallback', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('declares names assigned after a regular expression containing //', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `re = /^https?:\\/\\//; utils = utils || {}; siteId = 'abc123';`;
		const consoleError = jest.spyOn(console, 'error').mockImplementation();

		const vars = getContext(['siteId'], scriptTag);
		expect(vars).toStrictEqual({ siteId: 'abc123' });
		expect(consoleError).not.toHaveBeenCalled();
		expect(window).not.toHaveProperty('utils');
	});

	it('does not declare null, or globals that are only compared with ==', () => {
		(window as any).Shopify = { formatMoney: (value: number) => `$${value}` };
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `
			shopper = { id: 'snapdev' };
			fmt = function (e) { return null == e ? '' : String(e); };
			format = function (value) { return typeof Shopify == 'undefined' ? String(value) : Shopify.formatMoney(value); };
		`;

		try {
			const vars = getContext(['shopper', 'fmt', 'format'], scriptTag);
			expect(vars.shopper).toEqual({ id: 'snapdev' });
			expect(vars.fmt(null)).toBe('');
			expect(vars.format(5)).toBe('$5');
		} finally {
			delete (window as any).Shopify;
		}
	});

	it('leaves requested keywords out of the declared names', () => {
		const scriptTag = document.createElement('script');
		scriptTag.setAttribute('type', 'searchspring');
		scriptTag.innerHTML = `func = () => 'returned value';`;
		const consoleError = jest.spyOn(console, 'error').mockImplementation();

		const vars = getContext(['class', 'func'], scriptTag);
		expect(vars.func()).toBe('returned value');
		expect(consoleError).toHaveBeenCalledTimes(1);
		expect(consoleError).toHaveBeenCalledWith("getContext: JavaScript keyword found: 'class'! Please use a different variable name.");
	});
});
