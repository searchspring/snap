import { charsParams } from './charsParams';

describe('param character length', () => {
	it('requires an object', () => {
		expect(() => {
			// @ts-ignore
			charsParams();
		}).toThrow();

		expect(() => {
			// @ts-ignore
			charsParams(1);
		}).toThrow();

		expect(() => {
			// @ts-ignore
			charsParams('hi');
		}).toThrow();

		expect(() => {
			charsParams({ foo: 'bar' });
		}).not.toThrow();
	});

	it('returns a count of the keys and values', () => {
		const countWithString = charsParams({ foo: 'bar' });
		expect(countWithString).toBe(8);

		const countWithNumber = charsParams({ one: 1 });
		expect(countWithNumber).toBe(6);

		const countWithArrayOfNumbers = charsParams({ array: [1, 2] });
		expect(countWithArrayOfNumbers).toBe(15);

		const countWithArrayOfStrings = charsParams({ array: ['one', 'two'] });
		expect(countWithArrayOfStrings).toBe(19);

		const countWithMixed = charsParams({ array: ['one', 'two'], one: 1, char: 'char' });
		expect(countWithMixed).toBe(33);
	});
});
