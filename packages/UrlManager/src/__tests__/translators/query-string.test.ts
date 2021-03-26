import QueryString from '../../translators/query-string';

describe('translator:QueryString', () => {
	it('deserializes query strings correctly', () => {
		const url = 'http://somesite.com?filter.color=blue&filter.color=green%20striped&page=2&q=foo&filter.brand=nike';

		const queryString = new QueryString();

		const params: any = queryString.deserialize(url);

		expect(params.filter).toEqual({
			color: ['blue', 'green striped'],
			brand: ['nike'],
		});

		expect(params.page).toBe(2);

		expect(params.query).toBe('foo');

		const emptyParams: any = queryString.deserialize('');

		expect(emptyParams).toEqual({});
	});

	it('deserializes with query param override', () => {
		const queryString = new QueryString({
			queryParameter: 'search',
		});

		const url = 'http://somesite.com?q=incorrect&search=correct&q=alsoincorrect&filter.color=blue&filter.brand=nike&filter.brand=adidas';

		const params: any = queryString.deserialize(url);

		expect(params.query).toBe('correct');

		expect(params.filter.color).toEqual(['blue']);
		expect(params.filter.brand).toEqual(['nike', 'adidas']);
	});

	it('serializes query strings correctly', () => {
		const params = {
			filter: {
				color: ['red', 'orange'],
				brand: ['adidas'],
			},
			page: 7,
			query: 'shoes',
		};

		const queryString = new QueryString();

		const query = queryString.serialize(params);

		expect(query).toBe('?page=7&q=shoes&filter.color=red&filter.color=orange&filter.brand=adidas');
	});

	it('serializes with query param override', () => {
		const params = {
			query: 'the query',
		};

		const queryString = new QueryString({
			queryParameter: 'search',
		});

		const query = queryString.serialize(params);

		expect(query).toBe('?search=the%20query');
	});

	it('uses base URL', () => {
		let url = 'http://example.com?bar=baz';
		class CustomQueryString extends QueryString {
			getCurrentUrl() {
				return url;
			}
		}

		const queryString = new CustomQueryString({ urlRoot: 'http://example2.com' });

		let params = {
			...queryString.deserialize(url),
			foo: 'bar',
		};

		expect(queryString.serialize(params)).toBe('http://example2.com?bar=baz&foo=bar');
	});
});
