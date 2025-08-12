import deepmerge from 'deepmerge';
import { AppMode, version } from '@searchspring/snap-toolbox';

import { fibonacci } from '../utils/fibonacci';
import { NetworkCache } from '../NetworkCache/NetworkCache';
import { CacheConfig, HTTPHeaders, GenericGlobals } from '../../types';

const isBlob = (value: any) => typeof Blob !== 'undefined' && value instanceof Blob;

export type Json = any;
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
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

	constructor(public configuration: ApiConfiguration) {
		this.cache = new NetworkCache(this.configuration.cache);
	}

	protected get mode(): AppMode {
		return this.configuration.mode;
	}

	protected async request<T>(context: RequestOpts, cacheKey?: string): Promise<T> {
		const { url, init } = this.createFetchParams(context);

		if (cacheKey) {
			const cachedResponse = this.cache.get(`${context.path}/${cacheKey}`) || this.cache.get(`${context.path}/*`);
			if (cachedResponse) {
				this.retryCount = 0; // reset count and delay incase rate limit occurs again before a page refresh
				this.retryDelay = 1000;

				// TEMPORARY - used to resolve issue with recommendations response being an array... to be removed after render events are removed
				if (Array.isArray(cachedResponse)) {
					cachedResponse.forEach((response) => {
						// @ts-ignore - temporary to be removed when auto beaconing is implemented
						response._cached = true;
					});
				} else {
					// @ts-ignore - temporary to be removed when auto beaconing is implemented
					cachedResponse._cached = true;
				}

				return cachedResponse as T;
			}
		}
		let response;
		let responseJSON;

		try {
			response = await this.fetchApi(url, init);
			responseJSON = await response?.json();

			if (response.status >= 200 && response.status < 300) {
				this.retryCount = 0; // reset count and delay incase rate limit occurs again before a page refresh
				this.retryDelay = 1000;
				if (cacheKey) {
					// save in the cache before returning
					this.cache.set(`${context.path}/${cacheKey}`, responseJSON);
				}
				return responseJSON;
			} else if (response.status == 429) {
				if (this.retryCount < this.configuration.maxRetry) {
					await new Promise((resolve) => setTimeout(resolve, this.retryDelay)); // delay retry
					this.retryDelay = fibonacci(this.retryCount) * 1000;
					this.retryCount++;
					throw new Error('Rate limited.');
				} else {
					throw new Error('Retry rate limit exceeded.');
				}
			} else if (response.status == 404 && responseJSON?.message == 'Profile is currently paused') {
				//dont throw if profile is paused.
				throw new Error(`${responseJSON.message}: ${context.query?.tag}`);
			}

			throw new Error('Unexpected Response Status.');
		} catch (err: any) {
			if (err.message == 'Rate limited.') {
				return await this.request(context, cacheKey);
			}

			// throw an object with fetch details
			throw { err, fetchDetails: { status: response?.status, message: response?.statusText || 'FAILED', url, ...init } };
		}
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

		// merging globals to request query
		const combinedQuery = deepmerge(context.query || {}, this.configuration.globals);
		if (Object.keys(combinedQuery).length !== 0) {
			// only add the querystring to the URL if there are query parameters.
			url += '?' + this.configuration.queryParamsStringify(combinedQuery);
		}

		// merging globals to request body
		const body =
			(typeof FormData !== 'undefined' && context.body instanceof FormData) || context.body instanceof URLSearchParams || isBlob(context.body)
				? context.body
				: JSON.stringify(context.body ? deepmerge(context.body, this.configuration.globals) : context.body);

		const headers = { ...this.configuration.headers, ...context.headers };

		const init = {
			method: context.method,
			headers: headers,
			body,
		};

		return { url, init };
	}

	private async fetchApi(url: RequestInfo, init?: RequestInit): Promise<Response> {
		const response = await this.configuration.fetchApi(url, init);

		return response;
	}
}

export type FetchAPI = WindowOrWorkerGlobalScope['fetch'];

export interface ApiConfigurationParameters {
	mode?: keyof typeof AppMode | AppMode;
	initiator?: string;
	origin?: string; // override url origin
	fetchApi?: FetchAPI; // override for fetch implementation
	queryParamsStringify?: (params: HTTPQuery) => string; // stringify function for query strings
	headers?: HTTPHeaders; //header params we want to use on every request
	maxRetry?: number;
	cache?: CacheConfig;
	globals?: GenericGlobals;
}

export class ApiConfiguration {
	constructor(private config: ApiConfigurationParameters = {}) {
		if (!config.maxRetry) {
			this.config.maxRetry = 8;
		}

		this.config.cache = this.config.cache || {};
		this.config.mode = this.config.mode || AppMode.production;

		if (this.config.mode == AppMode.development) {
			this.config.cache.enabled = false;
		}
	}

	get cache(): CacheConfig {
		return this.config?.cache || {};
	}

	get maxRetry(): number {
		return this.config.maxRetry || 8;
	}

	get origin(): string {
		return this.config.origin || '';
	}

	get initiator(): string {
		return this.config.initiator || `snap/client/${version}`;
	}

	get fetchApi(): FetchAPI {
		return this.config.fetchApi || (typeof window !== 'undefined' ? window.fetch?.bind(window) : fetch);
	}

	get queryParamsStringify(): (params: HTTPQuery) => string {
		return this.config.queryParamsStringify || querystring;
	}

	get headers(): HTTPHeaders {
		return this.config.headers || {};
	}

	set headers(newHeaders: HTTPHeaders) {
		this.config.headers = newHeaders;
	}

	get globals(): GenericGlobals {
		return this.config.globals || {};
	}

	set globals(newGlobals: GenericGlobals) {
		this.config.globals = newGlobals;
	}

	get mode(): AppMode {
		return this.config.mode! as AppMode;
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
