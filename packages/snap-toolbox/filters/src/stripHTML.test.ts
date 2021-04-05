import { stripHTML } from './stripHTML';

describe('stripHTML', () => {
	it('removes tag-like strings', () => {
		const output = stripHTML('<h1>BIG</h1>');

		expect(output).toBe('BIG');
	});

	it('removes tag-like strings inside of other strings', () => {
		const output = stripHTML('<h1><p>nested</p></h1>');

		expect(output).toBe('nested');
	});

	it('separates sub strings with spaces', () => {
		const output = stripHTML('<ul><li>one</li><li>two</li><li>three</li></ul>');

		expect(output).toBe('one two three');
	});
});
