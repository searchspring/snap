import { UrlState, UrlTranslator, UrlStateSort } from '../../types';

import Immutable from 'seamless-immutable';
import { ImmutableArray } from 'seamless-immutable';

export enum LocationType {
	HASH = 'hash',
	SEARCH = 'search',
}

type LocationLookup = {
	[LocationType: string]: Array<string>;
};

type QueryParameter = {
	key: Array<string>;
	value: string;
};

type HashParameter = Array<string>;

type HashConfig = {
	queryParameter: string;
	urlRoot: string;
	parameters: {
		hash: ImmutableArray<string>;
		search: ImmutableArray<string>;
		implicit: LocationType;
	};
};

export class HybridTranslator implements UrlTranslator {
	private config: HashConfig;
	private detached = false;
	private lookup: LocationLookup = {};

	constructor(config: { queryParameter?: string; urlRoot?: string; parameters?: { hash?: Array<string>; search?: Array<string> } } = {}) {
		this.config = Immutable({
			urlRoot: typeof config.urlRoot == 'string' ? config.urlRoot : '',
			queryParameter: typeof config.queryParameter == 'string' ? config.queryParameter : 'q',
			parameters: {
				hash: Immutable(config.parameters?.hash || []),
				search: Immutable(config.parameters?.search || []),
				implicit: LocationType.HASH,
			},
		});

		this.lookup = {
			search: this.config.parameters.search.asMutable(),
			hash: this.config.parameters.hash.asMutable(),
		};
	}

	bindExternalEvents(update: () => void): void {
		window.addEventListener('popstate', update);
	}

	getCurrentUrl(): string {
		return location.search + location.hash;
	}

	getConfig(): HashConfig {
		return this.config;
	}

	protected parseQueryString(queryString: string): Array<QueryParameter> {
		const justQueryString = queryString.split('?').pop() || '';

		return justQueryString
			.split('&')
			.filter((v) => v)
			.map((kvPair) => {
				const [key, value] = kvPair.split('=').map((v) => decodeURIComponent(v));
				return { key: key.split('.'), value };
			});
	}

	protected parseHashString(hashString: string): Array<HashParameter> {
		const justHashString = hashString.split('#').pop() || '';

		return justHashString
			.split('/')
			.filter((v) => v)
			.map((hashEntries) => {
				return hashEntries.split(':').map((v) => decodeHashComponent(v));
			});
	}

	protected generateQueryString(queryParams: Array<QueryParameter>, hashParams: Array<HashParameter>): string {
		return (
			this.config.urlRoot +
			(queryParams.length
				? '?' +
				  queryParams
						.map((param) => {
							return encodeURIComponent(param.key.join('.')) + '=' + encodeURIComponent(param.value);
						})
						.join('&')
				: '') +
			(hashParams.length || !queryParams.length
				? '#/' +
				  hashParams
						.map((param) => {
							return param.map((v) => encodeHashComponent(v)).join(':');
						})
						.join('/')
				: '')
		);
	}

	protected parsePage(queryParams: Array<QueryParameter>): UrlState {
		const pageParam = queryParams.find((param) => param.key.length == 1 && param.key[0] == 'page');

		if (!pageParam) {
			return {};
		}

		const page = Number(pageParam.value);

		return !isNaN(page) && page > 1 ? { page } : {};
	}

	protected parseOther(queryParams: Array<QueryParameter>, except: Array<string> = []): UrlState {
		const state: UrlState = {};

		queryParams
			.filter((param) => except.indexOf(param.key[0]) == -1)
			.forEach((param) => {
				const path = param.key;
				const value = param.value;

				if (!this.lookup.search.includes(path[0])) {
					this.lookup.search.push(path[0]);
				}

				// eslint-disable-next-line prefer-const
				let node = state;

				path.forEach((key, i) => {
					const isLast = i == path.length - 1;

					if (isLast) {
						node[key] = node[key] || [];
						(node[key] as any[]).push(value);
					} else {
						node[key] = node[key] || {};
						(node as unknown) = node[key];
					}
				});
			});

		return state;
	}

	protected parseHashOther(hashParameters: Array<HashParameter>, except: Array<string> = []): UrlState {
		const state: UrlState = {};

		hashParameters
			.filter((param) => except.indexOf(param[0]) == -1) // sort, filter
			.forEach((param) => {
				const path = param.length > 1 ? param.slice(0, -1) : param;
				const value = param.length > 1 ? param[param.length - 1] : undefined;

				if (!this.lookup.hash.includes(path[0])) {
					this.lookup.hash.push(path[0]);
				}

				// eslint-disable-next-line prefer-const
				let node = state;

				path.forEach((key, i) => {
					const isLast = i == path.length - 1;

					if (isLast) {
						node[key] = node[key] || [];
						if (value) {
							(node[key] as any[]).push(value);
						}
					} else {
						node[key] = node[key] || {};
						(node as unknown) = node[key];
					}
				});
			});

		return state;
	}

	protected parseQuery(queryParams: Array<QueryParameter>): UrlState {
		const qParamKey: string = this.getConfig().queryParameter;

		const qParam = queryParams.find((param) => param.key.length == 1 && param.key[0] == qParamKey);

		return qParam ? { query: qParam.value } : {};
	}

	protected parseHashFilter(hashParameters: Array<HashParameter>): UrlState {
		const filters = hashParameters.filter((p) => p[0] == 'filter');

		return filters.reduce((state: UrlState, param: HashParameter): UrlState => {
			const [type, field, value] = param;

			return {
				filter: {
					...state.filter,
					[field]: [...((state.filter || {})[field] || []), value],
				},
			};
		}, {});
	}

	protected parseHashSort(hashParameters: Array<HashParameter>): UrlState {
		const sort = hashParameters.filter((p) => p[0] == 'sort');

		return sort.reduce((state: UrlState, param: HashParameter): UrlState => {
			const [type, field, direction] = param;

			const sortArray = state.sort ? (Array.isArray(state.sort) ? state.sort : [state.sort]) : [];

			return {
				sort: [...sortArray, { [field]: direction } as UrlStateSort],
			};
		}, {});
	}

	protected encodePage(state: UrlState): Array<QueryParameter> {
		if (!state.page || state.page === 1) {
			return [];
		}

		return [{ key: ['page'], value: '' + state.page }];
	}

	protected encodeQuery(state: UrlState): Array<QueryParameter> {
		if (!state.query) {
			return [];
		}

		return [
			{
				key: [this.getConfig().queryParameter],
				value: state.query,
			},
		];
	}

	protected encodeOther(state: UrlState, whitelist: Array<string> = []): Array<QueryParameter> {
		let params: Array<QueryParameter> = [];

		const addRecursive = (obj: Record<string, any>, currentPath: Array<string>) => {
			Object.keys(obj).forEach((key) => {
				if (currentPath.length == 0 && whitelist.indexOf(key) == -1) {
					return;
				}
				const value = obj[key];

				if (value instanceof Array) {
					params = params.concat(
						value.map((v) => {
							return { key: [...currentPath, key], value: v };
						})
					);
				} else if (typeof value == 'object') {
					addRecursive(value, [...currentPath, key]);
				} else {
					params = params.concat([{ key: [...currentPath, key], value }]);
				}
			});
		};

		addRecursive(state, []);

		return params;
	}

	protected encodeHashFilter(state: UrlState): Array<HashParameter> {
		if (!state.filter) {
			return [];
		}

		return Object.keys(state.filter).flatMap((key) => {
			if (!state.filter || !state.filter[key]) {
				return [];
			}

			const filter = state.filter[key];

			return filter.map((value: string) => {
				if (typeof value == 'string' || typeof value == 'number') {
					return ['filter', key, '' + value];
				}
				return [];
			});
		});
	}

	protected encodeHashSort(state: UrlState): Array<HashParameter> {
		if (!state.sort) {
			return [];
		}

		const sortArray = Array.isArray(state.sort) ? state.sort : [state.sort];

		return sortArray.map((sort: UrlStateSort) => {
			return ['sort', sort.field, sort.direction];
		});
	}

	protected encodeHashOther(state: UrlState, blacklist: Array<string> = []): Array<HashParameter> {
		let params: Array<HashParameter> = [];

		const addRecursive = (obj: Record<string, any>, currentPath: Array<string>) => {
			Object.keys(obj).forEach((key) => {
				if (currentPath.length == 0 && blacklist.indexOf(key) != -1) {
					return;
				}

				const value = obj[key];

				if (value instanceof Array && value.length) {
					params = params.concat(
						value.map((v) => {
							return [...currentPath, key, v];
						})
					);
				} else if (typeof value == 'object' && !Array.isArray(value)) {
					addRecursive(value, [...currentPath, key]);
				} else {
					params.push([...currentPath, key]);
				}
			});
		};

		addRecursive(state, []);

		return params;
	}

	protected queryParamsToState(queryParams: Array<QueryParameter>): UrlState {
		return {
			page: this.parsePage(queryParams).page,
			query: this.parseQuery(queryParams).query,
			...this.parseOther(queryParams, ['page', this.getConfig().queryParameter]),
		};
	}

	protected hashParamsToState(hashParameters: Array<HashParameter>): UrlState {
		return {
			sort: this.parseHashSort(hashParameters).sort,
			filter: this.parseHashFilter(hashParameters).filter,
			...this.parseHashOther(hashParameters, ['sort', 'filter']),
		};
	}

	protected stateToQueryParams(state: UrlState = {}): Array<QueryParameter> {
		const whitelist = this.lookup.search;

		return [...this.encodePage(state), ...this.encodeQuery(state), ...this.encodeOther(state, whitelist)];
	}

	protected stateToHashParams(state: UrlState = {}): Array<HashParameter> {
		const blacklist = ['page', 'query', 'filter', 'sort'].concat(this.lookup.search);

		return [...this.encodeHashFilter(state), ...this.encodeHashSort(state), ...this.encodeHashOther(state, blacklist)];
	}

	serialize(state: UrlState): string {
		const queryParams = this.stateToQueryParams(state);
		const hashParams = this.stateToHashParams(state);
		return this.generateQueryString(queryParams, hashParams);
	}

	deserialize(url: string): UrlState {
		const queryString = url.includes('?') ? (url.split('?').pop() || '').split('#').shift() || '' : '';
		const hashString = url.includes('#') ? url.split('#').pop() || '' : '';

		const queryParams = this.parseQueryString(queryString);
		const hashParams = this.parseHashString(hashString);

		const queryState = this.queryParamsToState(queryParams);
		const hashState = this.hashParamsToState(hashParams);

		return { ...queryState, ...hashState };
	}

	go(url: string): void {
		history.pushState(null, '', url);
	}
}

function decodeHashComponent(string: string): string {
	if (typeof string == 'string') {
		string = string.replace(/%2425/g, '$$25');
		string = string.replace(/\$25/g, '%');
		string = decodeURIComponent(string);
	}
	return string;
}

function encodeHashComponent(string: string): string {
	if (typeof string == 'string') {
		string = encodeURIComponent(string);
		string = string.replace(/%/g, '$$25');
	}

	return string;
}
