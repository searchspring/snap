import 'whatwg-fetch';
import { API, ApiConfiguration, ApiConfigurationParameters } from './Abstract';
import { HTTPHeaders } from '../../types';

describe('ApiConfiguration', () => {
	it('has default configurations', () => {
		const configuration = new ApiConfiguration();
		expect(configuration.maxRetry).toBe(8);
		expect(configuration.mode).toBe('production');
	});

	it('can be set with other configurations', () => {
		const customHeaders: HTTPHeaders = {
			customheader: 'customkey',
		};

		const customCacheConfig = {
			ttl: 2222,
			enabled: false,
			maxSize: 4, // KB
			purgeable: false,
		};

		const customQueryParamsStringify = () => {
			return 'custom';
		};

		const config: ApiConfigurationParameters = {
			mode: 'development',
			origin: 'https://searchspring.com',
			fetchApi: global.window.fetch,
			queryParamsStringify: customQueryParamsStringify,
			headers: customHeaders,
			maxRetry: 2,
			cache: customCacheConfig,
		};

		const configuration = new ApiConfiguration(config);
		expect(configuration.mode).toBe('development');
		expect(configuration.origin).toBe(config.origin);
		expect(configuration.fetchApi).toBe(config.fetchApi);
		expect(configuration.queryParamsStringify).toBe(config.queryParamsStringify);
		expect(configuration.headers).toBe(config.headers);
		expect(configuration.maxRetry).toBe(config.maxRetry);
		expect(configuration.cache).toBe(config.cache);
	});
});

describe('Abstract Api', () => {
	it('has expected default values', () => {
		const api = new API(new ApiConfiguration());

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
		expect(api.configuration.config.maxRetry).toBe(8);

		// @ts-ignore
		expect(api.retryDelay).toEqual(1000);

		// @ts-ignore
		expect(api.retryCount).toEqual(0);

		expect(api.cache).toBeDefined();

		// @ts-ignore
		expect(api.request).toBeDefined();

		// @ts-ignore
		expect(api.createFetchParams).toBeDefined();

		// @ts-ignore
		expect(api.fetchApi).toBeDefined();
	});

	const customHeaders: HTTPHeaders = {
		customheader: 'customkey',
	};

	const CustomCacheConfig = {
		ttl: 2222,
		enabled: false,
		maxSize: 4, // KB
		purgeable: false,
	};

	// set up
	const fetchfn = jest
		.spyOn(global.window, 'fetch')
		.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve() } as Response));

	it('can pass in all the props', async () => {
		const config: ApiConfigurationParameters = {
			origin: 'https://searchspring.com',
			fetchApi: global.window.fetch,
			headers: customHeaders,
			maxRetry: 2,
			cache: CustomCacheConfig,
		};

		// end set up

		const api = new API(new ApiConfiguration(config));

		//has correct values
		expect(api?.cache).toEqual({
			config: {
				...CustomCacheConfig,
			},
			memoryCache: {},
		});

		//these are private and typescript isnt happy about us testing them.
		// @ts-ignore
		expect(api?.configuration?.origin).toBe(config.origin);
		// @ts-ignore
		expect(api?.configuration?.maxRetry).toBe(config.maxRetry);
		// @ts-ignore
		expect(api?.configuration?.cache).toBe(config.cache);
		// @ts-ignore
		expect(api?.configuration?.headers).toBe(config.headers);

		//can use passed in fetch function
		// @ts-ignore
		await api.fetchApi();

		expect(fetchfn).toHaveBeenCalled();

		//reset
		fetchfn.mockClear();
	});

	it('can pass pass in queryParamsStringify', async () => {
		const queryParamMockfn = jest.fn(() => 'here');

		const config: ApiConfigurationParameters = {
			origin: 'https://searchspring.com',
			fetchApi: global.window.fetch,
			queryParamsStringify: queryParamMockfn,
		};

		// end set up

		const api = new API(new ApiConfiguration(config));

		//can use query params stringify
		// @ts-ignore
		expect(api?.configuration?.queryParamsStringify(['string', 'thing'])).toBe('here');
		expect(queryParamMockfn).toHaveBeenCalled();
	});

	it('can use createFetchParams', async () => {
		const config: ApiConfigurationParameters = {
			origin: 'https://searchspring.com',
			fetchApi: global.window.fetch,
			headers: customHeaders,
		};

		// end set up
		const api = new API(new ApiConfiguration(config));

		const body = { siteId: '8uyt2m' };
		const context = {
			path: '/api/v1/autocomplete',
			method: 'POST',
			headers: config.headers,
			body: body,
		};

		//can use createFetchParams and get back expected values
		//@ts-ignore
		const fetchParams = api.createFetchParams(context);
		expect(fetchParams).toBeDefined();
		expect(fetchParams.url).toBe(`${config.origin}/api/v1/autocomplete`);
		expect(fetchParams.init.body).toBe(JSON.stringify(body));
		expect(fetchParams.init.headers).toStrictEqual(customHeaders);
		expect(fetchParams.init.method).toBe('POST');

		//create fetch params requires a site id
		const badContext = { ...context, body: {} };
		//@ts-ignore
		expect(() => api.createFetchParams(badContext)).toThrowError(`Request failed. Missing "siteId" parameter.`);

		const config2: ApiConfigurationParameters = {
			origin: 'https://searchspring.com',
			fetchApi: global.window.fetch,
			headers: customHeaders,
			maxRetry: 2,
			cache: CustomCacheConfig,
		};
		const api2 = new API(new ApiConfiguration(config2));

		const contextWithQuery = { ...context, query: { key: 'value' } };
		// @ts-ignore
		const params = api2.createFetchParams(contextWithQuery);
		expect(params.url).toBe('https://searchspring.com/api/v1/autocomplete?key=value');
	});

	it('can handle subDomain parameter in createFetchParams', async () => {
		const config: ApiConfigurationParameters = {
			fetchApi: global.window.fetch,
			headers: customHeaders,
		};

		const api = new API(new ApiConfiguration(config));

		const body = { siteId: '8uyt2m' };
		const contextWithSubDomain = {
			path: '/api/v1/autocomplete',
			method: 'POST',
			headers: config.headers,
			body: body,
			subDomain: 'test',
		};

		// test with subDomain - should generate URL with subdomain in the path
		// @ts-ignore - private method
		const fetchParamsWithSubDomain = api.createFetchParams(contextWithSubDomain);
		expect(fetchParamsWithSubDomain.url).toBe('https://8uyt2m.a.test.searchspring.io/api/v1/autocomplete');

		// test without subDomain - should generate URL without subdomain
		const contextWithoutSubDomain = {
			path: '/api/v1/autocomplete',
			method: 'POST',
			headers: config.headers,
			body: body,
		};

		// @ts-ignore - private method
		const fetchParamsWithoutSubDomain = api.createFetchParams(contextWithoutSubDomain);
		expect(fetchParamsWithoutSubDomain.url).toBe('https://8uyt2m.a.searchspring.io/api/v1/autocomplete');

		// test with custom origin and subDomain - origin should take precedence
		const configWithOrigin: ApiConfigurationParameters = {
			origin: 'https://custom-origin.com',
			fetchApi: global.window.fetch,
			headers: customHeaders,
		};

		const apiWithOrigin = new API(new ApiConfiguration(configWithOrigin));

		// @ts-ignore - private method
		const fetchParamsWithOrigin = apiWithOrigin.createFetchParams(contextWithSubDomain);
		expect(fetchParamsWithOrigin.url).toBe('https://custom-origin.com/api/v1/autocomplete');
	});

	it('can use cacheKey', async () => {
		const config: ApiConfigurationParameters = {
			origin: 'https://searchspring.com',
			fetchApi: global.window.fetch,
			headers: customHeaders,
		};

		const api = new API(new ApiConfiguration(config));

		const body = { siteId: '8uyt2m' };
		const context = {
			path: '/api/v1/autocomplete',
			method: 'POST',
			headers: config.headers,
			body: body,
		};

		//can use the cacheKey
		const cacheKey = '/api/v1/autocomplete' + JSON.stringify(body);

		let request;
		//@ts-ignore
		request = await api.request(context, cacheKey);

		expect(fetchfn).toHaveBeenCalled();

		fetchfn.mockClear();

		//handles 200s
		const fetchfn200 = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 200, json: () => Promise.resolve({ found: true }) } as Response));

		const setCacheSpy = jest.spyOn(api.cache, 'set');
		const getCacheSpy = jest.spyOn(api.cache, 'get').mockImplementation(() => Promise.resolve({ foundInCache: true }) as unknown as Response);

		//no cache key
		//@ts-ignore
		request = await api.request(context);
		expect(fetchfn200).toHaveBeenCalled();
		expect(request).toEqual({ found: true });
		expect(setCacheSpy).not.toHaveBeenCalled();
		expect(getCacheSpy).not.toHaveBeenCalled();

		fetchfn200.mockClear();

		//with a cache key
		//@ts-ignore
		request = await api.request(context, cacheKey);

		expect(request).not.toEqual({ found: true });
		expect(request).toEqual({ foundInCache: true });

		expect(setCacheSpy).not.toHaveBeenCalled();
		expect(getCacheSpy).toHaveBeenCalled();

		fetchfn200.mockClear();
	});

	it('can handle 429s', async () => {
		const config: ApiConfigurationParameters = {
			origin: 'https://searchspring.com',
			fetchApi: global.window.fetch,
			headers: customHeaders,
			maxRetry: 2,
		};

		const api = new API(new ApiConfiguration(config));

		const body = { siteId: '8uyt2m' };
		const context = {
			path: '/api/v1/autocomplete',
			method: 'POST',
			headers: config.headers,
			body: body,
		};

		//can handle 429s and retry correct amount of times.
		const fetchfn429 = jest
			.spyOn(global.window, 'fetch')
			.mockImplementation(() => Promise.resolve({ status: 429, json: () => Promise.resolve({ broken: true }) } as Response));

		await expect(async () => {
			//@ts-ignore
			await api.request(context);
		}).rejects.toStrictEqual({
			err: new Error('Retry rate limit exceeded.'),
			fetchDetails: {
				body: '{"siteId":"8uyt2m"}',
				headers: { customheader: 'customkey' },
				message: 'FAILED',
				method: 'POST',
				status: 429,
				url: 'https://searchspring.com/api/v1/autocomplete',
			},
		});

		expect(fetchfn429).toHaveBeenCalledTimes((config.maxRetry || 0) + 1);
	});
});
