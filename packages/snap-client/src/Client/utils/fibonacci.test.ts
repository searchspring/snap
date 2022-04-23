import { fibonacci } from './fibonacci';

describe('fibonacci tests', () => {
	it('returns expected numbers', () => {
		expect(fibonacci(-1)).toEqual(0);

		expect(fibonacci(0)).toEqual(1);

		expect(fibonacci(1)).toEqual(1);

		expect(fibonacci(2)).toEqual(2);

		expect(fibonacci(3)).toEqual(3);

		expect(fibonacci(4)).toEqual(5);

		expect(fibonacci(10)).toEqual(89);

		expect(fibonacci(20)).toEqual(10946);
	});
});
