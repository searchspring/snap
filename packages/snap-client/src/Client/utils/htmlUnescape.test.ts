import { htmlUnescape } from './htmlUnescape';

describe('htmlUnescape function', () => {
	it('requires a string', () => {
		expect(() => {
			// @ts-ignore
			htmlUnescape();
		}).toThrow();

		expect(htmlUnescape('test me')).toEqual('test me');

		const unicodeString = 'Hugo &amp; Caddy &gt; WordPress &amp; Apache';
		expect(htmlUnescape(unicodeString)).toEqual('Hugo & Caddy > WordPress & Apache');
	});
});
