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
		expect(func).not.toHaveBeenCalled();

		await wait(100);

		expect(func).not.toHaveBeenCalled();

		await wait(100);

		expect(func).toHaveBeenCalled();
		expect(func).toHaveBeenCalledTimes(1);
	});

	it('can debounce an event using custom delay', async () => {
		const delay = 500;
		const func = jest.fn();
		const debouncedFunc = debounce(func, delay);
		debouncedFunc();
		debouncedFunc();
		debouncedFunc();
		expect(func).not.toHaveBeenCalled();

		await wait(delay / 2);
		expect(func).not.toHaveBeenCalled();
		await wait(delay / 2);

		expect(func).toHaveBeenCalled();
		expect(func).toHaveBeenCalledTimes(1);
	});
});
