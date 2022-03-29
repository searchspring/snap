import { Snap } from './Snap';

describe('Snap Preact', () => {
	it('throws if configuration is not provided', () => {
		const config = {};

		expect(() => {
			// @ts-ignore - testing bad instantiation
			const snap = new Snap();
		}).toThrow();
	});
});
