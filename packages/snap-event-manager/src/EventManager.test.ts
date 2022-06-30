import { EventManager } from './EventManager';

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('Event Manager', () => {
	it('is instantiated with no parameters', () => {
		const eventManager = new EventManager();
		expect(eventManager).toBeDefined();
	});

	it('allows an event to be fired that does not exist', () => {
		const eventManager = new EventManager();
		eventManager.fire('nonexistentEvent');
	});

	it(`attaches MiddlewareManager with the 'on' method`, () => {
		const eventManager = new EventManager();

		const testFunc = jest.fn();

		eventManager.on('testEvent', () => {
			testFunc();
		});

		expect(testFunc).not.toHaveBeenCalled;
		expect(eventManager.events['testEvent']).toBeDefined();
		expect(eventManager.events['testEvent'].constructor.name).toBe('MiddlewareManager');
	});

	it(`can attach middleware with the 'on' method and execute it with the 'fire' method`, () => {
		const eventManager = new EventManager();

		const testFunc = jest.fn();

		eventManager.on('testEvent', () => {
			testFunc();
		});

		expect(testFunc).not.toHaveBeenCalled;

		eventManager.fire('testEvent');

		expect(testFunc).toHaveBeenCalledTimes(1);
	});

	it(`can pass context to middleware when sent in the 'fire' method`, () => {
		const eventManager = new EventManager();

		const testFunc = jest.fn();
		const context = 'some context';

		eventManager.on('testEvent', (context) => {
			testFunc(context);
		});

		expect(testFunc).not.toHaveBeenCalled;

		eventManager.fire('testEvent', context);

		expect(testFunc).toHaveBeenCalledWith(context);
		expect(testFunc).toHaveBeenCalledTimes(1);
	});

	it('calls middleware in the order that they are added', () => {
		const eventManager = new EventManager();

		const testFunc1 = jest.fn();
		const testFunc2 = jest.fn();
		const testFunc3 = jest.fn();

		eventManager.on('testEvent', (context, next) => {
			testFunc1();
			expect(testFunc2).not.toHaveBeenCalled();
			expect(testFunc3).not.toHaveBeenCalled();

			next();
		});

		eventManager.on('testEvent', (context, next) => {
			testFunc2();
			expect(testFunc1).toHaveBeenCalled();
			expect(testFunc3).not.toHaveBeenCalled();

			next();
		});

		eventManager.on('testEvent', (context, next) => {
			testFunc3();
			expect(testFunc1).toHaveBeenCalled();
			expect(testFunc2).toHaveBeenCalled();

			next();
		});

		expect(testFunc1).not.toHaveBeenCalled;
		expect(testFunc2).not.toHaveBeenCalled;
		expect(testFunc3).not.toHaveBeenCalled;

		eventManager.fire('testEvent');

		expect(testFunc1).toHaveBeenCalledTimes(1);
		expect(testFunc2).toHaveBeenCalledTimes(1);
		expect(testFunc3).toHaveBeenCalledTimes(1);
	});

	it(`does not proceed to the next middleware if the 'next' method is not called`, () => {
		const eventManager = new EventManager();

		const testFunc1 = jest.fn();
		const testFunc2 = jest.fn();

		eventManager.on('testEvent', (context, next) => {
			testFunc1();
			expect(testFunc2).not.toHaveBeenCalled();

			// next();
		});

		// this middleware is never executed
		eventManager.on('testEvent', (context, next) => {
			testFunc2();
			expect(testFunc1).toHaveBeenCalled();

			next();
		});

		expect(testFunc1).not.toHaveBeenCalled;
		expect(testFunc2).not.toHaveBeenCalled;

		eventManager.fire('testEvent');

		expect(testFunc1).toHaveBeenCalledTimes(1);
		expect(testFunc2).toHaveBeenCalledTimes(0);
	});

	it(`throws when a middleware returns 'false'`, async () => {
		const eventManager = new EventManager();

		const testFunc1 = jest.fn();
		const testFunc2 = jest.fn();

		eventManager.on('testEvent', async (context, next) => {
			testFunc1();
			expect(testFunc2).not.toHaveBeenCalled();

			return false;

			await next();
		});

		// this middleware is never executed
		eventManager.on('testEvent', async (context, next) => {
			testFunc2();
			expect(testFunc1).toHaveBeenCalled();

			await next();
		});

		expect(testFunc1).not.toHaveBeenCalled;
		expect(testFunc2).not.toHaveBeenCalled;

		await expect(async () => {
			await eventManager.fire('testEvent');
		}).rejects.toThrowError('cancelled');
	});

	it(`sends control back up the middlware chain`, () => {
		const eventManager = new EventManager();

		const testFunc1_start = jest.fn();
		const testFunc1_end = jest.fn();
		const testFunc2_start = jest.fn();
		const testFunc2_end = jest.fn();

		eventManager.on('testEvent', (context, next) => {
			testFunc1_start();

			expect(testFunc1_start).toHaveBeenCalled();
			expect(testFunc1_end).not.toHaveBeenCalled();
			expect(testFunc2_start).not.toHaveBeenCalled();
			expect(testFunc2_end).not.toHaveBeenCalled();

			next();

			testFunc1_end();
		});

		eventManager.on('testEvent', (context, next) => {
			testFunc2_start();

			expect(testFunc1_start).toHaveBeenCalled();
			expect(testFunc1_end).not.toHaveBeenCalled();
			expect(testFunc2_start).toHaveBeenCalled();
			expect(testFunc2_end).not.toHaveBeenCalled();

			next();

			testFunc2_end();
		});

		expect(testFunc1_start).not.toHaveBeenCalled();
		expect(testFunc1_end).not.toHaveBeenCalled();
		expect(testFunc2_start).not.toHaveBeenCalled();
		expect(testFunc2_end).not.toHaveBeenCalled();

		eventManager.fire('testEvent');

		expect(testFunc1_start).toHaveBeenCalledTimes(1);
		expect(testFunc1_end).toHaveBeenCalledTimes(1);
		expect(testFunc2_start).toHaveBeenCalledTimes(1);
		expect(testFunc2_end).toHaveBeenCalledTimes(1);
	});

	it(`works with async functions`, async () => {
		const eventManager = new EventManager();

		const testFunc1_start = jest.fn();
		const testFunc1_end = jest.fn();
		const testFunc2_start = jest.fn();
		const testFunc2_end = jest.fn();

		eventManager.on('testEvent', async (context, next) => {
			await wait();
			testFunc1_start();

			expect(testFunc1_start).toHaveBeenCalled();
			expect(testFunc1_end).not.toHaveBeenCalled();
			expect(testFunc2_start).not.toHaveBeenCalled();
			expect(testFunc2_end).not.toHaveBeenCalled();

			await next();

			await wait();
			testFunc1_end();
		});

		eventManager.on('testEvent', async (context, next) => {
			await wait();
			testFunc2_start();

			expect(testFunc1_start).toHaveBeenCalled();
			expect(testFunc1_end).not.toHaveBeenCalled();
			expect(testFunc2_start).toHaveBeenCalled();
			expect(testFunc2_end).not.toHaveBeenCalled();

			await next();

			await wait();
			testFunc2_end();
		});

		expect(testFunc1_start).not.toHaveBeenCalled();
		expect(testFunc1_end).not.toHaveBeenCalled();
		expect(testFunc2_start).not.toHaveBeenCalled();
		expect(testFunc2_end).not.toHaveBeenCalled();

		await eventManager.fire('testEvent');

		expect(testFunc1_start).toHaveBeenCalledTimes(1);
		expect(testFunc1_end).toHaveBeenCalledTimes(1);
		expect(testFunc2_start).toHaveBeenCalledTimes(1);
		expect(testFunc2_end).toHaveBeenCalledTimes(1);
	});
});
