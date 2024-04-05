import 'whatwg-fetch';
import { getUenc } from './index';

describe('Magento2', () => {
	describe('uenc', () => {
		it('can get the uenc', () => {
			const uenc = getUenc();

			const expected = typeof btoa == 'function' ? btoa(window.location.href) : '';
			expect(uenc).toBe(expected);
		});
	});
});
