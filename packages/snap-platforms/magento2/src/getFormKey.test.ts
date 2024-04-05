import { getFormKey } from './index';
let formKey = 'omnomnom';

describe('formkey', () => {
	beforeAll(() => {
		Object.defineProperty(window.document, 'cookie', {
			writable: true,
			value: `form_key=${formKey}`,
		});
	});

	it('can get the formKey', () => {
		const uenc = getFormKey();

		const expected = formKey;
		expect(uenc).toBe(expected);
	});
});
