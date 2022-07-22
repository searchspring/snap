import { QueryStringTranslator } from './QueryStringTranslator';
import { UrlState } from '../../types';

describe('QueryStringTranslator', () => {
	it('has default configuration', () => {
		const queryString = new QueryStringTranslator();
		const defaultConfig = queryString.getConfig();

		expect(defaultConfig.urlRoot).toEqual('');

		expect(defaultConfig.settings).toEqual({
			serializeUrlRoot: true,
		});

		expect(defaultConfig.queryParameter).toEqual('q');
	});

	it('generates relative URL by default', () => {
		const url = 'http://example.com?bar=baz';
		const queryString = new QueryStringTranslator();

		const params = {
			...queryString.deserialize(url),
			foo: ['bar'],
		};

		expect(queryString.serialize(params)).toBe('/?bar=baz&foo=bar');

		expect(queryString.serialize({})).toBe('/');
	});

	it('generates absolute URL if urlRoot provided', () => {
		const url = 'http://example.com?bar=baz';
		class CustomQueryString extends QueryStringTranslator {
			getCurrentUrl() {
				return url;
			}
		}

		const queryString = new CustomQueryString({ urlRoot: '//example2.com' });

		const params = {
			...queryString.deserialize(url),
			foo: 'bar',
		};

		expect(queryString.serialize(params)).toBe('//example2.com?bar=baz&foo=bar');

		expect(queryString.serialize({})).toBe('//example2.com');
	});

	describe('deserialize', () => {
		it('deserializes empty string correctly', () => {
			const queryString = new QueryStringTranslator();
			const emptyParams: UrlState = queryString.deserialize('');

			expect(emptyParams).toEqual({});
		});

		it('deserializes with query param override', () => {
			const queryString = new QueryStringTranslator({
				queryParameter: 'search',
			});

			const url =
				'http://somesite.com?q=incorrect&search=correct&search=alsoincorrect&q=stillincorrect&filter.color=blue&filter.brand=nike&filter.brand=adidas';

			const params: UrlState = queryString.deserialize(url);

			expect(params.query).toBe('correct');

			expect(params.filter).toEqual({
				brand: ['nike', 'adidas'],
				color: ['blue'],
			});
		});

		it('deserializes core state correctly', () => {
			const url = 'http://somesite.com?sort.price=asc&filter.color=blue&filter.color=green%20striped&page=2&q=foo&filter.brand=nike';
			const queryString = new QueryStringTranslator();
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

		it('deserializes query strings with range filters correctly', () => {
			const url =
				'http://somesite.com?filter.price.low=*&filter.price.high=10&filter.price.low=10&filter.price.high=100&filter.price.low=100&filter.price.high=*';
			const queryString = new QueryStringTranslator();
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

		it('deserializes query strings with invalid range filters correctly', () => {
			const url = 'http://somesite.com?filter.price.low=nope&filter.price.high=nah&filter.price.low=100&filter.stuff.high=100';
			const queryString = new QueryStringTranslator();
			const params: UrlState = queryString.deserialize(url);

			expect(params.filter).toEqual({
				price: [{ low: null, high: null }],
			});

			expect(params.page).toBe(undefined);

			expect(params.query).toBe(undefined);
		});

		it('deserializes other query strings correctly', () => {
			const url = 'http://somesite.com?roots.trunk.branch.leaf=thing&array=uno&array=dos&array=tres';
			const queryString = new QueryStringTranslator();
			const params: UrlState = queryString.deserialize(url);

			expect(params).toEqual({
				roots: {
					trunk: {
						branch: {
							leaf: ['thing'],
						},
					},
				},
				array: ['uno', 'dos', 'tres'],
			});
		});
	});

	describe('serialize', () => {
		it('serializes empty params correctly', () => {
			const queryString = new QueryStringTranslator();
			const params: UrlState = {};
			const query = queryString.serialize(params);

			expect(query).toBe('/');
		});

		it('serializes with query param override', () => {
			const queryString = new QueryStringTranslator({
				queryParameter: 'search',
			});

			const params: UrlState = {
				query: 'the query',
			};

			const query = queryString.serialize(params);

			expect(query).toBe('/?search=the%20query');
		});

		it('serializes core state correctly', () => {
			const queryString = new QueryStringTranslator();

			const params: UrlState = {
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

			const query = queryString.serialize(params);

			expect(query).toBe(
				'/?q=shoes&page=7&filter.color=red&filter.color=orange&filter.brand=adidas&filter.price.low=99.99&filter.price.high=299.99&sort.name=desc'
			);
		});

		it('serializes other state correctly', () => {
			const queryString = new QueryStringTranslator();

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

			const query = queryString.serialize(params);

			expect(query).toBe('/?roots.trunk.branch.leaf=thing&array=uno&array=dos&array=tres');
		});

		it('serializes range filters correctly', () => {
			const queryString = new QueryStringTranslator();

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

			expect(query).toBe(
				'/?filter.price.low=*&filter.price.high=10&filter.price.low=10&filter.price.high=100&filter.price.low=100&filter.price.high=*'
			);
		});

		it('serializes with invalid range filters correctly', () => {
			const queryString = new QueryStringTranslator();

			const params = {
				filter: {
					price: [{ low: null }, { low: 10, high: 100 }, { high: 100 }],
				},
			};

			const query = queryString.serialize(params as UrlState);

			expect(query).toBe('/?filter.price.low=10&filter.price.high=100');
		});
	});
});
