import { unescapeHTML } from './unescapeHTML';

describe('unescapeHTML function', () => {
	it('requires a string', () => {
		expect(() => {
			// @ts-ignore
			unescapeHTML();
		}).toThrow();
	});

	it('does nothing with plain text', () => {
		expect(unescapeHTML('test me')).toEqual('test me');
		expect(unescapeHTML('string\nwith\nnewlines')).toEqual('string\nwith\nnewlines');
		expect(unescapeHTML('string\twith\ttabs')).toEqual('string\twith\ttabs');
	});

	it(`works with &gt; => >`, () => {
		const unicodeString = 'this &gt; that';
		expect(unescapeHTML(unicodeString)).toEqual('this > that');
	});

	it(`works with &lt; => <`, () => {
		const unicodeString = 'this &lt; that';
		expect(unescapeHTML(unicodeString)).toEqual('this < that');
	});

	it(`works with &#039; => '`, () => {
		const unicodeString = `&#39;this is quoted&#39;`;
		expect(unescapeHTML(unicodeString)).toEqual(`'this is quoted'`);
	});

	it(`works with &apos; => "`, () => {
		const unicodeString = `&apos;this is quoted&apos;`;
		expect(unescapeHTML(unicodeString)).toEqual(`'this is quoted'`);
	});

	it(`works with &#034; => '`, () => {
		const unicodeString = `&#34;this is quoted&#34;`;
		expect(unescapeHTML(unicodeString)).toEqual(`"this is quoted"`);
	});

	it(`works with &quot; => "`, () => {
		const unicodeString = `&quot;this is quoted&quot;`;
		expect(unescapeHTML(unicodeString)).toEqual(`"this is quoted"`);
	});

	it(`works with &amp; => &`, () => {
		const unicodeString = 'this &amp; that';
		expect(unescapeHTML(unicodeString)).toEqual('this & that');
	});
});
