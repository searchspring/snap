import { MiddlewareManager } from './MiddlewareManager';

describe('Middleware Manager', () => {
	it('is instantiated with no parameters', () => {
		const middlewareManager = new MiddlewareManager();
		expect(middlewareManager).toBeDefined();
	});

	it(`can attach functions with the 'use' method`, () => {
		const middlewareManager = new MiddlewareManager();
		const testFunc = jest.fn();
		const anotherTestFunc = jest.fn();

		// @ts-ignore - ignore private error
		expect(middlewareManager.functions).toStrictEqual([]);

		middlewareManager.use(testFunc);

		// @ts-ignore - ignore private error
		expect(middlewareManager.functions).toStrictEqual([testFunc]);

		middlewareManager.use(anotherTestFunc);

		// @ts-ignore - ignore private error
		expect(middlewareManager.functions).toStrictEqual([testFunc, anotherTestFunc]);
	});

	it('can remove previously added functions', () => {
		const middlewareManager = new MiddlewareManager();
		const testFunc = () => {
			/* not doing anything */
		};
		const anotherTestFunc = () => {
			/* not doing anything differently */
		};

		expect(testFunc.name).toBe('testFunc');
		expect(anotherTestFunc.name).toBe('anotherTestFunc');

		middlewareManager.use(testFunc);
		middlewareManager.use(anotherTestFunc);

		// @ts-ignore - ignore private error
		expect(middlewareManager.functions).toStrictEqual([testFunc, anotherTestFunc]);

		middlewareManager.remove(testFunc);

		// @ts-ignore - ignore private error
		expect(middlewareManager.functions).toStrictEqual([anotherTestFunc]);

		middlewareManager.remove(anotherTestFunc);

		// @ts-ignore - ignore private error
		expect(middlewareManager.functions).toStrictEqual([]);
	});

	it(`can clear added functions with the 'clear' method`, () => {
		const middlewareManager = new MiddlewareManager();
		const testFunc = jest.fn();
		const anotherTestFunc = jest.fn();

		middlewareManager.use(testFunc, anotherTestFunc);

		// @ts-ignore - ignore private error
		expect(middlewareManager.functions).toStrictEqual([testFunc, anotherTestFunc]);

		middlewareManager.clear();

		// @ts-ignore - ignore private error
		expect(middlewareManager.functions).toStrictEqual([]);
	});

	it(`can dispatch added function with the 'dispatch' method`, () => {
		const middlewareManager = new MiddlewareManager();
		const testFunc = jest.fn();

		middlewareManager.use(testFunc);
		middlewareManager.dispatch();

		expect(testFunc).toHaveBeenCalledTimes(1);
	});

	it(`can be dispatched if no functions are added`, () => {
		const middlewareManager = new MiddlewareManager();

		expect(() => {
			middlewareManager.dispatch();
		}).not.toThrow();
	});

	it(`can dispatch added functions with the 'dispatch' method`, async () => {
		const middlewareManager = new MiddlewareManager();
		const testFunc = jest.fn();

		const fn1 = (_context: any, next: any) => {
			testFunc();
			next();
			testFunc();
		};

		const fn2 = (_context: any, next: any) => {
			testFunc();
			next();
			testFunc();
		};

		middlewareManager.use(fn1, fn2);
		await middlewareManager.dispatch();

		expect(testFunc).toHaveBeenCalledTimes(4);
	});

	it(`does not execute next function if 'next' is not called`, async () => {
		const middlewareManager = new MiddlewareManager();
		const testFunc = jest.fn();

		const fn1 = () => {
			testFunc();
			// next();
			testFunc();
		};

		// function will never be called
		const fn2 = (_context: any, next: any) => {
			testFunc();
			next();
			testFunc();
		};

		middlewareManager.use(fn1, fn2);
		await middlewareManager.dispatch();

		expect(testFunc).toHaveBeenCalledTimes(2);
	});

	it(`throws when an attached function returns 'false'`, async () => {
		const middlewareManager = new MiddlewareManager();
		const testFunc = (_context: any, next: any) => {
			next();
		};
		const anotherTestFunc = (_context: any, next: any) => {
			return false;
			next();
		};

		middlewareManager.use(testFunc, anotherTestFunc);

		await expect(async () => {
			await middlewareManager.dispatch();
		}).rejects.toThrow();
	});
});
