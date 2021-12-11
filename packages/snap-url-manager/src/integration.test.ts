import { UrlManager } from './UrlManager/UrlManager';
import { QueryStringTranslator, UrlTranslator } from './Translators';
import { ParamLocationType } from './types';

let url = '';

class MockQueryStringTranslator extends QueryStringTranslator {
	getCurrentUrl() {
		return url;
	}

	go(_url: string) {
		url = _url;
	}
}

class MockUrlTranslator extends UrlTranslator {
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

			url = 'https://somesite.com?q=testing+with+plus+signs';
			const queryWithSpaces = new UrlManager(new MockQueryStringTranslator());
			expect(queryWithSpaces.state).toStrictEqual({ query: 'testing with plus signs' });
			expect(queryWithSpaces.href).toBe('/?q=testing%20with%20plus%20signs');
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
			expect(urlManager.href).toBe('/?q=test&page=3&filter.color=red&filter.price.low=*&filter.price.high=5&sort.name=desc&other=thing');

			const overwrite = urlManager
				.set('query', 'overwritten')
				.set('page', 7)
				.set('filter', { color: 'blue' })
				.remove('other')
				.set('sort', { field: 'price', direction: 'desc' });

			expect(overwrite.state).toStrictEqual({
				query: 'overwritten',
				filter: { color: 'blue' },
				page: 7,
				sort: { field: 'price', direction: 'desc' },
			});
			expect(overwrite.href).toBe('/?q=overwritten&page=7&filter.color=blue&sort.price=desc');
		});

		it('can be given a root URL and queryParameter via config', () => {
			url = 'https://somesite.com';

			const urlManager = new UrlManager(new MockQueryStringTranslator({ urlRoot: 'https://somesite.com/search', queryParameter: 'query' }));
			expect(urlManager.href).toBe('https://somesite.com/search');

			const search = urlManager.set('query', 'the thing');
			expect(search.href).toBe('https://somesite.com/search?query=the%20thing');
		});

		it('supports typical value filter usage', () => {
			const colorFilter = new UrlManager(new MockQueryStringTranslator()).set('filter.color', 'red');
			expect(colorFilter.href).toBe('/?filter.color=red');

			const colorFilterMergeSame = colorFilter.merge('filter.color', 'red');
			expect(colorFilterMergeSame.href).toBe('/?filter.color=red');

			const colorFilterMergeAnother = colorFilter.merge('filter.color', 'blue');
			expect(colorFilterMergeAnother.href).toBe('/?filter.color=red&filter.color=blue');

			const colorFilterMergeArray = colorFilterMergeAnother.merge('filter.color', ['red', 'blue', 'green']);
			expect(colorFilterMergeArray.href).toBe('/?filter.color=red&filter.color=blue&filter.color=green');

			const colorFilterRemoveArray = colorFilterMergeArray.remove('filter.color', ['red', 'green']);
			expect(colorFilterRemoveArray.href).toBe('/?filter.color=blue');

			const colorFilterRemoveAll = colorFilterMergeArray.remove('filter.color');
			expect(colorFilterRemoveAll.href).toBe('/');

			const mergeSizeWithColor = colorFilterRemoveAll.merge('filter.color', ['red', 'blue', 'green']).merge('filter', { size: [0, 1, 2] });
			expect(mergeSizeWithColor.href).toBe('/?filter.color=red&filter.color=blue&filter.color=green&filter.size=0&filter.size=1&filter.size=2');

			const resetColorFilterWithSize = mergeSizeWithColor.set('filter.color', 'red');
			expect(resetColorFilterWithSize.href).toBe('/?filter.color=red&filter.size=0&filter.size=1&filter.size=2');

			const resetColorFilter = resetColorFilterWithSize.set('filter', { color: 'red' });
			expect(resetColorFilter.href).toBe('/?filter.color=red');
		});

		it('supports typical range filter usage', () => {
			const objectType = new UrlManager(new MockQueryStringTranslator()).set('filter.price', { low: 0, high: 10 });
			expect(objectType.state).toStrictEqual({ filter: { price: { low: 0, high: 10 } } });
			expect(objectType.href).toBe('/?filter.price.low=0&filter.price.high=10');

			const arrayOfObjects = new UrlManager(new MockQueryStringTranslator()).set('filter.price', [
				{ low: null, high: 10 },
				{ low: 10, high: 20 },
				{ low: 20, high: null },
			]);
			expect(arrayOfObjects.state).toStrictEqual({
				filter: {
					price: [
						{ low: null, high: 10 },
						{ low: 10, high: 20 },
						{ low: 20, high: null },
					],
				},
			});
			expect(arrayOfObjects.href).toBe(
				'/?filter.price.low=*&filter.price.high=10&filter.price.low=10&filter.price.high=20&filter.price.low=20&filter.price.high=*'
			);
			const arrayOfObjectsModified = arrayOfObjects.remove('filter.price', { low: 10, high: 20 });
			expect(arrayOfObjectsModified.href).toBe('/?filter.price.low=*&filter.price.high=10&filter.price.low=20&filter.price.high=*');

			const objectArrayType = new UrlManager(new MockQueryStringTranslator()).set('filter.boolean', [true, false]);
			expect(objectArrayType.state).toStrictEqual({ filter: { boolean: [true, false] } });
		});

		it('supports typical sort usage', () => {
			const singleSort = new UrlManager(new MockQueryStringTranslator()).set('sort', { field: 'price', direction: 'asc' });
			expect(singleSort.state).toStrictEqual({
				sort: { field: 'price', direction: 'asc' },
			});
			expect(singleSort.href).toBe('/?sort.price=asc');

			const singleSortOverwrite = singleSort.merge('sort', { field: 'name', direction: 'desc' });
			expect(singleSortOverwrite.state).toStrictEqual({
				sort: { field: 'name', direction: 'desc' },
			});
			expect(singleSortOverwrite.href).toBe('/?sort.name=desc');

			const multipleSorts = singleSort.merge('sort', [{ field: 'name', direction: 'desc' }]);
			expect(multipleSorts.state).toStrictEqual({
				sort: [
					{ field: 'price', direction: 'asc' },
					{ field: 'name', direction: 'desc' },
				],
			});
			expect(multipleSorts.href).toBe('/?sort.price=asc&sort.name=desc');

			const setNewSort = multipleSorts.set('sort', [{ field: 'relevance', direction: 'desc' }]);
			expect(setNewSort.state).toStrictEqual({
				sort: [{ field: 'relevance', direction: 'desc' }],
			});
			expect(setNewSort.href).toBe('/?sort.relevance=desc');

			const removeSorts = setNewSort.remove('sort');
			expect(removeSorts.state).toStrictEqual({});
			expect(removeSorts.href).toBe('/');
		});

		it('can be extended as mockTranslator', () => {
			let url = '';
			class MockTranslator extends QueryStringTranslator {
				getCurrentUrl() {
					return url;
				}

				go(_url) {
					url = _url;
				}

				serialize(state) {
					return '#' + JSON.stringify(state);
				}

				deserialize(url) {
					return JSON.parse(url.replace(/^#/, '') || '{}');
				}
			}

			const state = { query: 'string', page: 3 };
			const mock = new MockTranslator();
			const stateUrl = mock.serialize(state);

			expect(stateUrl).toBe('#{"query":"string","page":3}');
			expect(mock.deserialize(stateUrl)).toStrictEqual(state);

			mock.go(stateUrl);
			expect(url).toBe(stateUrl);
		});

		it('can be extended as described in the documentation', () => {
			class HashTranslator extends QueryStringTranslator {
				getCurrentUrl() {
					return window.location.hash;
				}

				go(hash) {
					window.location.hash = hash;
				}

				serialize(state) {
					return '#' + super.serialize(state).split('?').pop();
				}

				deserialize(url) {
					return super.deserialize('?' + url.replace(/^\#?\/*/, ''));
				}
			}

			const hashy = new HashTranslator();
			const emptyStateUrl = hashy.serialize({});
			const emptyState = hashy.deserialize(emptyStateUrl);
			expect(emptyStateUrl).toBe('#/');
			expect(emptyState).toStrictEqual({});

			const state = { query: 'thing', page: 3 };
			const stateFullUrl = hashy.serialize(state);
			const queryState = hashy.deserialize(stateFullUrl);
			expect(stateFullUrl).toBe('#q=thing&page=3');
			expect(queryState).toStrictEqual(state);
		});
	});

	describe('Url Translator', () => {
		it('starts with expected state from URL', () => {
			url = 'https://somesite.com?q=test&page=3#/filter:color:red/filter:price:*:5/other:thing/page:3/sort:name:desc/hashstuffs';

			const fullUrlManager = new UrlManager(new MockUrlTranslator());

			expect(fullUrlManager.state).toStrictEqual({
				query: 'test',
				page: 3,
				filter: {
					color: ['red'],
					price: [{ low: null, high: 5 }],
				},
				sort: [{ field: 'name', direction: 'desc' }],
				other: ['thing'],
				hashstuffs: [],
			});

			url = 'https://somesite.com';
			const emptyUrlManager = new UrlManager(new MockUrlTranslator());
			expect(emptyUrlManager.state).toStrictEqual({});

			url = 'https://somesite.com?q=testing+with+plus+signs';
			const queryWithSpaces = new UrlManager(new MockUrlTranslator());
			expect(queryWithSpaces.state).toStrictEqual({ query: 'testing with plus signs' });
			expect(queryWithSpaces.href).toBe('/?q=testing%20with%20plus%20signs');
		});

		it('can overwrite state that it started with', () => {
			url = 'https://somesite.com?q=test&page=3#/filter:color:red/filter:price:*:5/page:3/sort:name:desc/other:thing';
			const urlManager = new UrlManager(new MockUrlTranslator());

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
			expect(urlManager.href).toBe('/?q=test&page=3#/filter:color:red/filter:price:*:5/sort:name:desc/other:thing');

			const overwrite = urlManager
				.set('query', 'overwritten')
				.set('page', 7)
				.set('filter', { color: 'blue' })
				.remove('other')
				.set('sort', { field: 'price', direction: 'desc' });

			expect(overwrite.state).toStrictEqual({
				query: 'overwritten',
				filter: { color: 'blue' },
				page: 7,
				sort: { field: 'price', direction: 'desc' },
			});
			expect(overwrite.href).toBe('/?q=overwritten&page=7#/filter:color:blue/sort:price:desc');
		});

		it('can be given a root URL and queryParameter via config', () => {
			url = 'https://somesite.com';
			const translatorConfig = {
				urlRoot: 'https://somesite.com/search',
				parameters: {
					core: {
						query: { name: 'query' },
					},
				},
			};

			const urlManager = new UrlManager(new MockUrlTranslator(translatorConfig));
			expect(urlManager.href).toBe('https://somesite.com/search');

			const search = urlManager.set('query', 'the thing');
			expect(search.href).toBe('https://somesite.com/search?query=the%20thing');
		});

		it('can be given a root URL with params that it appends to the state params', () => {
			url = 'https://somesite.com?dev#/development';
			const translatorConfig = {
				urlRoot: 'https://somesite.com/search',
				parameters: {
					core: {
						query: { name: 'query' },
					},
				},
			};

			const urlManager = new UrlManager(new MockUrlTranslator(translatorConfig));
			expect(urlManager.href).toBe('https://somesite.com/search?dev#/development');

			const search = urlManager.set('query', 'the thing');
			expect(search.href).toBe('https://somesite.com/search?query=the%20thing&dev#/development');
		});

		it('supports setting and merging params with no value', () => {
			const devMode = new UrlManager(new MockUrlTranslator()).set('dev');
			expect(devMode.href).toBe('/#/dev');

			const noDevMode = devMode.remove('dev');
			expect(noDevMode.href).toBe('/');

			const infiniteMode = noDevMode.merge('infinite');
			expect(infiniteMode.href).toBe('/#/infinite');
		});

		it('supports typical value filter usage', () => {
			const colorFilter = new UrlManager(new MockUrlTranslator()).set('filter.color', 'red');
			expect(colorFilter.href).toBe('/#/filter:color:red');

			const colorFilterMergeSame = colorFilter.merge('filter.color', 'red');
			expect(colorFilterMergeSame.href).toBe('/#/filter:color:red');

			const colorFilterMergeAnother = colorFilter.merge('filter.color', 'blue');
			expect(colorFilterMergeAnother.href).toBe('/#/filter:color:red/filter:color:blue');

			const colorFilterMergeArray = colorFilterMergeAnother.merge('filter.color', ['red', 'blue', 'green']);
			expect(colorFilterMergeArray.href).toBe('/#/filter:color:red/filter:color:blue/filter:color:green');

			const colorFilterRemoveArray = colorFilterMergeArray.remove('filter.color', ['red', 'green']);
			expect(colorFilterRemoveArray.href).toBe('/#/filter:color:blue');

			const colorFilterRemoveAll = colorFilterMergeArray.remove('filter.color');
			expect(colorFilterRemoveAll.href).toBe('/');

			const mergeSizeWithColor = colorFilterRemoveAll.merge('filter.color', ['red', 'blue', 'green']).merge('filter', { size: [0, 1, 2] });
			expect(mergeSizeWithColor.href).toBe('/#/filter:color:red/filter:color:blue/filter:color:green/filter:size:0/filter:size:1/filter:size:2');

			const resetColorFilterWithSize = mergeSizeWithColor.set('filter.color', 'red');
			expect(resetColorFilterWithSize.href).toBe('/#/filter:color:red/filter:size:0/filter:size:1/filter:size:2');

			const resetColorFilter = resetColorFilterWithSize.set('filter', { color: 'red' });
			expect(resetColorFilter.href).toBe('/#/filter:color:red');
		});

		it('supports typical range filter usage', () => {
			const objectType = new UrlManager(new MockUrlTranslator()).set('filter.price', { low: 0, high: 10 });
			expect(objectType.state).toStrictEqual({ filter: { price: { low: 0, high: 10 } } });
			expect(objectType.href).toBe('/#/filter:price:0:10');

			const arrayOfObjects = new UrlManager(new MockUrlTranslator()).set('filter.price', [
				{ low: null, high: 10 },
				{ low: 10, high: 20 },
				{ low: 20, high: null },
			]);
			expect(arrayOfObjects.state).toStrictEqual({
				filter: {
					price: [
						{ low: null, high: 10 },
						{ low: 10, high: 20 },
						{ low: 20, high: null },
					],
				},
			});
			expect(arrayOfObjects.href).toBe('/#/filter:price:*:10/filter:price:10:20/filter:price:20:*');
			const arrayOfObjectsModified = arrayOfObjects.remove('filter.price', { low: 10, high: 20 });
			expect(arrayOfObjectsModified.href).toBe('/#/filter:price:*:10/filter:price:20:*');

			const objectArrayType = new UrlManager(new MockUrlTranslator()).set('filter.boolean', [true, false]);
			expect(objectArrayType.state).toStrictEqual({ filter: { boolean: [true, false] } });
		});

		it('supports typical sort usage', () => {
			const singleSort = new UrlManager(new MockUrlTranslator()).set('sort', { field: 'price', direction: 'asc' });
			expect(singleSort.state).toStrictEqual({
				sort: { field: 'price', direction: 'asc' },
			});
			expect(singleSort.href).toBe('/#/sort:price:asc');

			const singleSortOverwrite = singleSort.merge('sort', { field: 'name', direction: 'desc' });
			expect(singleSortOverwrite.state).toStrictEqual({
				sort: { field: 'name', direction: 'desc' },
			});
			expect(singleSortOverwrite.href).toBe('/#/sort:name:desc');

			const multipleSorts = singleSort.merge('sort', [{ field: 'name', direction: 'desc' }]);
			expect(multipleSorts.state).toStrictEqual({
				sort: [
					{ field: 'price', direction: 'asc' },
					{ field: 'name', direction: 'desc' },
				],
			});
			expect(multipleSorts.href).toBe('/#/sort:price:asc/sort:name:desc');

			const setNewSort = multipleSorts.set('sort', [{ field: 'relevance', direction: 'desc' }]);
			expect(setNewSort.state).toStrictEqual({
				sort: [{ field: 'relevance', direction: 'desc' }],
			});
			expect(setNewSort.href).toBe('/#/sort:relevance:desc');

			const removeSorts = setNewSort.remove('sort');
			expect(removeSorts.state).toStrictEqual({});
			expect(removeSorts.href).toBe('/');
		});

		it('supports customization of parameters', () => {
			const translatorConfig = {
				urlRoot: 'https://www.website.com/search.html',
				parameters: {
					core: {
						query: { name: 'search' },
					},
					custom: {
						store: { type: ParamLocationType.HASH },
						view: { type: ParamLocationType.QUERY },
					},
				},
			};

			const translator = new UrlManager(new MockUrlTranslator(translatorConfig));

			const hashAndQuery = translator.set({
				query: 'the query',
				sort: { field: 'price', direction: 'asc' },
				store: ['products'],
				view: ['search'],
			});

			expect(hashAndQuery.href).toBe(translatorConfig.urlRoot + '?search=the%20query&view=search#/sort:price:asc/store:products');

			const hashAndQueryModifications = hashAndQuery.merge('store', 'articles').set('view', 'spring');

			expect(hashAndQueryModifications.href).toBe(
				translatorConfig.urlRoot + '?search=the%20query&view=spring#/sort:price:asc/store:products/store:articles'
			);
		});

		it('supports existing hash and query params and remembers which they are', () => {
			url = 'https://somesite.com/search?view=spring&finder=wheels#/size:front:225/size:back:230';
			const existingParams = new UrlManager(new MockUrlTranslator());
			const params = {
				view: ['spring'],
				finder: ['wheels'],
				size: {
					front: ['225'],
					back: ['230'],
				},
			};

			expect(existingParams.state).toStrictEqual(params);

			const removeAll = existingParams.reset();
			expect(removeAll.state).toStrictEqual({});

			const addParamsBack = removeAll.set(params);
			expect(addParamsBack.state).toStrictEqual(params);
			expect(addParamsBack.href).toBe('/?view=spring&finder=wheels#/size:front:225/size:back:230');
		});

		it('implicitly sets unknown params as hash', () => {
			url = 'https://somesite.com/';
			const emptyState = new UrlManager(new MockUrlTranslator());

			expect(emptyState.state).toStrictEqual({});

			const unknownParams = emptyState.merge('view', 'search');
			expect(unknownParams.state).toStrictEqual({ view: 'search' });
			expect(unknownParams.href).toBe('/#/view:search');

			const moreUnknownParams = unknownParams.merge('view', 'spring');
			expect(moreUnknownParams.state).toStrictEqual({ view: ['search', 'spring'] });
			expect(moreUnknownParams.href).toBe('/#/view:search/view:spring');
		});
	});
});
