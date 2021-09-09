import { UrlTranslator } from './UrlTranslator';
import { UrlState, ParamLocationType } from '../../types';

describe('UrlTranslator', () => {
	it('generates relative URL by default', () => {
		const url = 'http://example.com?bar=baz';
		const queryString = new UrlTranslator();

		const params = {
			...queryString.deserialize(url),
			foo: ['bar'],
		};

		expect(queryString.serialize(params)).toBe('?bar=baz#/foo:bar');

		expect(queryString.serialize({})).toBe('/');
	});

	it('generates absolute URL if urlRoot provided', () => {
		const url = 'http://example.com?bar=baz';
		class customTranslator extends UrlTranslator {
			getCurrentUrl() {
				return url;
			}
		}

		const queryString = new customTranslator({ urlRoot: '//example2.com' });

		const params = {
			...queryString.deserialize(url),
			foo: 'bar',
		};

		expect(queryString.serialize(params)).toBe('//example2.com?bar=baz#/foo:bar');

		expect(queryString.serialize({})).toBe('//example2.com');
	});

	describe('config', () => {
		it('has default configuration', () => {
			const queryString = new UrlTranslator();
			const defaultConfig = queryString.getConfig();

			expect(defaultConfig.urlRoot).toEqual('');

			expect(defaultConfig.parameters.settings).toEqual({
				prefix: '',
				implicit: ParamLocationType.HASH,
			});

			expect(defaultConfig.parameters.core).toEqual({
				query: { name: 'q', type: ParamLocationType.QUERY },
				oq: { name: 'oq', type: ParamLocationType.QUERY },
				rq: { name: 'rq', type: ParamLocationType.QUERY },
				tag: { name: 'tag', type: ParamLocationType.QUERY },
				page: { name: 'page', type: ParamLocationType.QUERY },
				pageSize: { name: 'pageSize', type: ParamLocationType.HASH },
				sort: { name: 'sort', type: ParamLocationType.HASH },
				filter: { name: 'filter', type: ParamLocationType.HASH },
			});

			expect(defaultConfig.parameters.custom).toEqual({});
		});

		it('falls back to default implicit type when invalid type is provided', () => {
			const queryString = new UrlTranslator({
				parameters: {
					settings: {
						implicit: 'invalid' as ParamLocationType,
					},
				},
			});
			const config = queryString.getConfig();

			expect(config.parameters.settings.implicit).toEqual(ParamLocationType.HASH);
		});

		it('can set the type of all core params with one setting', () => {
			const queryString = new UrlTranslator({
				parameters: {
					settings: {
						type: ParamLocationType.HASH,
					},
				},
			});
			const config = queryString.getConfig();

			Object.keys(config.parameters.core).forEach((coreKey) => {
				const coreParamConfig = config.parameters.core[coreKey];
				expect(coreParamConfig.type).toEqual(ParamLocationType.HASH);
			});
		});

		it('will ignore core param type setting when it is invalid', () => {
			const queryString = new UrlTranslator({
				parameters: {
					settings: {
						type: 'invalid' as ParamLocationType,
					},
				},
			});
			const config = queryString.getConfig();

			expect(config.parameters.core).toEqual({
				query: { name: 'q', type: ParamLocationType.QUERY },
				oq: { name: 'oq', type: ParamLocationType.QUERY },
				rq: { name: 'rq', type: ParamLocationType.QUERY },
				tag: { name: 'tag', type: ParamLocationType.QUERY },
				page: { name: 'page', type: ParamLocationType.QUERY },
				pageSize: { name: 'pageSize', type: ParamLocationType.HASH },
				sort: { name: 'sort', type: ParamLocationType.HASH },
				filter: { name: 'filter', type: ParamLocationType.HASH },
			});
		});
	});

	describe('deserialize', () => {
		it('deserializes empty string correctly', () => {
			const queryString = new UrlTranslator();
			const emptyParams: UrlState = queryString.deserialize('');

			expect(emptyParams).toEqual({});
		});

		it('deserializes with query param override', () => {
			const translator = new UrlTranslator({
				parameters: {
					core: {
						query: { name: 'search' },
					},
				},
			});

			const url = 'http://somesite.com?q=incorrect&search=correct&q=alsoincorrect#/filter:color:blue/filter:brand:nike/filter:brand:adidas';

			const params: UrlState = translator.deserialize(url);

			expect(params.query).toBe('correct');

			expect(params.filter.color).toEqual(['blue']);
			expect(params.filter.brand).toEqual(['nike', 'adidas']);
		});

		it('deserializes core state correctly', () => {
			const url =
				'?q=shoes&oq=shoez&rq=shiny&tag=taggy&page=7#/pageSize:40/filter:color:red/filter:color:orange/filter:brand:adidas/filter:price:99.99:299.99/sort:name:desc';
			const queryString = new UrlTranslator();
			const params: UrlState = queryString.deserialize(url);

			expect(params.query).toBe('shoes');
			expect(params.oq).toBe('shoez');
			expect(params.rq).toBe('shiny');
			expect(params.tag).toBe('taggy');
			expect(params.page).toBe(7);
			expect(params.pageSize).toBe(40);

			expect(params.filter).toEqual({
				color: ['red', 'orange'],
				brand: ['adidas'],
				price: [
					{
						low: 99.99,
						high: 299.99,
					},
				],
			});

			expect(params.sort).toEqual([
				{
					field: 'name',
					direction: 'desc',
				},
			]);
		});

		it('deserializes core state as hash params correctly', () => {
			const url =
				'/#/q:shoes/oq:shoez/rq:shiny/tag:taggy/page:7/pageSize:40/filter:color:red/filter:color:orange/filter:brand:adidas/filter:price:99.99:299.99/sort:name:desc';
			const queryString = new UrlTranslator({
				parameters: {
					settings: {
						type: ParamLocationType.HASH,
					},
				},
			});
			const params: UrlState = queryString.deserialize(url);

			expect(params.query).toBe('shoes');
			expect(params.oq).toBe('shoez');
			expect(params.rq).toBe('shiny');
			expect(params.tag).toBe('taggy');
			expect(params.page).toBe(7);
			expect(params.pageSize).toBe(40);

			expect(params.filter).toEqual({
				color: ['red', 'orange'],
				brand: ['adidas'],
				price: [
					{
						low: 99.99,
						high: 299.99,
					},
				],
			});

			expect(params.sort).toEqual([
				{
					field: 'name',
					direction: 'desc',
				},
			]);
		});

		it('deserializes core state as query params correctly', () => {
			const url =
				'?q=shoes&oq=shoez&rq=shiny&tag=taggy&page=7&pageSize=40&filter.color=red&filter.color=orange&filter.brand=adidas&filter.price.low=99.99&filter.price.high=299.99&sort.name=desc';
			const queryString = new UrlTranslator({
				parameters: {
					settings: {
						type: ParamLocationType.QUERY,
					},
				},
			});
			const params: UrlState = queryString.deserialize(url);

			expect(params.query).toBe('shoes');
			expect(params.oq).toBe('shoez');
			expect(params.rq).toBe('shiny');
			expect(params.tag).toBe('taggy');
			expect(params.page).toBe(7);
			expect(params.pageSize).toBe(40);

			expect(params.filter).toEqual({
				color: ['red', 'orange'],
				brand: ['adidas'],
				price: [
					{
						low: 99.99,
						high: 299.99,
					},
				],
			});

			expect(params.sort).toEqual([
				{
					field: 'name',
					direction: 'desc',
				},
			]);
		});

		it('deserializes core state with type misconfiguration correctly', () => {
			const url =
				'?q=shoes&oq=shoez&rq=shiny&tag=taggy&page=7&pageSize=40&filter.color=red&filter.color=orange&filter.brand=adidas&filter.price.low=99.99&filter.price.high=299.99&sort.name=desc';
			const queryString = new UrlTranslator({
				parameters: {
					settings: {
						type: ParamLocationType.HASH,
					},
				},
			});
			const params: UrlState = queryString.deserialize(url);

			expect(params.query).toBe(undefined);
			expect(params.oq).toBe(undefined);
			expect(params.rq).toBe(undefined);
			expect(params.tag).toBe(undefined);
			expect(params.page).toBe(undefined);
			expect(params.pageSize).toBe(undefined);
			expect(params.filter).toBe(undefined);
			expect(params.sort).toBe(undefined);
		});

		it('deserializes core state with name and type changes correctly', () => {
			const url =
				'?size=40&facet.color=red&facet.color=orange&facet.brand=adidas&facet.price.low=99.99&facet.price.high=299.99&order.name=desc#/query:shoes/originalQuery:shoez/refinedQuery:shiny/landingPage:taggy/p:7';
			const queryString = new UrlTranslator({
				parameters: {
					core: {
						query: { name: 'query', type: ParamLocationType.HASH },
						oq: { name: 'originalQuery', type: ParamLocationType.HASH },
						rq: { name: 'refinedQuery', type: ParamLocationType.HASH },
						tag: { name: 'landingPage', type: ParamLocationType.HASH },
						page: { name: 'p', type: ParamLocationType.HASH },
						pageSize: { name: 'size', type: ParamLocationType.QUERY },
						filter: { name: 'facet', type: ParamLocationType.QUERY },
						sort: { name: 'order', type: ParamLocationType.QUERY },
					},
				},
			});
			const params: UrlState = queryString.deserialize(url);

			expect(params.query).toBe('shoes');
			expect(params.oq).toBe('shoez');
			expect(params.rq).toBe('shiny');
			expect(params.tag).toBe('taggy');
			expect(params.page).toBe(7);
			expect(params.pageSize).toBe(40);

			expect(params.filter).toEqual({
				color: ['red', 'orange'],
				brand: ['adidas'],
				price: [
					{
						low: 99.99,
						high: 299.99,
					},
				],
			});

			expect(params.sort).toEqual([
				{
					field: 'name',
					direction: 'desc',
				},
			]);
		});

		it('deserializes core state with prefix correctly', () => {
			const prefix = 'p-';
			const url = `http://somesite.com?${prefix}q=foo&${prefix}page=2#/${prefix}filter:brand:nike/${prefix}filter:color:blue/${prefix}filter:color:green$2520striped/${prefix}sort:price:asc`;

			const queryString = new UrlTranslator({
				parameters: {
					settings: {
						prefix,
					},
				},
			});
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

		it('deserializes hash range filters correctly', () => {
			const url = 'http://somesite.com#/filter:price:*:10/filter:price:10:100/filter:price:100:*';
			const queryString = new UrlTranslator();
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

		it('ignores range filters of the wrong type when not configured correctly', () => {
			const url =
				'http://somesite.com?filter.price.low=*&filter.price.high=10&filter.price.low=10&filter.price.high=100&filter.price.low=100&filter.price.high=*';

			const queryString = new UrlTranslator();
			const params: UrlState = queryString.deserialize(url);

			expect(params.filter).toEqual(undefined);
		});

		it('deserializes query range filters correctly', () => {
			const url =
				'http://somesite.com?filter.price.low=*&filter.price.high=10&filter.price.low=10&filter.price.high=100&filter.price.low=100&filter.price.high=*';
			const config = {
				parameters: {
					core: {
						filter: {
							type: ParamLocationType.QUERY,
						},
					},
				},
			};
			const queryString = new UrlTranslator(config);
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
			const queryString = new UrlTranslator();
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
			const translator = new UrlTranslator({
				parameters: {
					core: {
						query: { name: 'search' },
					},
				},
			});

			const url = 'http://somesite.com#/other:thing:3/thing';

			const params: UrlState = translator.deserialize(url);

			expect(params.other).toEqual({ thing: ['3'] });
			expect(params.thing).toEqual([]);
		});

		it('deserializes page state correctly', () => {
			const translator = new UrlTranslator();

			const pageOneUrl = 'http://somesite.com?q=shoes&page=1';
			const pageOneParams: UrlState = translator.deserialize(pageOneUrl);

			expect(pageOneParams.query).toEqual('shoes');
			expect(pageOneParams.page).toEqual(undefined);

			const pageTwoUrl = 'http://somesite.com?q=shoes&page=2';
			const pageTwoParams: UrlState = translator.deserialize(pageTwoUrl);

			expect(pageTwoParams.query).toEqual('shoes');
			expect(pageTwoParams.page).toEqual(2);
		});
	});

	describe('serialize', () => {
		it('serializes empty params correctly', () => {
			const queryString = new UrlTranslator();
			const params: UrlState = {};
			const query = queryString.serialize(params);

			expect(query).toBe('/');
		});

		it('serializes with query param override', () => {
			const translator = new UrlTranslator({
				parameters: {
					core: {
						query: { name: 'search' },
					},
				},
			});

			const query = translator.serialize({
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
				pageSize: 40,
				query: 'shoes',
				rq: 'shiny',
				oq: 'shoez',
				tag: 'taggy',
				sort: [
					{
						field: 'name',
						direction: 'desc',
					},
				],
			};

			const translator = new UrlTranslator();

			const query = translator.serialize(params);

			expect(query).toBe(
				'?q=shoes&oq=shoez&rq=shiny&tag=taggy&page=7#/pageSize:40/filter:color:red/filter:color:orange/filter:brand:adidas/filter:price:99.99:299.99/sort:name:desc'
			);
		});

		it('serializes core state as hash params correctly', () => {
			const params = {
				filter: {
					color: ['red', 'orange'],
					brand: ['adidas'],
					price: [{ low: 99.99, high: 299.99 }],
				},
				page: 7,
				pageSize: 40,
				query: 'shoes',
				rq: 'shiny',
				oq: 'shoez',
				tag: 'taggy',
				sort: [
					{
						field: 'name',
						direction: 'desc',
					},
				],
			};

			const translator = new UrlTranslator({
				parameters: {
					settings: {
						type: ParamLocationType.HASH,
					},
				},
			});

			const query = translator.serialize(params);

			expect(query).toBe(
				'/#/q:shoes/oq:shoez/rq:shiny/tag:taggy/page:7/pageSize:40/filter:color:red/filter:color:orange/filter:brand:adidas/filter:price:99.99:299.99/sort:name:desc'
			);
		});

		it('serializes core state as query params correctly', () => {
			const params = {
				filter: {
					color: ['red', 'orange'],
					brand: ['adidas'],
					price: [{ low: 99.99, high: 299.99 }],
				},
				page: 7,
				pageSize: 40,
				query: 'shoes',
				rq: 'shiny',
				oq: 'shoez',
				tag: 'taggy',
				sort: [
					{
						field: 'name',
						direction: 'desc',
					},
				],
			};

			const translator = new UrlTranslator({
				parameters: {
					settings: {
						type: ParamLocationType.QUERY,
					},
				},
			});

			const query = translator.serialize(params);

			expect(query).toBe(
				'?q=shoes&oq=shoez&rq=shiny&tag=taggy&page=7&pageSize=40&filter.color=red&filter.color=orange&filter.brand=adidas&filter.price.low=99.99&filter.price.high=299.99&sort.name=desc'
			);
		});

		it('serializes core state with name and type changes correctly', () => {
			const params = {
				filter: {
					color: ['red', 'orange'],
					brand: ['adidas'],
					price: [{ low: 99.99, high: 299.99 }],
				},
				page: 7,
				pageSize: 40,
				query: 'shoes',
				rq: 'shiny',
				oq: 'shoez',
				tag: 'taggy',
				sort: [
					{
						field: 'name',
						direction: 'desc',
					},
				],
			};

			const translator = new UrlTranslator({
				parameters: {
					core: {
						query: { name: 'query', type: ParamLocationType.HASH },
						oq: { name: 'originalQuery', type: ParamLocationType.HASH },
						rq: { name: 'refinedQuery', type: ParamLocationType.HASH },
						tag: { name: 'landingPage', type: ParamLocationType.HASH },
						page: { name: 'p', type: ParamLocationType.HASH },
						pageSize: { name: 'size', type: ParamLocationType.QUERY },
						filter: { name: 'facet', type: ParamLocationType.QUERY },
						sort: { name: 'order', type: ParamLocationType.QUERY },
					},
				},
			});

			const query = translator.serialize(params);

			expect(query).toBe(
				'?size=40&facet.color=red&facet.color=orange&facet.brand=adidas&facet.price.low=99.99&facet.price.high=299.99&order.name=desc#/query:shoes/originalQuery:shoez/refinedQuery:shiny/landingPage:taggy/p:7'
			);
		});

		it('serializes core state with prefix correctly', () => {
			const params = {
				filter: {
					brand: ['nike'],
					color: ['blue', 'green striped'],
				},
				page: 2,
				query: 'foo',
				sort: [
					{
						field: 'price',
						direction: 'asc',
					},
				],
			};

			const prefix = 'p-';
			const translator = new UrlTranslator({
				parameters: {
					settings: {
						prefix,
					},
				},
			});

			const query = translator.serialize(params);

			expect(query).toBe(
				`?${prefix}q=foo&${prefix}page=2#/${prefix}filter:brand:nike/${prefix}filter:color:blue/${prefix}filter:color:green$2520striped/${prefix}sort:price:asc`
			);
		});

		it('serializes other state correctly (as hash params)', () => {
			const translator = new UrlTranslator({
				parameters: {
					core: {
						query: { name: 'search' },
					},
				},
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

			expect(translator.serialize(params)).toBe('/#/roots:trunk:branch:leaf:thing/array:uno/array:dos/array:tres');
		});

		it('serializes range filters correctly', () => {
			const queryString = new UrlTranslator();

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
			const queryString = new UrlTranslator();

			const params = {
				filter: {
					price: [{ low: null }, { low: 10, high: 100 }, { high: 100 }],
				},
			};

			const query = queryString.serialize(params as UrlState);

			expect(query).toBe('/#/filter:price:10:100');
		});

		it('serializes page state correctly', () => {
			const translator = new UrlTranslator();

			const pageOneParams = {
				page: 1,
				query: 'shoes',
			};

			const pageOneUrl = translator.serialize(pageOneParams);

			expect(pageOneUrl).toBe('?q=shoes');

			const pageTwoParams = {
				page: 2,
				query: 'shoes',
			};

			const pageTwoUrl = translator.serialize(pageTwoParams);

			expect(pageTwoUrl).toBe('?q=shoes&page=2');
		});
	});

	describe('custom parameters', () => {
		it('supports customization of parameters', () => {
			const config = {
				urlRoot: 'https://www.website.com/search.html',
				parameters: {
					core: {
						query: { name: 'search' },
						sort: { name: 'order', type: ParamLocationType.QUERY },
					},
					custom: {
						ga: { type: ParamLocationType.HASH },
						googs: { type: ParamLocationType.QUERY },
					},
				},
			};
			const translator = new UrlTranslator(config);

			const query = translator.serialize({
				query: 'the query',
				sort: { field: 'price', direction: 'asc' },
				ga: ['googs'],
				googs: ['ga'],
			});

			expect(query).toBe(config.urlRoot + '?search=the%20query&order.price=asc&googs=ga#/ga:googs');
		});

		it('handles implicit hash custom params correctly', () => {
			const config = {
				urlRoot: 'https://www.website.com/search.html',
				parameters: {
					settings: {
						implicit: ParamLocationType.HASH,
					},
				},
			};
			const translator = new UrlTranslator(config);

			const query = translator.serialize({
				query: 'the query',
				sort: { field: 'price', direction: 'asc' },
				ga: ['googs'],
				googs: ['ga'],
			});

			expect(query).toBe(config.urlRoot + '?q=the%20query#/sort:price:asc/ga:googs/googs:ga');
		});

		it('handles implicit query custom params correctly', () => {
			const config = {
				urlRoot: 'https://www.website.com/search.html',
				parameters: {
					settings: {
						implicit: ParamLocationType.QUERY,
					},
				},
			};
			const translator = new UrlTranslator(config);

			const query = translator.serialize({
				query: 'the query',
				sort: { field: 'price', direction: 'asc' },
				ga: ['googs'],
				googs: ['ga'],
			});

			expect(query).toBe(config.urlRoot + '?q=the%20query&ga=googs&googs=ga#/sort:price:asc');
		});
	});
});
