import 'whatwg-fetch';
import { Client } from './Client';
import type { ClientConfig } from '../types';

describe('SNAP Client', () => {
	it('requires a siteId during construction', () => {
		expect(() => {
			// @ts-ignore
			new Client();
		}).toThrow();

		expect(() => {
			// @ts-ignore
			new Client({});
		}).toThrow();

		expect(() => {
			new Client({ siteId: '' });
		}).toThrow();

		expect(() => {
			new Client({ siteId: '8uyt2m' });
		}).not.toThrow();
	});

	it('always prefetch meta', (done) => {
		const client = new Client({ siteId: '8uyt2m' });

		setTimeout(() => {
			try {
				expect(client.meta).toBeDefined();
				done();
			} catch (err) {
				done(err);
			}
		});
	});

	it('can pass in a client config', () => {
		const config: ClientConfig = {
			meta: {
				api: {
					origin: 'https://snapi.kube.searchspring.io/meta',
				},
			},
			search: {
				api: {
					origin: 'https://snapi.kube.searchspring.io/search',
				},
			},
			autocomplete: {
				api: {
					origin: 'https://snapi.kube.searchspring.io/autocomplete',
				},
			},
			recommend: {
				api: {
					origin: 'https://snapi.kube.searchspring.io/recommend',
				},
			},
			suggest: {
				api: {
					origin: 'https://snapi.kube.searchspring.io/suggest',
				},
			},
		};

		const client = new Client({ siteId: '8uyt2m' }, config);

		setTimeout(() => {
			try {
				expect(client.meta).toBeDefined();
				// @ts-ignore
				let clientConfig = client.config;

				expect(clientConfig.meta.api.origin).toBe(config.meta.api.origin);

				//check it merged with the default config
				expect(clientConfig.meta.cache.purgeable).toBe(false);
				expect(clientConfig.search.api.origin).toBe(config.search.api.origin);
				expect(clientConfig.autocomplete.api.origin).toBe(config.autocomplete.api.origin);
				expect(clientConfig.recommend.api.origin).toBe(config.recommend.api.origin);
				expect(clientConfig.suggest.api.origin).toBe(config.suggest.api.origin);
			} catch (err) {}
		});
	});

	it('has all the fetch functions defined', () => {
		const client = new Client({ siteId: '8uyt2m' });

		expect(client.search).toBeDefined();
		expect(client.autocomplete).toBeDefined();
		expect(client.trending).toBeDefined();
		expect(client.recommend).toBeDefined();
		expect(client.meta).toBeDefined();
	});

	it('each fetch functions uses the expected requestor', () => {
		const client = new Client({ siteId: '8uyt2m' });

		const requestMock = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ json: () => Promise.resolve({}) } as unknown as Response));

		//@ts-ignore
		const api = client.requesters.autocomplete;
		//@ts-ignore
		const metaApi = client.requesters.meta;
		//@ts-ignore
		api.request = requestMock;
		//@ts-ignore
		api.requesters.suggest.request = requestMock;
		//@ts-ignore
		api.requesters.legacy.request = requestMock;
		//@ts-ignore
		metaApi.requesters.legacy.request = requestMock;

		// Autocomplete
		const suggestResponse = {
			headers: {},
			method: 'GET',
			path: '/api/suggest/query',
			query: {
				disableSpellCorrect: true,
				language: 'en',
				query: ['hello'],
				siteId: ['8uyt2m'],
				suggestionCount: 5,
			},
		};
		const suggestCacheKey =
			'/api/suggest/query{"siteId":["8uyt2m"],"language":"en","query":["hello"],"suggestionCount":5,"disableSpellCorrect":true}';

		const metaResponse = {
			headers: {},
			method: 'GET',
			path: '/api/meta/meta.json',
			query: {
				siteId: '8uyt2m',
			},
		};

		const metaCacheKey = '/api/meta/meta.json{"siteId":"8uyt2m"}';

		const acparams = {
			search: {
				query: {
					string: 'hello',
				},
			},
		};

		try {
			client.autocomplete(acparams);
		} catch (err) {}

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(requestMock.mock.calls).toEqual([
			[metaResponse, metaCacheKey], // first call
			[suggestResponse, suggestCacheKey], // second call
		]);

		requestMock.mockReset();

		// Meta
		const metaprops = { siteId: '8uyt2m' };
		try {
			client.meta(metaprops);
		} catch (err) {}

		const metaparams = { headers: {}, method: 'GET', path: '/api/meta/meta.json', query: { siteId: '8uyt2m' } };

		const metacacheKey = '/api/meta/meta.json{"siteId":"8uyt2m"}';

		expect(requestMock).toHaveBeenCalledWith(metaparams, metacacheKey);

		requestMock.mockReset();

		//Search

		// @ts-ignore
		const searchapi = client.requesters.search;
		//@ts-ignore
		searchapi.requesters.legacy.request = requestMock;

		const searchprops = { siteId: '8uyt2m' };
		try {
			client.search(searchprops);
		} catch (err) {}

		const searchparams = { headers: {}, method: 'GET', path: '/api/search/search.json', query: { resultsFormat: 'native', siteId: ['8uyt2m'] } };

		const searchcacheKey = '/api/search/search.json{"siteId":["8uyt2m"],"resultsFormat":"native"}';

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(requestMock.mock.calls).toEqual([
			[metaResponse, metaCacheKey], // first call
			[searchparams, searchcacheKey], // second call
		]);

		requestMock.mockReset();

		// Trending

		// @ts-ignore
		const suggestapi = client.requesters.suggest;
		//@ts-ignore
		suggestapi.request = requestMock;

		const trendingprops = { siteId: '8uyt2m' };
		try {
			client.trending(trendingprops);
		} catch (err) {}

		const trendingparams = { headers: {}, method: 'GET', path: '/api/suggest/trending', query: { siteId: '8uyt2m' } };

		const trendingcacheKey = '/api/suggest/trending{"siteId":"8uyt2m"}';

		expect(requestMock).toHaveBeenCalledWith(trendingparams, trendingcacheKey);

		requestMock.mockReset();

		// Recommend

		const recResponse = [
			{
				results: [
					{
						id: '182022',
						mappings: {
							core: {
								uid: '182022',
								name: 'Stripe Out Blue Off-The-Shoulder Dress',
								sku: 'C-AD-I2-69PST',
								msrp: 50,
								price: 48,
								thumbnailImageUrl:
									'https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_thumb_med/2950_copyright_reddressboutique_2017__thumb_med.jpg',
								url: '/product/C-AD-I2-69PST',
								rating: '5',
								brand: 'Adrienne',
								popularity: 1135,
								imageUrl:
									'https://searchspring-demo-content.s3.amazonaws.com/demo/fashion/product_images_large/2950_copyright_reddressboutique_2017__large.jpg',
								ratingCount: 1111,
							},
						},
						attributes: {},
					},
				],
				profile: {
					tag: 'similar',
				},
			},
		];

		const batchRecMock = jest.spyOn(global.window, 'fetch').mockResolvedValue(recResponse as unknown as Response);

		// @ts-ignore
		const recommendapi = client.requesters.recommend;
		//@ts-ignore
		recommendapi.request = requestMock;
		//@ts-ignore
		recommendapi.batchRecommendations = batchRecMock;

		const recommendprops = { siteId: '8uyt2m', tag: 'dress' };
		try {
			client.recommend(recommendprops);
		} catch (err) {}

		const recommendparams = {
			headers: {},
			method: 'GET',
			path: '/api/personalized-recommendations/profile.json',
			query: {
				siteId: '8uyt2m',
				tag: 'dress',
			},
		};

		const recommendcacheKey = '/api/personalized-recommendations/profile.json{"tag":"dress","siteId":"8uyt2m"}';

		expect(requestMock).toHaveBeenCalledTimes(2);
		expect(requestMock.mock.calls).toEqual([
			[recommendparams, recommendcacheKey], // first call
			[{ siteId: '8uyt2m', tags: ['dress'] }], // second call
		]);

		requestMock.mockReset();
	});
});
