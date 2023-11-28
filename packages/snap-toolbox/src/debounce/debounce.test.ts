import { debounce } from './debounce';

const wait = (time?: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('debounce', () => {
	it('can debounce an event', async () => {
		const func = jest.fn();
		const debouncedFunc = debounce(func);
		debouncedFunc();
		debouncedFunc();
		debouncedFunc();
		expect(func).not.toBeCalled();

		await wait(100);

		expect(func).not.toBeCalled();

		await wait(100);

		expect(func).toBeCalled();
		expect(func).toHaveBeenCalledTimes(1);
	});

	it('can debounce an event using custom delay', async () => {
		const delay = 500;
		const func = jest.fn();
		const debouncedFunc = debounce(func, delay);
		debouncedFunc();
		debouncedFunc();
		debouncedFunc();
		expect(func).not.toBeCalled();

		await wait(delay - 100);
		expect(func).not.toBeCalled();

		await wait(100);

		expect(func).toBeCalled();
		expect(func).toHaveBeenCalledTimes(1);
	});
});
