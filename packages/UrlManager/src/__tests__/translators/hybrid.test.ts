import { HybridTranslator } from '../../translators/hybrid';

describe('translator:Hybrid', () => {
	it('deserializes query strings correctly', () => {
		const url = 'http://somesite.com?page=2&q=foo#/filter:color:blue/filter:color:green$2520striped/filter:brand:nike';

		const hybrid = new HybridTranslator();

		const params: any = hybrid.deserialize(url);

		expect(params.filter).toEqual({
			color: ['blue', 'green striped'],
			brand: ['nike'],
		});

		expect(params.page).toBe(2);

		expect(params.query).toBe('foo');

		const emptyParams: any = hybrid.deserialize('');

		expect(emptyParams).toEqual({});
	});

	it('de/serializes with other queryParams', () => {
		const hybrid = new HybridTranslator({
			queryParameter: 'search',
		});

		const url = 'http://somesite.com?other.thing=3';

		const params: any = hybrid.deserialize(url);

		expect(params.other.thing).toEqual(['3']);

		expect(hybrid.serialize(params)).toBe('?other.thing=3');
	});

	it('de/serializes with other hashParams', () => {
		const hybrid = new HybridTranslator({
			queryParameter: 'search',
		});

		const url = 'http://somesite.com#/other:thing:3/thing';

		const params: any = hybrid.deserialize(url);

		expect(params.other.thing).toEqual(['3']);
		expect(params.thing).toEqual([]);

		expect(hybrid.serialize(params)).toBe('#/other:thing:3/thing');
	});

	it('de/serializes with other no queryParams or hashParams', () => {
		const hybrid = new HybridTranslator({
			queryParameter: 'search',
		});

		const url = 'http://somesite.com/search.html';

		const params: any = hybrid.deserialize(url);

		expect(params).toEqual({});

		expect(hybrid.serialize(params)).toBe('#/');
	});

	it('deserializes with query param override', () => {
		const hybrid = new HybridTranslator({
			queryParameter: 'search',
		});

		const url = 'http://somesite.com?q=incorrect&search=correct&q=alsoincorrect#/filter:color:blue/filter:brand:nike/filter:brand:adidas';

		const params: any = hybrid.deserialize(url);

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

		const hybrid = new HybridTranslator();

		const query = hybrid.serialize(params);

		expect(query).toBe('?page=7&q=shoes#/filter:color:red/filter:color:orange/filter:brand:adidas');
	});

	it('serializes with query param override', () => {
		const params = {
			query: 'the query',
		};

		const hybrid = new HybridTranslator({
			queryParameter: 'search',
		});

		const query = hybrid.serialize(params);

		expect(query).toBe('?search=the%20query');
	});

	it('has urlRoot', () => {
		const params = {
			query: 'the query',
			sort: { field: 'price', direction: 'asc' },
			ga: ['googs'],
			googs: ['ga'],
		};

		const config = {
			queryParameter: 'search',
			urlRoot: 'https://www.website.com/search.html',
			parameters: {
				hash: ['ga'],
				search: ['googs'],
			},
		};
		const hybrid = new HybridTranslator(config);

		const query = hybrid.serialize(params);

		expect(query).toBe(config.urlRoot + '?search=the%20query&googs=ga#/sort:price:asc/ga:googs');
	});
});
