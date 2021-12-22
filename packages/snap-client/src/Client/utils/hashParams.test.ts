import { hashParams } from './hashParams';

describe('param character length', () => {
	it('requires an object', () => {
		expect(() => {
			// @ts-ignore
			hashParams();
		}).toThrow();

		expect(() => {
			// @ts-ignore
			hashParams(1);
		}).toThrow();

		expect(() => {
			// @ts-ignore
			hashParams('hi');
		}).toThrow();

		expect(() => {
			hashParams({ foo: 'bar' });
		}).not.toThrow();
	});

	it('returns stringification of object', () => {
		const countWithString = hashParams({ foo: 'bar' });
		expect(countWithString).toBe('{"foo":"bar"}');

		const countWithNumber = hashParams({ one: 1 });
		expect(countWithNumber).toBe('{"one":1}');

		const countWithArrayOfNumbers = hashParams({ array: [1, 2] });
		expect(countWithArrayOfNumbers).toBe('{"array":[1,2]}');

		const countWithArrayOfStrings = hashParams({ array: ['one', 'two'] });
		expect(countWithArrayOfStrings).toBe('{"array":["one","two"]}');

		const countWithMixed = hashParams({ array: ['one', 'two'], one: 1, char: 'char' });
		expect(countWithMixed).toBe('{"array":["one","two"],"one":1,"char":"char"}');
	});
});
