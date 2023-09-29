import { until, type UntilOptions } from './until';

describe('until', () => {
	it('should reject try/catch', async () => {
		const thing = undefined;
		expect.assertions(1);

		try {
			await until(thing);
		} catch (e) {
			expect(e).toBe(undefined);
		}
	});

	it('should reject .catch()', async () => {
		const thing = undefined;
		expect.assertions(1);

		const returnVal = await until(thing)
			.then(() => 'success')
			.catch(() => 'rejected');
		expect(returnVal).toBe('rejected');
	});

	it('should reject falsy values', async () => {
		const things = [false, 0, '', null, undefined, NaN];
		expect.assertions(things.length);

		const options: Partial<UntilOptions> = {
			checkMax: 5, // limit checks to 5 because max jest timer is 5s
		};

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

		const returnVal = await until(thing);
		expect(thing).toHaveBeenCalledTimes(1);
		expect(returnVal).toBe('success');
	});

	it('should not executeFunction', async () => {
		const thing = jest.fn(() => 'success');
		expect.assertions(2);

		const options: Partial<UntilOptions> = {
			executeFunction: false, // return the function reference instead of executing it
		};

		const returnVal = await until(thing, options);
		expect(thing).toHaveBeenCalledTimes(0);
		expect(returnVal).toBe(thing);
	});

	it('should resolve immediate - primative', async () => {
		const thing = 'success';
		expect.assertions(1);

		const returnVal = await until(thing);
		expect(returnVal).toBe(thing);
	});

	it('should resolve truthy values', async () => {
		const things = [true, {}, [], jest.fn, 42, -42, 42.4, -42.5, 42n, Infinity, -Infinity, 'false', 'string', new Date()];
		expect.assertions(things.length);

		const options: Partial<UntilOptions> = {
			checkMax: 5, // limit checks to 5 because max jest timer is 5s
		};

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

		const returnVal = await until(thing, { defer: true })
			.then((val) => val)
			.catch(() => 'rejected');
		expect(returnVal).toBe('success');
	});

	it('should resolve defer - primative', async () => {
		const thing = 'success';
		expect.assertions(1);

		const returnVal = await until(thing, { defer: true })
			.then((val) => val)
			.catch(() => 'rejected');
		expect(returnVal).toBe('success');
	});
});
