import { getCurrentScript } from './getCurrentScript';

describe('getCurrentScript', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<script src="https://snapui.searchspring.io/xxxxxx/bundle.js" id="searchspring-context"></script>
			<div src="https://snapui.searchspring.io/xxxxxx/bundle.js" id="searchspring-div"></div>
		`;
	});

	it('does not require parameters', () => {
		const script = getCurrentScript();
		expect(script).toBeTruthy();
	});

	it('accepts optional selector', () => {
		const script = getCurrentScript('#searchspring-context');
		expect(script).toBeTruthy();
	});

	it('throws on invalid selector', () => {
		expect(() => {
			const script = getCurrentScript('#searchspring-dne');
			expect(script).toBeFalsy();
		}).toThrow();
	});

	it('throws on non script tag selectors', () => {
		expect(() => {
			const script = getCurrentScript('#searchspring-div');
			expect(script).toBeFalsy();
		}).toThrow();
	});
});
