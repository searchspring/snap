import { HybridTranslator } from './HybridTranslator';
import { UrlState } from '../../types';

describe('HybridTranslator', () => {
	it('generates relative URL by default', () => {
		const url = 'http://example.com?bar=baz';
		const queryString = new HybridTranslator();

		const params = {
			...queryString.deserialize(url),
			foo: ['bar'],
		};

		expect(queryString.serialize(params)).toBe('?bar=baz#/foo:bar');

		expect(queryString.serialize({})).toBe('/');
	});

	it('generates absolute URL if urlRoot provided', () => {
		const url = 'http://example.com?bar=baz';
		class CustomHybrid extends HybridTranslator {
			getCurrentUrl() {
				return url;
			}
		}

		const queryString = new CustomHybrid({ urlRoot: '//example2.com' });

		const params = {
			...queryString.deserialize(url),
			foo: 'bar',
		};

		expect(queryString.serialize(params)).toBe('//example2.com?bar=baz#/foo:bar');

		expect(queryString.serialize({})).toBe('//example2.com');
	});

	describe('deserialize', () => {
		it('deserializes empty string correctly', () => {
			const queryString = new HybridTranslator();
			const emptyParams: UrlState = queryString.deserialize('');

			expect(emptyParams).toEqual({});
		});

		it('deserializes with query param override', () => {
			const hybrid = new HybridTranslator({
				queryParameter: 'search',
			});

			const url = 'http://somesite.com?q=incorrect&search=correct&q=alsoincorrect#/filter:color:blue/filter:brand:nike/filter:brand:adidas';

			const params: UrlState = hybrid.deserialize(url);

			expect(params.query).toBe('correct');

			expect(params.filter.color).toEqual(['blue']);
			expect(params.filter.brand).toEqual(['nike', 'adidas']);
		});

		it('deserializes core state correctly', () => {
			const url = 'http://somesite.com?q=foo&page=2#/filter:brand:nike/filter:color:blue/filter:color:green%20striped/sort:price:asc';
			const queryString = new HybridTranslator();
			const params: UrlState = queryString.deserialize(url);

			expect(params.query).toBe('foo');

			expect(params.page).toBe(2);

			expect(params.filter).toEqual({
				color: ['blue', 'green striped'],
				brand: ['nike'],
			});

			expect(params.sort).toEqual([
				{
					field: 'price',
					direction: 'asc',
				},
			]);
		});

		it('deserializes range filters correctly', () => {
			const url = 'http://somesite.com#/filter:price:*:10/filter:price:10:100/filter:price:100:*';
			const queryString = new HybridTranslator();
			const params: UrlState = queryString.deserialize(url);

			expect(params.filter).toEqual({
				price: [
					{ low: null, high: 10 },
					{ low: 10, high: 100 },
					{ low: 100, high: null },
				],
			});

			expect(params.page).toBe(undefined);

			expect(params.query).toBe(undefined);
		});

		it('deserializes with invalid range filters correctly', () => {
			const url = 'http://somesite.com#/filter:price:nope:nah/filter:price:nope:9000';
			const queryString = new HybridTranslator();
			const params: UrlState = queryString.deserialize(url);

			expect(params.filter).toEqual({
				price: [
					{ low: null, high: null },
					{ low: null, high: 9000 },
				],
			});

			expect(params.page).toBe(undefined);

			expect(params.query).toBe(undefined);
		});

		it('deserializes with other hashParams', () => {
			const hybrid = new HybridTranslator({
				queryParameter: 'search',
			});

			const url = 'http://somesite.com#/other:thing:3/thing';

			const params: UrlState = hybrid.deserialize(url);

			expect(params.other).toEqual({ thing: ['3'] });
			expect(params.thing).toEqual([]);
		});
	});

	describe('serialize', () => {
		it('serializes empty params correctly', () => {
			const queryString = new HybridTranslator();
			const params: UrlState = {};
			const query = queryString.serialize(params);

			expect(query).toBe('/');
		});

		it('serializes with query param override', () => {
			const hybrid = new HybridTranslator({
				queryParameter: 'search',
			});

			const query = hybrid.serialize({
				query: 'the query',
			});

			expect(query).toBe('?search=the%20query');
		});

		it('serializes core state correctly', () => {
			const params = {
				filter: {
					color: ['red', 'orange'],
					brand: ['adidas'],
					price: [{ low: 99.99, high: 299.99 }],
				},
				page: 7,
				query: 'shoes',
				sort: [
					{
						field: 'name',
						direction: 'desc',
					},
				],
			};

			const hybrid = new HybridTranslator();

			const query = hybrid.serialize(params);

			expect(query).toBe('?q=shoes&page=7#/filter:color:red/filter:color:orange/filter:brand:adidas/filter:price:99.99:299.99/sort:name:desc');
		});

		it('serializes other state correctly (as hash params)', () => {
			const hybrid = new HybridTranslator({
				queryParameter: 'search',
			});

			const params: UrlState = {
				roots: {
					trunk: {
						branch: {
							leaf: ['thing'],
						},
					},
				},
				array: ['uno', 'dos', 'tres'],
			};

			expect(hybrid.serialize(params)).toBe('/#/roots:trunk:branch:leaf:thing/array:uno/array:dos/array:tres');
		});

		it('serializes range filters correctly', () => {
			const queryString = new HybridTranslator();

			const params: UrlState = {
				filter: {
					price: [
						{ low: null, high: 10 },
						{ low: 10, high: 100 },
						{ low: 100, high: null },
					],
				},
			};

			const query = queryString.serialize(params);

			expect(query).toBe('/#/filter:price:*:10/filter:price:10:100/filter:price:100:*');
		});

		it('serializes with invalid range filters correctly', () => {
			const queryString = new HybridTranslator();

			const params = {
				filter: {
					price: [{ low: null }, { low: 10, high: 100 }, { high: 100 }],
				},
			};

			const query = queryString.serialize(params as UrlState);

			expect(query).toBe('/#/filter:price:10:100');
		});
	});

	describe('custom parameters', () => {
		it('supports customization of parameters', () => {
			const config = {
				queryParameter: 'search',
				urlRoot: 'https://www.website.com/search.html',
				parameters: {
					hash: ['ga'],
					search: ['googs'],
				},
			};
			const hybrid = new HybridTranslator(config);

			const query = hybrid.serialize({
				query: 'the query',
				sort: { field: 'price', direction: 'asc' },
				ga: ['googs'],
				googs: ['ga'],
			});

			expect(query).toBe(config.urlRoot + '?search=the%20query&googs=ga#/sort:price:asc/ga:googs');
		});
	});
});
