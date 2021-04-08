import { truncate } from './truncate';

describe('truncate', () => {
	it('removes words until string length is below the threshold', () => {
		const output = truncate('this is a shortish length string', 10);

		expect(output).toBe('this is a');
	});

	it('appends an optional string to the end when the input string is longer than the threshold', () => {
		const output = truncate('this is a shortish length string', 30, '...');

		expect(output).toBe('this is a shortish length...');
	});

	it('does not append optional string when the input string is shorter than the threshold', () => {
		const output = truncate('this is a shortish length string', 33);

		expect(output).toBe('this is a shortish length string');
	});
});
