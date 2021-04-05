import { handleize } from './handleize';

describe('handleize', () => {
	it('makes input lowercase', () => {
		const output = handleize('UPPERCASE__dOwN');

		expect(output).toBe('uppercase__down');
	});

	it('removes whitespace', () => {
		const output = handleize(' spaces spaces  everywhere');

		expect(output).toBe('spaces-spaces--everywhere');
	});
});
