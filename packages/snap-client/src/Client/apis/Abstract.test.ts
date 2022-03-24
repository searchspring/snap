import 'whatwg-fetch';
import { API, ApiConfiguration, ApiConfigurationParameters, HTTPHeaders } from './Abstract';

describe('Abstract Api', () => {
	it('has expected default values', () => {
		const api = new API(new ApiConfiguration({}));

		//doesnt need any config
		expect(() => {
			new API(new ApiConfiguration({}));
		}).not.toThrow();

		expect(api.cache).toEqual({
			config: {
				enabled: true,
				ttl: 300000, // ms
				maxSize: 200, // KB
				purgeable: true,
			},
			memoryCache: {},
		});

		// @ts-ignore
		expect(api.configuration).toBeDefined();

		// @ts-ignore
		expect(api.configuration.configuration.maxRetry).toBe(8);

		// @ts-ignore
		expect(api.retryDelay).toEqual(1000);

		// @ts-ignore
		expect(api.retryCount).toEqual(1);

		expect(api.cache).toBeDefined();

		// @ts-ignore
		expect(api.request).toBeDefined();

		// @ts-ignore
		expect(api.createFetchParams).toBeDefined();

		// @ts-ignore
		expect(api.fetchApi).toBeDefined();
	});

	it('can pass in all the props', async () => {
		// set up
		const fetchfn = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ json: () => Promise.resolve() } as unknown as Response));

		let queryParamMockfn = jest.fn(() => 'here');

		const customHeaders: HTTPHeaders = {
			customheader: 'customkey',
		};

		let CustomCacheConfig = {
			ttl: 2222,
			enabled: false,
			maxSize: 4, // KB
			purgeable: false,
		};

		let config: ApiConfigurationParameters = {
			origin: 'https://searchspring.com',
			fetchApi: global.window.fetch,
			queryParamsStringify: queryParamMockfn,
			headers: customHeaders,
			maxRetry: 2,
			cache: CustomCacheConfig,
		};

		let api;
		// end set up

		expect(() => {
			api = new API(new ApiConfiguration(config));
		}).not.toThrow();

		//has correct values
		expect(api.cache).toEqual({
			config: {
				...CustomCacheConfig,
			},
			memoryCache: {},
		});

		expect(api.configuration.origin).toBe(config.origin);
		expect(api.configuration.maxRetry).toBe(config.maxRetry);
		expect(api.configuration.cache).toBe(config.cache);
		expect(api.configuration.headers).toBe(config.headers);

		//can use passed in fetch function
		await api.fetchApi();

		expect(fetchfn).toHaveBeenCalled();

		//reset
		fetchfn.mockClear();

		//can use query params stringify
		expect(api.configuration.queryParamsStringify(['string', 'thing'])).toBe('here');
		expect(queryParamMockfn).toHaveBeenCalled();

		const body = { siteId: '8uyt2m' };
		const context = {
			path: '/api/v1/autocomplete',
			method: 'POST',
			headers: config.headers,
			body: body,
		};

		//can use createFetchParams and get back expected values
		const fetchParams = api.createFetchParams(context);
		expect(fetchParams).toBeDefined();
		expect(fetchParams.url).toBe(`${config.origin}/api/v1/autocomplete`);
		expect(fetchParams.init.body).toBe(JSON.stringify(body));
		expect(fetchParams.init.headers).toStrictEqual(customHeaders);
		expect(fetchParams.init.method).toBe('POST');

		//create fetch params requires a site id
		const badContext = { ...context, body: {} };
		expect(() => api.createFetchParams(badContext)).toThrowError(`Request failed. Missing "siteId" parameter.`);

		let config2: ApiConfigurationParameters = {
			origin: 'https://searchspring.com',
			fetchApi: global.window.fetch,
			headers: customHeaders,
			maxRetry: 2,
			cache: CustomCacheConfig,
		};
		let api2 = new API(new ApiConfiguration(config2));

		const contextWithQuery = { ...context, query: { key: 'value' } };
		// @ts-ignore
		const params = api2.createFetchParams(contextWithQuery);
		expect(params.url).toBe('https://searchspring.com/api/v1/autocomplete?key=value');

		//can use the cacheKey
		const cacheKey = '/api/v1/autocomplete' + JSON.stringify(body);

		let request;
		try {
			request = await api.request(context, cacheKey);
		} catch (err) {}

		expect(fetchfn).toHaveBeenCalled();

		fetchfn.mockClear();

		//handles 200s
		const fetchfn200 = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({ found: true }) } as unknown as Response));

		const setCache = jest.fn();
		const getCache = jest.fn(() => Promise.resolve({ foundInCache: true }));

		api.cache.set = setCache;
		api.cache.get = getCache;

		//no cache key
		try {
			request = await api.request(context);
		} catch (err) {}
		expect(fetchfn200).toHaveBeenCalled();
		expect(request).toEqual({ found: true });
		expect(setCache).not.toHaveBeenCalled();
		expect(getCache).not.toHaveBeenCalled();

		fetchfn200.mockClear();

		//with a cache key
		try {
			request = await api.request(context, cacheKey);
		} catch (err) {}

		expect(request).not.toEqual({ found: true });
		expect(request).toEqual({ foundInCache: true });

		expect(setCache).not.toHaveBeenCalled();
		expect(getCache).toHaveBeenCalled();

		fetchfn200.mockClear();

		//can handle 429s and retry correct amount of times.
		const fetchfn429 = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 429, json: () => Promise.resolve({ broken: true }) } as unknown as Response));

		try {
			expect(await api.request(context)).toThrow();
		} catch (err) {}

		expect(fetchfn429).toHaveBeenCalledTimes(config.maxRetry + 1);
	});
});
