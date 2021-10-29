import { fibonacci } from '../utils/fibonacci';

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
	private retryCount = 1;

	constructor(protected configuration: ApiConfiguration) {
		// nothing else todo
	}

	protected async request(context: RequestOpts): Promise<Response> {
		const { url, init } = this.createFetchParams(context);
		const response = await this.fetchApi(url, init);
		if (response.status >= 200 && response.status < 300) {
			this.retryCount = 0; // reset count and delay incase rate limit occurs again before a page refresh
			this.retryDelay = 1000;
			return response;
		} else if (response.status == 429) {
			if (this.retryCount < this.configuration.maxRetry) {
				await new Promise((resolve) => setTimeout(resolve, this.retryDelay)); // delay retry
				this.retryDelay = fibonacci(this.retryCount) * 1000;
				this.retryCount++;
				return await this.request(context);
			} else {
				throw response.status;
			}
		}
		throw response.status;
	}

	private createFetchParams(context: RequestOpts) {
		let url = this.configuration.basePath + context.path;
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
	siteId: string;
	basePath?: string; // override base path
	fetchApi?: FetchAPI; // override for fetch implementation
	queryParamsStringify?: (params: HTTPQuery) => string; // stringify function for query strings
	headers?: HTTPHeaders; //header params we want to use on every request
	maxRetry?: number;
}

export class ApiConfiguration {
	public maxRetry = 8;

	constructor(private configuration: ApiConfigurationParameters) {
		const apiHost = `https://${configuration.siteId}.a.searchspring.io`;
		configuration.basePath = configuration.basePath || apiHost;
		if (configuration.maxRetry) {
			this.maxRetry = configuration.maxRetry;
		}
	}

	getSiteId(): string {
		return this.configuration.siteId;
	}

	get basePath(): string {
		return this.configuration.basePath;
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
