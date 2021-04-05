import { UrlManager } from './UrlManager/UrlManager';
import { QueryStringTranslator, HybridTranslator, NoopTranslator } from './translators';
import { UrlState, UrlTranslator } from './types';

let url = '';

class MockQueryStringTranslator extends QueryStringTranslator {
	getCurrentUrl() {
		return url;
	}

	go(_url: string) {
		url = _url;
	}
}

class MockHybridTranslator extends HybridTranslator {
	getCurrentUrl() {
		return url;
	}

	go(_url: string) {
		url = _url;
	}
}

describe('UrlManager Integration Tests', () => {
	beforeEach(() => (url = ''));

	describe('Query String Translator', () => {
		it('starts with expected state from URL', () => {
			url =
				'https://somesite.com?q=test&page=3&filter.color=red&filter.price.low=*&filter.price.high=5&other=thing&page=3&sort.name=desc#/hashstuffs';

			const fullUrlManager = new UrlManager(new MockQueryStringTranslator());

			expect(fullUrlManager.state).toStrictEqual({
				query: 'test',
				page: 3,
				filter: {
					color: ['red'],
					price: [{ low: null, high: 5 }],
				},
				sort: [{ field: 'name', direction: 'desc' }],
				other: ['thing'],
			});

			url = 'https://somesite.com';

			const emptyUrlManager = new UrlManager(new MockQueryStringTranslator());

			expect(emptyUrlManager.state).toStrictEqual({});
		});

		it('can overwrite state that it started with', () => {
			url = 'https://somesite.com?q=test&page=3&filter.color=red&filter.price.low=*&filter.price.high=5&other=thing&page=3&sort.name=desc';

			const urlManager = new UrlManager(new MockQueryStringTranslator());

			expect(urlManager.state).toStrictEqual({
				query: 'test',
				page: 3,
				filter: {
					color: ['red'],
					price: [{ low: null, high: 5 }],
				},
				sort: [{ field: 'name', direction: 'desc' }],
				other: ['thing'],
			});
		});
	});

	// describe('Hybrid Translator', () => {
	// 	it('generates the expected URL', () => {});
	// });
});
