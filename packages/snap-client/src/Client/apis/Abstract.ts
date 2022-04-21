import { fibonacci } from '../utils/fibonacci';
import { NetworkCache } from '../NetworkCache/NetworkCache';
import { CacheConfig } from '../../types';

const isBlob = (value: any) => typeof Blob !== 'undefined' && value instanceof Blob;

export type Json = any;
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type HTTPHeaders = { [key: string]: string };
export type HTTPQuery = { [key: string]: string | number | null | boolean | Array<string | number | null | boolean> | HTTPQuery };
export type HTTPBody = Json | FormData | URLSearchParams;

export interface RequestOpts {
	path: string;
	method: HTTPMethod;
	headers: HTTPHeaders;
	query?: HTTPQuery;
	body?: HTTPBody;
}

export class API {
	private retryDelay = 1000;
	private retryCount = 0;

	public cache: NetworkCache;

	constructor(protected configuration: ApiConfiguration) {
		this.cache = new NetworkCache(configuration.cache);
	}

	protected async request(context: RequestOpts, cacheKey?: any): Promise<Response> {
		const { url, init } = this.createFetchParams(context);

		if (cacheKey) {
			const cachedResponse = this.cache.get(cacheKey);
			if (cachedResponse) {
				this.retryCount = 0; // reset count and delay incase rate limit occurs again before a page refresh
				this.retryDelay = 1000;
				return cachedResponse;
			}
		}

		const response = await this.fetchApi(url, init);
		const responseJSON = await response.json();
		if (response.status >= 200 && response.status < 300) {
			this.retryCount = 0; // reset count and delay incase rate limit occurs again before a page refresh
			this.retryDelay = 1000;
			if (cacheKey) {
				// save in the cache before returning
				this.cache.set(cacheKey, responseJSON);
			}
			return responseJSON;
		} else if (response.status == 429) {
			if (this.retryCount < this.configuration.maxRetry) {
				await new Promise((resolve) => setTimeout(resolve, this.retryDelay)); // delay retry
				this.retryDelay = fibonacci(this.retryCount) * 1000;
				this.retryCount++;
				return await this.request(context, cacheKey);
			} else {
				throw response.status;
			}
		}
		throw response.status;
	}

	private createFetchParams(context: RequestOpts) {
		// grab siteID out of context to generate apiHost fo URL
		const siteId = context?.body?.siteId || context?.query?.siteId;
		if (!siteId) {
			throw new Error(`Request failed. Missing "siteId" parameter.`);
		}

		const siteIdHost = `https://${siteId}.a.searchspring.io`;
		const origin = (this.configuration.origin || siteIdHost).replace(/\/$/, '');

		let url = `${origin}/${context.path.replace(/^\//, '')}`;

		if (context.query !== undefined && Object.keys(context.query).length !== 0) {
			// only add the querystring to the URL if there are query parameters.
			url += '?' + this.configuration.queryParamsStringify(context.query);
		}

		const body =
			(typeof FormData !== 'undefined' && context.body instanceof FormData) || context.body instanceof URLSearchParams || isBlob(context.body)
				? context.body
				: JSON.stringify(context.body);

		const headers = Object.assign({}, this.configuration.headers, context.headers);
		const init = {
			method: context.method,
			headers: headers,
			body,
		};
		return { url, init };
	}

	private fetchApi = async (url: string, init: RequestInit) => {
		const response = await this.configuration.fetchApi(url, init);

		return response;
	};
}

export type FetchAPI = WindowOrWorkerGlobalScope['fetch'];

export interface ApiConfigurationParameters {
	origin?: string; // override url origin
	fetchApi?: FetchAPI; // override for fetch implementation
	queryParamsStringify?: (params: HTTPQuery) => string; // stringify function for query strings
	headers?: HTTPHeaders; //header params we want to use on every request
	maxRetry?: number;
	cache?: CacheConfig;
}

export class ApiConfiguration {
	constructor(private configuration: ApiConfigurationParameters) {
		if (!configuration.maxRetry) {
			this.configuration.maxRetry = 8;
		}
	}

	get cache(): CacheConfig {
		return this.configuration?.cache || {};
	}

	get maxRetry(): number {
		return this.configuration.maxRetry || 8;
	}

	get origin(): string {
		return this.configuration.origin || '';
	}

	get fetchApi(): FetchAPI {
		return this.configuration.fetchApi || window.fetch.bind(window);
	}

	get queryParamsStringify(): (params: HTTPQuery) => string {
		return this.configuration.queryParamsStringify || querystring;
	}

	get headers(): HTTPHeaders | undefined {
		return this.configuration.headers;
	}
}

export function querystring(params: HTTPQuery, prefix = ''): string {
	return Object.keys(params)
		.map((key) => {
			const fullKey = prefix + (prefix.length ? `[${key}]` : key);
			const value = params[key];
			if (value instanceof Array) {
				const multiValue = value.map((singleValue) => encodeURIComponent(String(singleValue))).join(`&${encodeURIComponent(fullKey)}=`);
				return `${encodeURIComponent(fullKey)}=${multiValue}`;
			}
			if (value instanceof Date) {
				return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value.toISOString())}`;
			}
			if (value instanceof Object) {
				return querystring(value as HTTPQuery, fullKey);
			}
			return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
		})
		.filter((part) => part.length > 0)
		.join('&');
}
