import { UrlTranslator, CoreMap } from './UrlTranslator';
import { UrlState, ParamLocationType } from '../../types';

describe('UrlTranslator', () => {
	it('generates relative URL by default', () => {
		const url = 'http://example.com?bar=baz';
		const urlTranslator = new UrlTranslator();

		const params = {
			...urlTranslator.deserialize(url),
			foo: ['bar'],
		};

		expect(urlTranslator.serialize(params)).toBe('/?bar=baz&foo=bar');

		expect(urlTranslator.serialize({})).toBe('/');
	});

	it('prepends urlRoot when provided', () => {
		const url = 'http://example.com?bar=baz';
		class customTranslator extends UrlTranslator {
			getCurrentUrl() {
				return url;
			}
		}

		const urlTranslator = new customTranslator({ urlRoot: '//example2.com' });

		const params = {
			...urlTranslator.deserialize(url),
			query: 'foo bar',
		};

		expect(urlTranslator.serialize(params)).toBe('//example2.com?bar=baz&q=foo%20bar');
		expect(urlTranslator.serialize({})).toBe('//example2.com');
	});

	describe('config', () => {
		it('has default configuration', () => {
			const urlTranslator = new UrlTranslator();
			const defaultConfig = urlTranslator.getConfig();

			expect(defaultConfig.urlRoot).toEqual('');

			expect(defaultConfig.settings).toEqual({
				corePrefix: '',
				customType: ParamLocationType.query,
				serializeUrlRoot: true,
			});

			expect(defaultConfig.parameters.core).toEqual({
				query: { name: 'q', type: ParamLocationType.query },
				oq: { name: 'oq', type: ParamLocationType.query },
				rq: { name: 'rq', type: ParamLocationType.query },
				tag: { name: 'tag', type: ParamLocationType.query },
				page: { name: 'page', type: ParamLocationType.query },
				pageSize: { name: 'pageSize', type: ParamLocationType.hash },
				sort: { name: 'sort', type: ParamLocationType.hash },
				filter: { name: 'filter', type: ParamLocationType.hash },
				fallbackQuery: { name: 'fallbackQuery', type: ParamLocationType.query },
			});

			expect(defaultConfig.parameters.custom).toEqual({});
		});

		it('falls back to default customType when invalid type is provided', () => {
			const urlTranslator = new UrlTranslator({
				settings: {
					customType: 'invalid' as ParamLocationType,
				},
			});
			const config = urlTranslator.getConfig();

			expect(config.settings.customType).toEqual(ParamLocationType.hash);
		});

		it('can set the type of all core params with one setting', () => {
			const urlTranslator = new UrlTranslator({
				settings: {
					coreType: ParamLocationType.hash,
				},
			});
			const config = urlTranslator.getConfig();

			Object.keys(config.parameters.core).forEach((coreKey) => {
				const coreParamConfig = config.parameters.core[coreKey as keyof CoreMap];
				expect(coreParamConfig.type).toEqual(ParamLocationType.hash);
			});
		});

		it('can set the type of all core params as hash and set a single param as query', () => {
			const urlConfig = {
				parameters: {
					core: {
						query: { name: 'keyword', type: ParamLocationType.query },
					},
				},
				settings: {
					coreType: ParamLocationType.hash,
				},
			};

			const urlTranslator = new UrlTranslator(urlConfig);
			const config = urlTranslator.getConfig();

			Object.keys(config.parameters.core).forEach((coreKey) => {
				const coreParamConfig = config.parameters.core[coreKey as keyof CoreMap];
				if (coreKey == 'query') {
					expect(coreParamConfig.type).toEqual(ParamLocationType.query);
				} else {
					expect(coreParamConfig.type).toEqual(ParamLocationType.hash);
				}
			});
		});

		it('can set the type of all core params as query and set a single param as hash', () => {
			const urlConfig = {
				parameters: {
					core: {
						page: { name: 'p', type: ParamLocationType.hash },
					},
				},
				settings: {
					coreType: ParamLocationType.query,
				},
			};

			const urlTranslator = new UrlTranslator(urlConfig);
			const config = urlTranslator.getConfig();

			Object.keys(config.parameters.core).forEach((coreKey) => {
				const coreParamConfig = config.parameters.core[coreKey as keyof CoreMap];
				if (coreKey == 'page') {
					expect(coreParamConfig.type).toEqual(ParamLocationType.hash);
				} else {
					expect(coreParamConfig.type).toEqual(ParamLocationType.query);
				}
			});
		});

		it('will ignore core param type setting when it is invalid', () => {
			const urlTranslator = new UrlTranslator({
				settings: {
					coreType: 'invalid' as ParamLocationType,
				},
			});
			const config = urlTranslator.getConfig();

			expect(config.parameters.core).toEqual({
				query: { name: 'q', type: ParamLocationType.query },
				oq: { name: 'oq', type: ParamLocationType.query },
				rq: { name: 'rq', type: ParamLocationType.query },
				tag: { name: 'tag', type: ParamLocationType.query },
				page: { name: 'page', type: ParamLocationType.query },
				pageSize: { name: 'pageSize', type: ParamLocationType.hash },
				sort: { name: 'sort', type: ParamLocationType.hash },
				filter: { name: 'filter', type: ParamLocationType.hash },
				fallbackQuery: { name: 'fallbackQuery', type: ParamLocationType.query },
			});
		});
	});

	describe('deserialize', () => {
		it('deserializes empty string correctly', () => {
			const urlTranslator = new UrlTranslator();
			const emptyParams: UrlState = urlTranslator.deserialize('');

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

			expect(params).toHaveProperty('filter', {
				color: ['blue'],
				brand: ['nike', 'adidas'],
			});
		});

		it('deserializes core state correctly', () => {
			const url =
				'?q=shoes&oq=shoez&rq=shiny&tag=taggy&page=7#/pageSize:40/filter:color:red/filter:color:orange/filter:brand:adidas/filter:price:99.99:299.99/sort:name:desc';
			const urlTranslator = new UrlTranslator();
			const params: UrlState = urlTranslator.deserialize(url);

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
			const urlTranslator = new UrlTranslator({
				settings: {
					coreType: ParamLocationType.hash,
				},
			});
			const params: UrlState = urlTranslator.deserialize(url);

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
			const urlTranslator = new UrlTranslator({
				settings: {
					coreType: ParamLocationType.query,
				},
			});
			const params: UrlState = urlTranslator.deserialize(url);

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
			const urlTranslator = new UrlTranslator({
				settings: {
					coreType: ParamLocationType.hash,
				},
			});
			const params: UrlState = urlTranslator.deserialize(url);

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
			const urlTranslator = new UrlTranslator({
				parameters: {
					core: {
						query: { name: 'query', type: ParamLocationType.hash },
						oq: { name: 'originalQuery', type: ParamLocationType.hash },
						rq: { name: 'refinedQuery', type: ParamLocationType.hash },
						tag: { name: 'landingPage', type: ParamLocationType.hash },
						page: { name: 'p', type: ParamLocationType.hash },
						pageSize: { name: 'size', type: ParamLocationType.query },
						filter: { name: 'facet', type: ParamLocationType.query },
						sort: { name: 'order', type: ParamLocationType.query },
					},
				},
			});
			const params: UrlState = urlTranslator.deserialize(url);

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
			const corePrefix = 'p-';
			const url = `http://somesite.com?${corePrefix}q=foo&${corePrefix}page=2#/${corePrefix}filter:brand:nike/${corePrefix}filter:color:blue/${corePrefix}filter:color:green$2520striped/${corePrefix}sort:price:asc`;

			const urlTranslator = new UrlTranslator({
				settings: {
					corePrefix,
				},
			});
			const params: UrlState = urlTranslator.deserialize(url);

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
			const urlTranslator = new UrlTranslator();
			const params: UrlState = urlTranslator.deserialize(url);

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

			const urlTranslator = new UrlTranslator();
			const params: UrlState = urlTranslator.deserialize(url);

			expect(params.filter).toEqual(undefined);
		});

		it('deserializes query range filters correctly', () => {
			const url =
				'http://somesite.com?filter.price.low=*&filter.price.high=10&filter.price.low=10&filter.price.high=100&filter.price.low=100&filter.price.high=*';
			const config = {
				parameters: {
					core: {
						filter: {
							type: ParamLocationType.query,
						},
					},
				},
			};
			const urlTranslator = new UrlTranslator(config);
			const params: UrlState = urlTranslator.deserialize(url);

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
			const urlTranslator = new UrlTranslator();
			const params: UrlState = urlTranslator.deserialize(url);

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

		it('deserializes and removes core query parameters with no value', () => {
			const translator = new UrlTranslator({
				parameters: {
					core: {
						query: { name: 'search' },
					},
				},
			});

			const url = 'http://somesite.com?search=&otherValue=1&otherEmpty=';

			const params: UrlState = translator.deserialize(url);

			expect(params).toEqual({ otherValue: ['1'], otherEmpty: [] });
		});

		it('deserializes and removes core hash parameters with no value', () => {
			const translator = new UrlTranslator({
				parameters: {
					core: {
						sort: { name: 'sorting' },
					},
				},
			});

			const url = 'http://somesite.com#/sorting:/otherValue:1/otherEmpty:/';

			const params: UrlState = translator.deserialize(url);

			expect(params).toEqual({ otherValue: ['1'], otherEmpty: [] });
		});
	});

	describe('serialize', () => {
		it('serializes empty params correctly', () => {
			const urlTranslator = new UrlTranslator();
			const params: UrlState = {};
			const query = urlTranslator.serialize(params);

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

			expect(query).toBe('/?search=the%20query');
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
				'/?q=shoes&oq=shoez&rq=shiny&tag=taggy&page=7#/pageSize:40/filter:color:red/filter:color:orange/filter:brand:adidas/filter:price:99.99:299.99/sort:name:desc'
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
				settings: {
					coreType: ParamLocationType.hash,
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
				settings: {
					coreType: ParamLocationType.query,
				},
			});

			const query = translator.serialize(params);

			expect(query).toBe(
				'/?q=shoes&oq=shoez&rq=shiny&tag=taggy&page=7&pageSize=40&filter.color=red&filter.color=orange&filter.brand=adidas&filter.price.low=99.99&filter.price.high=299.99&sort.name=desc'
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
						query: { name: 'query', type: ParamLocationType.hash },
						oq: { name: 'originalQuery', type: ParamLocationType.hash },
						rq: { name: 'refinedQuery', type: ParamLocationType.hash },
						tag: { name: 'landingPage', type: ParamLocationType.hash },
						page: { name: 'p', type: ParamLocationType.hash },
						pageSize: { name: 'size', type: ParamLocationType.query },
						filter: { name: 'facet', type: ParamLocationType.query },
						sort: { name: 'order', type: ParamLocationType.query },
					},
				},
			});

			const query = translator.serialize(params);

			expect(query).toBe(
				'/?size=40&facet.color=red&facet.color=orange&facet.brand=adidas&facet.price.low=99.99&facet.price.high=299.99&order.name=desc#/query:shoes/originalQuery:shoez/refinedQuery:shiny/landingPage:taggy/p:7'
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

			const corePrefix = 'p-';
			const translator = new UrlTranslator({
				settings: {
					corePrefix,
				},
			});

			const query = translator.serialize(params);

			expect(query).toBe(
				`/?${corePrefix}q=foo&${corePrefix}page=2#/${corePrefix}filter:brand:nike/${corePrefix}filter:color:blue/${corePrefix}filter:color:green$2520striped/${corePrefix}sort:price:asc`
			);
		});

		it('serializes other state correctly (as query params)', () => {
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

			expect(translator.serialize(params)).toBe('/?roots.trunk.branch.leaf=thing&array=uno&array=dos&array=tres');
		});

		it('serializes range filters correctly', () => {
			const urlTranslator = new UrlTranslator();

			const params: UrlState = {
				filter: {
					price: [
						{ low: null, high: 10 },
						{ low: 10, high: 100 },
						{ low: 100, high: null },
					],
				},
			};

			const query = urlTranslator.serialize(params);

			expect(query).toBe('/#/filter:price:*:10/filter:price:10:100/filter:price:100:*');
		});

		it('serializes with invalid range filters correctly', () => {
			const urlTranslator = new UrlTranslator();

			const params = {
				filter: {
					price: [{ low: null }, { low: 10, high: 100 }, { high: 100 }],
				},
			};

			const query = urlTranslator.serialize(params as UrlState);

			expect(query).toBe('/#/filter:price:10:100');
		});

		it('serializes page state correctly', () => {
			const translator = new UrlTranslator();

			const pageOneParams = {
				page: 1,
				query: 'shoes',
			};

			const pageOneUrl = translator.serialize(pageOneParams);

			expect(pageOneUrl).toBe('/?q=shoes');

			const pageTwoParams = {
				page: 2,
				query: 'shoes',
			};

			const pageTwoUrl = translator.serialize(pageTwoParams);

			expect(pageTwoUrl).toBe('/?q=shoes&page=2');
		});
	});

	describe('custom parameters', () => {
		it('supports customization of parameters', () => {
			const config = {
				urlRoot: 'https://www.website.com/search.html',
				parameters: {
					core: {
						query: { name: 'search' },
						sort: { name: 'order', type: ParamLocationType.query },
					},
					custom: {
						ga: { type: ParamLocationType.hash },
						googs: { type: ParamLocationType.query },
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

			expect(query).toBe(config.urlRoot + '?googs=ga&search=the%20query&order.price=asc#/ga:googs');
		});

		it('handles customType hash custom params correctly', () => {
			const config = {
				urlRoot: 'https://www.website.com/search.html',
				settings: {
					customType: ParamLocationType.hash,
				},
			};
			const translator = new UrlTranslator(config);

			const query = translator.serialize({
				query: 'the query',
				sort: { field: 'price', direction: 'asc' },
				ga: ['googs'],
				googs: ['ga'],
			});

			expect(query).toBe(config.urlRoot + '?q=the%20query#/ga:googs/googs:ga/sort:price:asc');
		});

		it('handles customType query custom params correctly', () => {
			const config = {
				urlRoot: 'https://www.website.com/search.html',
				settings: {
					customType: ParamLocationType.query,
				},
			};
			const translator = new UrlTranslator(config);

			const query = translator.serialize({
				query: 'the query',
				sort: { field: 'price', direction: 'asc' },
				ga: ['googs'],
				googs: ['ga'],
			});

			expect(query).toBe(config.urlRoot + '?ga=googs&googs=ga&q=the%20query#/sort:price:asc');
		});
	});
});
