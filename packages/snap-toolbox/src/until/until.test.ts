import { until, type UntilOptions } from './until';

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('until', () => {
	const options: Partial<UntilOptions> = {
		checkMax: 5, // limit checks because max jest timer is 5s
		checkCount: 0,
		checkTime: 60,
		exponential: 1.1,
		defer: false,
		executeFunction: true,
	};

	it('should reject try/catch', async () => {
		const thing = undefined;
		expect.assertions(1);

		try {
			await until(thing, options);
		} catch (e) {
			expect(e).toBe(undefined);
		}
	});

	it('should reject .catch()', async () => {
		const thing = undefined;
		expect.assertions(1);

		const returnVal = await until(thing, options)
			.then(() => 'success')
			.catch(() => 'rejected');
		expect(returnVal).toBe('rejected');
	});

	it('should reject falsy values', async () => {
		const things = [false, 0, '', null, undefined, NaN];
		expect.assertions(things.length);

		for (let i = 0; i < things.length; i++) {
			const thing = things[i];
			const returnVal = await until(thing, options)
				.then(() => 'success')
				.catch(() => 'rejected');
			expect(returnVal).toBe('rejected');
		}
	});

	it('should resolve immediate - function', async () => {
		const thing = jest.fn(() => 'success');
		expect.assertions(2);

		const returnVal = await until(thing, options);
		expect(thing).toHaveBeenCalledTimes(1);
		expect(returnVal).toBe('success');
	});

	it('should not executeFunction', async () => {
		const thing = jest.fn(() => 'success');
		expect.assertions(2);

		// return the function reference instead of executing it
		const returnVal = await until(thing, { ...options, executeFunction: false });
		expect(thing).toHaveBeenCalledTimes(0);
		expect(returnVal).toBe(thing);
	});

	it('should resolve immediate - primitive', async () => {
		const thing = 'success';
		expect.assertions(1);

		const returnVal = await until(thing, options);
		expect(returnVal).toBe(thing);
	});

	it('should resolve truthy values', async () => {
		const things = [true, {}, [], jest.fn, 42, -42, 42.4, -42.5, 42n, Infinity, -Infinity, 'false', 'string', new Date()];
		expect.assertions(things.length);

		for (let i = 0; i < things.length; i++) {
			const thing = things[i];
			const returnVal = await until(thing, options)
				.then(() => 'success')
				.catch(() => 'rejected');
			expect(returnVal).toBe('success');
		}
	});

	it('should resolve defer - function', async () => {
		const thing = jest.fn(() => 'success');
		expect.assertions(1);

		const returnVal = await until(thing, { ...options, defer: true })
			.then((val) => val)
			.catch(() => 'rejected');
		expect(returnVal).toBe('success');
	});

	it('should resolve defer - primitive', async () => {
		const thing = 'success';
		expect.assertions(1);

		const returnVal = await until(thing, { ...options, defer: true })
			.then((val) => val)
			.catch(() => 'rejected');
		expect(returnVal).toBe('success');
	});

	it('should resolve eventually', async () => {
		let thing = '';
		expect.assertions(2);

		const delay = options.checkTime! * (options.checkCount! - 1);
		setTimeout(() => {
			thing = 'success';
		}, delay);

		until(() => thing, options);

		expect(thing).toBe('');

		await wait(delay);

		expect(thing).toBe('success');
	});

	it('should reject eventually', async () => {
		let thing = '';
		expect.assertions(1);

		const delay = options.checkTime! * options.checkCount!;

		until(() => thing, options);
		await wait(delay + 200); // add 200ms to ensure rejects

		expect(thing).toBe('');
	});
});
