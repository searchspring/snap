import { escapeHTML } from './escapeHTML';

describe('escapeHTML function', () => {
	it('requires a string', () => {
		expect(() => {
			// @ts-ignore
			escapeHTML();
		}).toThrow();
	});

	describe('using document', () => {
		it('does nothing with plain text', () => {
			expect(escapeHTML('test me')).toEqual('test me');
			expect(escapeHTML('string\nwith\nnewlines')).toEqual('string\nwith\nnewlines');
			expect(escapeHTML('string\twith\ttabs')).toEqual('string\twith\ttabs');
		});

		it(`works with &gt; => >`, () => {
			const unencodedString = 'this > that';
			expect(escapeHTML(unencodedString)).toEqual('this &gt; that');
		});

		it(`works with &lt; => <`, () => {
			const unencodedString = 'this < that';
			expect(escapeHTML(unencodedString)).toEqual('this &lt; that');
		});

		it(`does nothing with '`, () => {
			const unencodedString = `'this is quoted'`;
			expect(escapeHTML(unencodedString)).toEqual(`'this is quoted'`);
		});

		it(`does nothing with "`, () => {
			const unencodedString = `"this is quoted"`;
			expect(escapeHTML(unencodedString)).toEqual(`"this is quoted"`);
		});

		it(`works with &amp; => &`, () => {
			const unencodedString = 'this & that';
			expect(escapeHTML(unencodedString)).toEqual('this &amp; that');
		});

		it(`works with all the things`, () => {
			const unencodedString = `<div class="classy">this & that is 'quoted'</div>`;
			expect(escapeHTML(unencodedString)).toEqual(`&lt;div class=\"classy\"&gt;this &amp; that is 'quoted'&lt;/div&gt;`);
		});
	});

	describe('using regex replace', () => {
		beforeEach(() => {
			//@ts-ignore - setting window to undefined to simulate non-browser environment
			delete global.window.document;
		});

		it('does nothing with plain text', () => {
			expect(escapeHTML('test me')).toEqual('test me');
			expect(escapeHTML('string\nwith\nnewlines')).toEqual('string\nwith\nnewlines');
			expect(escapeHTML('string\twith\ttabs')).toEqual('string\twith\ttabs');
		});

		it(`works with &gt; => >`, () => {
			const unencodedString = 'this > that';
			expect(escapeHTML(unencodedString)).toEqual('this &gt; that');
		});

		it(`works with &lt; => <`, () => {
			const unencodedString = 'this < that';
			expect(escapeHTML(unencodedString)).toEqual('this &lt; that');
		});

		it(`works with &#039; => '`, () => {
			const unencodedString = `'this is quoted'`;
			expect(escapeHTML(unencodedString)).toEqual(`&#039;this is quoted&#039;`);
		});

		it(`works with &quot; => "`, () => {
			const unencodedString = `"this is quoted"`;
			expect(escapeHTML(unencodedString)).toEqual(`&quot;this is quoted&quot;`);
		});

		it(`works with &amp; => &`, () => {
			const unencodedString = 'this & that';
			expect(escapeHTML(unencodedString)).toEqual('this &amp; that');
		});

		it(`works with all the things`, () => {
			const unencodedString = `<div class="classy">this & that is 'quoted'</div>`;
			expect(escapeHTML(unencodedString)).toEqual(`&lt;div class=&quot;classy&quot;&gt;this &amp; that is &#039;quoted&#039;&lt;/div&gt;`);
		});
	});
});
