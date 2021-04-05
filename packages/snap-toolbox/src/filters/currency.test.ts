import { currency } from './currency';

describe('formatNumber', () => {
	it('has default functionality', () => {
		const output = currency(1199.999999);

		expect(output).toBe('$1,199.99');
	});

	it('pads zeros', () => {
		const output = currency(1200);

		expect(output).toBe('$1,200.00');
	});
});
