import 'whatwg-fetch';
import { Client } from './Client';
import type { ClientConfig } from '../types';
import { MockData } from '@searchspring/snap-shared';
import { AppMode } from '@searchspring/snap-toolbox';
import { BEACON_PARAM } from './transforms';

const mockData = new MockData();

const wait = (time?: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('Snap Client', () => {
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

	it('instantiates with a default config', () => {
		const client = new Client({ siteId: '8uyt2m' });

		// @ts-ignore - verifying private property
		expect(client.config.mode).toBe(AppMode.production);
		// @ts-ignore - verifying private property
		expect(client.config.meta!.cache!.purgeable!).toBe(false);
		// @ts-ignore - verifying private property
		expect(client.mode).toBe(AppMode.production);

		// checking requesters mode
		// @ts-ignore - verifying private property
		for (const [name, requester] of Object.entries(client.requesters)) {
			expect(name).toBe(name);
			// @ts-ignore - verifying private property
			expect(requester.mode).toBe(AppMode.production);
			// @ts-ignore - verifying private property
			expect(requester.cache.config.enabled).toBe(true);
		}
	});

	it('can pass in a client config', () => {
		const config: ClientConfig = {
			meta: {
				origin: 'https://snapi.kube.searchspring.io/meta',
			},
			search: {
				origin: 'https://snapi.kube.searchspring.io/search',
			},
			autocomplete: {
				origin: 'https://snapi.kube.searchspring.io/autocomplete',
			},
			recommend: {
				origin: 'https://snapi.kube.searchspring.io/recommend',
			},
			suggest: {
				origin: 'https://snapi.kube.searchspring.io/suggest',
			},
		};

		const client = new Client({ siteId: '8uyt2m' }, config);

		expect(client.meta).toBeDefined();
		// @ts-ignore
		const clientConfig = client.config;

		expect(clientConfig?.meta?.origin).toBe(config?.meta?.origin);

		//check it merged with the default config
		expect(clientConfig?.meta?.cache?.purgeable).toBe(false);
		expect(clientConfig?.search?.origin).toBe(config?.search?.origin);
		expect(clientConfig?.autocomplete?.origin).toBe(config?.autocomplete?.origin);
		expect(clientConfig?.recommend?.origin).toBe(config?.recommend?.origin);
		expect(clientConfig?.suggest?.origin).toBe(config?.suggest?.origin);
	});

	it('can set mode via client config', () => {
		const config: ClientConfig = {
			mode: 'development',
		};

		const client = new Client({ siteId: '8uyt2m' }, config);

		// @ts-ignore - verifying private property
		expect(client.config.mode).toBe(AppMode.development);

		// @ts-ignore - verifying private property
		expect(client.mode).toBe(AppMode.development);

		// checking requesters mode
		// @ts-ignore - verifying private property
		for (const [name, requester] of Object.entries(client.requesters)) {
			expect(name).toBe(name);

			// @ts-ignore - verifying private property
			expect(requester.mode).toBe(AppMode.development);
			// @ts-ignore - verifying private property
			expect(requester.cache.config.enabled).toBe(false);
		}
	});

	it('has all the fetch functions defined', () => {
		const client = new Client({ siteId: '8uyt2m' });

		expect(client.search).toBeDefined();
		expect(client.autocomplete).toBeDefined();
		expect(client.trending).toBeDefined();
		expect(client.recommend).toBeDefined();
		expect(client.meta).toBeDefined();
	});

	describe('each fetch method uses the expected requester', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});
		it('Autocomplete method', async () => {
			const fetchApiMock = jest
				.spyOn(global.window, 'fetch')
				.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.autocomplete()) } as Response));

			const client = new Client({ siteId: '8uyt2m' }, { mode: 'development' });

			//@ts-ignore
			const autocompleteRequester = client.requesters.autocomplete.requesters.legacy;
			//@ts-ignore
			const suggestRequester = client.requesters.autocomplete.requesters.suggest;
			//@ts-ignore
			const metaRequester = client.requesters.meta.requesters.legacy;

			const metaRequesterSpy = jest.spyOn(metaRequester, 'request' as never);
			const suggestRequesterSpy = jest.spyOn(suggestRequester, 'request' as never);
			const acRequesterSpy = jest.spyOn(autocompleteRequester, 'request' as never);

			const acparams = {
				search: {
					query: {
						string: 'hello',
					},
				},
			};

			await client.autocomplete(acparams);

			const metaRequest = {
				headers: {},
				method: 'GET',
				path: '/api/meta/meta.json',
				query: {
					siteId: '8uyt2m',
				},
			};

			const metaCacheKey = '{"siteId":"8uyt2m"}';

			expect(metaRequesterSpy).toHaveBeenCalledTimes(1);
			expect(metaRequesterSpy.mock.calls).toEqual([
				[metaRequest, metaCacheKey], // first call
			]);
			const suggestRequest = {
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
			const suggestCacheKey = '{"siteId":["8uyt2m"],"language":"en","query":["hello"],"suggestionCount":5,"disableSpellCorrect":true}';

			expect(suggestRequesterSpy).toHaveBeenCalledTimes(1);
			expect(suggestRequesterSpy.mock.calls).toEqual([
				[suggestRequest, suggestCacheKey], // first call
			]);

			const acRequest = {
				headers: {},
				method: 'GET',
				path: '/api/search/autocomplete.json',
				query: {
					q: undefined,
					redirectResponse: 'full',
					resultsFormat: 'native',
					siteId: ['8uyt2m'],
					[BEACON_PARAM]: true,
					test: true,
				},
			};
			const acCacheKey = '{"siteId":["8uyt2m"],"redirectResponse":"full","test":true,"ajaxCatalog":"Snap","resultsFormat":"native"}';

			expect(acRequesterSpy).toHaveBeenCalledTimes(1);
			expect(acRequesterSpy.mock.calls).toEqual([
				[{ ...acRequest, query: { ajaxCatalog: 'Snap', ...acRequest.query } }, acCacheKey], // first call
			]);

			expect(fetchApiMock).toHaveBeenCalledTimes(3);

			fetchApiMock.mockReset();
		});

		it('Meta method', async () => {
			const client = new Client({ siteId: '8uyt2m' }, { mode: 'development' });

			//@ts-ignore
			const metaRequester = client.requesters.meta.requesters.legacy;

			const metaRequesterSpy = jest.spyOn(metaRequester, 'request' as never);

			const fetchApiMock = jest
				.spyOn(global.window, 'fetch')
				.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

			const metaprops = { siteId: '8uyt2m' };

			await client.meta(metaprops);

			const metaRequest = {
				headers: {},
				method: 'GET',
				path: '/api/meta/meta.json',
				query: {
					siteId: '8uyt2m',
				},
			};

			const metaCacheKey = '{"siteId":"8uyt2m"}';

			expect(metaRequesterSpy).toHaveBeenCalledTimes(1);
			expect(metaRequesterSpy.mock.calls).toEqual([[metaRequest, metaCacheKey]]);

			expect(fetchApiMock).toHaveBeenCalledTimes(1);

			fetchApiMock.mockReset();
		});

		it('Search method', async () => {
			const client = new Client({ siteId: '8uyt2m' }, { mode: 'development' });

			//@ts-ignore
			const searchRequester = client.requesters.search.requesters.legacy;

			const searchRequesterSpy = jest.spyOn(searchRequester, 'request' as never);

			//@ts-ignore
			const metaRequester = client.requesters.meta.requesters.legacy;

			const metaRequesterSpy = jest.spyOn(metaRequester, 'request' as never);

			const fetchApiMock = jest
				.spyOn(global.window, 'fetch')
				.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve(mockData.search()) } as Response));

			const searchprops = { siteId: '8uyt2m' };

			await client.search(searchprops);

			const searchparams = {
				headers: {},
				method: 'GET',
				path: '/api/search/search.json',
				query: { resultsFormat: 'native', siteId: ['8uyt2m'], test: true, [BEACON_PARAM]: true, ajaxCatalog: 'Snap' },
			};

			const searchcacheKey = '{"siteId":["8uyt2m"],"test":true,"ajaxCatalog":"Snap","resultsFormat":"native"}';

			expect(searchRequesterSpy).toHaveBeenCalledTimes(1);
			expect(searchRequesterSpy.mock.calls).toEqual([[searchparams, searchcacheKey]]);

			const metaRequest = {
				headers: {},
				method: 'GET',
				path: '/api/meta/meta.json',
				query: {
					siteId: '8uyt2m',
				},
			};

			const metaCacheKey = '{"siteId":"8uyt2m"}';

			expect(metaRequesterSpy).toHaveBeenCalledTimes(1);
			expect(metaRequesterSpy.mock.calls).toEqual([[metaRequest, metaCacheKey]]);

			expect(fetchApiMock).toHaveBeenCalledTimes(2);
			fetchApiMock.mockReset();
		});

		it('Trending method', async () => {
			const client = new Client({ siteId: '8uyt2m' }, { mode: 'development' });

			//@ts-ignore
			const suggestRequester = client.requesters.suggest;

			const suggestRequesterSpy = jest.spyOn(suggestRequester, 'request' as never);

			const fetchApiMock = jest
				.spyOn(global.window, 'fetch')
				.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

			const trendingprops = { siteId: '8uyt2m' };

			await client.trending(trendingprops);

			const trendingparams = { headers: {}, method: 'GET', path: '/api/suggest/trending', query: { siteId: '8uyt2m' } };

			const trendingcacheKey = '{"siteId":"8uyt2m"}';

			expect(suggestRequesterSpy).toHaveBeenCalledTimes(1);
			expect(suggestRequesterSpy.mock.calls).toEqual([[trendingparams, trendingcacheKey]]);
			expect(fetchApiMock).toHaveBeenCalledTimes(1);
			fetchApiMock.mockReset();
		});

		it('Recommend method', async () => {
			const client = new Client({ siteId: '8uyt2m' }, { mode: 'development' });

			//@ts-ignore
			const recommendRequester = client.requesters.recommend;

			const recommendRequesterSpy = jest.spyOn(recommendRequester, 'request' as never);

			const fetchApiMock = jest
				.spyOn(global.window, 'fetch')
				.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve([mockData.recommend()]) } as Response));

			const recommendprops = { siteId: '8uyt2m', tag: 'dress' };

			await client.recommend(recommendprops);

			const profileParams = {
				headers: {},
				method: 'GET',
				path: '/api/personalized-recommendations/profile.json',
				query: {
					siteId: '8uyt2m',
					tag: 'dress',
				},
			};

			const profileCacheKey = '{"tag":"dress","siteId":"8uyt2m"}';

			const recommendParams = {
				headers: {
					'Content-Type': 'text/plain',
				},
				method: 'POST',
				path: '/v1/recommend',
				subDomain: 'p13n',
				body: {
					profiles: [
						{
							tag: 'dress',
						},
					],
					test: true,
					siteId: '8uyt2m',
					[BEACON_PARAM]: true,
				},
			};

			const recommendCacheKey = `{"profiles":[{"tag":"dress"}],"siteId":"8uyt2m","${BEACON_PARAM}":true,"test":true}`;

			expect(recommendRequesterSpy).toHaveBeenCalledTimes(2);
			expect(recommendRequesterSpy.mock.calls).toEqual([
				[profileParams, profileCacheKey],
				[recommendParams, recommendCacheKey],
			]);

			//wait for batch timeout
			await wait(300);

			expect(fetchApiMock).toHaveBeenCalledTimes(3);
			fetchApiMock.mockReset();
		});

		describe('with custom fetchApi', () => {
			it('Autocomplete method', async () => {
				const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));
				const client = new Client({ siteId: '8uyt2m' }, { mode: 'development', fetchApi: fetchApiMock });

				//@ts-ignore
				const autocompleteRequester = client.requesters.autocomplete.requesters.legacy;
				//@ts-ignore
				const suggestRequester = client.requesters.autocomplete.requesters.suggest;
				//@ts-ignore
				const metaRequester = client.requesters.meta.requesters.legacy;

				const metaRequesterSpy = jest.spyOn(metaRequester, 'request' as never);
				const suggestRequesterSpy = jest.spyOn(suggestRequester, 'request' as never);
				const acRequesterSpy = jest.spyOn(autocompleteRequester, 'request' as never);

				const acparams = {
					search: {
						query: {
							string: 'hello',
						},
					},
				};

				await client.autocomplete(acparams);

				const metaRequest = {
					headers: {},
					method: 'GET',
					path: '/api/meta/meta.json',
					query: {
						siteId: '8uyt2m',
					},
				};

				const metaCacheKey = '{"siteId":"8uyt2m"}';

				expect(metaRequesterSpy).toHaveBeenCalledTimes(1);
				expect(metaRequesterSpy.mock.calls).toEqual([
					[metaRequest, metaCacheKey], // first call
				]);
				const suggestRequest = {
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
				const suggestCacheKey = '{"siteId":["8uyt2m"],"language":"en","query":["hello"],"suggestionCount":5,"disableSpellCorrect":true}';

				expect(suggestRequesterSpy).toHaveBeenCalledTimes(1);
				expect(suggestRequesterSpy.mock.calls).toEqual([
					[suggestRequest, suggestCacheKey], // first call
				]);

				const acRequest = {
					headers: {},
					method: 'GET',
					path: '/api/search/autocomplete.json',
					query: {
						q: undefined,
						redirectResponse: 'full',
						resultsFormat: 'native',
						siteId: ['8uyt2m'],
						[BEACON_PARAM]: true,
						test: true,
					},
				};
				const acCacheKey = '{"siteId":["8uyt2m"],"redirectResponse":"full","test":true,"ajaxCatalog":"Snap","resultsFormat":"native"}';

				expect(acRequesterSpy).toHaveBeenCalledTimes(1);
				expect(acRequesterSpy.mock.calls).toEqual([
					[{ ...acRequest, query: { ajaxCatalog: 'Snap', ...acRequest.query } }, acCacheKey], // first call
				]);

				expect(fetchApiMock).toHaveBeenCalledTimes(3);

				fetchApiMock.mockReset();
			});

			it('Meta method with custom fetchApi', async () => {
				const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

				const client = new Client({ siteId: '8uyt2m' }, { mode: 'development', fetchApi: fetchApiMock });

				//@ts-ignore
				const metaRequester = client.requesters.meta.requesters.legacy;

				const metaRequesterSpy = jest.spyOn(metaRequester, 'request' as never);

				const metaprops = { siteId: '8uyt2m' };

				await client.meta(metaprops);

				const metaRequest = {
					headers: {},
					method: 'GET',
					path: '/api/meta/meta.json',
					query: {
						siteId: '8uyt2m',
					},
				};

				const metaCacheKey = '{"siteId":"8uyt2m"}';

				expect(metaRequesterSpy).toHaveBeenCalledTimes(1);
				expect(metaRequesterSpy.mock.calls).toEqual([[metaRequest, metaCacheKey]]);

				expect(fetchApiMock).toHaveBeenCalledTimes(1);
				fetchApiMock.mockReset();
			});

			it('Search method with custom fetchApi', async () => {
				const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

				const client = new Client({ siteId: '8uyt2m' }, { mode: 'development', fetchApi: fetchApiMock });

				//@ts-ignore
				const searchRequester = client.requesters.search.requesters.legacy;

				const searchRequesterSpy = jest.spyOn(searchRequester, 'request' as never);

				//@ts-ignore
				const metaRequester = client.requesters.meta.requesters.legacy;

				const metaRequesterSpy = jest.spyOn(metaRequester, 'request' as never);

				const searchprops = { siteId: '8uyt2m' };

				await client.search(searchprops);

				const searchparams = {
					headers: {},
					method: 'GET',
					path: '/api/search/search.json',
					query: { resultsFormat: 'native', siteId: ['8uyt2m'], test: true, [BEACON_PARAM]: true, ajaxCatalog: 'Snap' },
				};

				const searchcacheKey = '{"siteId":["8uyt2m"],"test":true,"ajaxCatalog":"Snap","resultsFormat":"native"}';

				expect(searchRequesterSpy).toHaveBeenCalledTimes(1);
				expect(searchRequesterSpy.mock.calls).toEqual([[searchparams, searchcacheKey]]);

				const metaRequest = {
					headers: {},
					method: 'GET',
					path: '/api/meta/meta.json',
					query: {
						siteId: '8uyt2m',
					},
				};

				const metaCacheKey = '{"siteId":"8uyt2m"}';

				expect(metaRequesterSpy).toHaveBeenCalledTimes(1);
				expect(metaRequesterSpy.mock.calls).toEqual([[metaRequest, metaCacheKey]]);

				expect(fetchApiMock).toHaveBeenCalledTimes(2);
				fetchApiMock.mockReset();
			});

			it('Trending method with custom fetchApi', async () => {
				const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve({}) } as Response));

				const client = new Client({ siteId: '8uyt2m' }, { mode: 'development', fetchApi: fetchApiMock });

				//@ts-ignore
				const suggestRequester = client.requesters.suggest;

				const suggestRequesterSpy = jest.spyOn(suggestRequester, 'request' as never);

				const trendingprops = { siteId: '8uyt2m' };

				await client.trending(trendingprops);

				const trendingparams = { headers: {}, method: 'GET', path: '/api/suggest/trending', query: { siteId: '8uyt2m' } };

				const trendingcacheKey = '{"siteId":"8uyt2m"}';

				expect(suggestRequesterSpy).toHaveBeenCalledTimes(1);
				expect(suggestRequesterSpy.mock.calls).toEqual([[trendingparams, trendingcacheKey]]);
				expect(fetchApiMock).toHaveBeenCalledTimes(1);
				fetchApiMock.mockReset();
			});

			it('Recommend method with custom fetchApi', async () => {
				const fetchApiMock = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve([{}]) } as Response));

				const client = new Client({ siteId: '8uyt2m' }, { mode: 'development', fetchApi: fetchApiMock });

				//@ts-ignore
				const recommendRequester = client.requesters.recommend;

				const recommendRequesterSpy = jest.spyOn(recommendRequester, 'request' as never);

				const recommendprops = { siteId: '8uyt2m', tag: 'dress' };

				await client.recommend(recommendprops);

				const profileParams = {
					headers: {},
					method: 'GET',
					path: '/api/personalized-recommendations/profile.json',
					query: {
						siteId: '8uyt2m',
						tag: 'dress',
					},
				};

				const profileCacheKey = '{"tag":"dress","siteId":"8uyt2m"}';

				const recommendParams = {
					headers: {
						'Content-Type': 'text/plain',
					},
					method: 'POST',
					path: '/v1/recommend',
					subDomain: 'p13n',
					body: {
						profiles: [
							{
								tag: 'dress',
							},
						],
						test: true,
						siteId: '8uyt2m',
						[BEACON_PARAM]: true,
					},
				};

				const recommendCacheKey = `{"profiles":[{"tag":"dress"}],"siteId":"8uyt2m","${BEACON_PARAM}":true,"test":true}`;

				expect(recommendRequesterSpy).toHaveBeenCalledTimes(2);
				expect(recommendRequesterSpy.mock.calls).toEqual([
					[profileParams, profileCacheKey],
					[recommendParams, recommendCacheKey],
				]);

				//wait for batch timeout
				await wait(300);

				expect(fetchApiMock).toHaveBeenCalledTimes(3);
				fetchApiMock.mockReset();
			});
		});
	});
});
