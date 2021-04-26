import { UrlState, Translator, TranslatorConfig, UrlStateSort, RangeValueProperties, UrlStateFilterType } from '../../types';

import Immutable from 'seamless-immutable';
import { ImmutableObject, ImmutableArray } from 'seamless-immutable';

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

type Config = {
	queryParameter: string;
	urlRoot: string;
	parameters: {
		hash: ImmutableArray<string>;
		search: ImmutableArray<string>;
		implicit: LocationType;
	};
};

interface UrlTranslatorConfig extends TranslatorConfig {
	parameters?: {
		hash?: Array<string>;
		search?: Array<string>;
	};
}

export class UrlTranslator implements Translator {
	private config: ImmutableObject<Config>;
	private lookup: LocationLookup = {};

	constructor(config: UrlTranslatorConfig = {}) {
		this.config = Immutable({
			urlRoot: typeof config.urlRoot == 'string' ? config.urlRoot.replace(/\/$/, '') : '',
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

	getConfig(): Config {
		return this.config.asMutable();
	}

	protected parseQueryString(queryString: string): Array<QueryParameter> {
		const justQueryString = queryString.split('?').pop() || '';

		return justQueryString
			.split('&')
			.filter((v) => v)
			.map((kvPair) => {
				const [key, value] = kvPair.split('=').map((v) => decodeURIComponent(v.replace(/\+/g, ' ')));
				return { key: key.split('.'), value };
			});
	}

	protected generateQueryString(queryParams: Array<QueryParameter>, hashParams: Array<HashParameter>): string {
		const paramString =
			(queryParams.length
				? '?' +
				  queryParams
						.map((param) => {
							return encodeURIComponent(param.key.join('.')) + '=' + encodeURIComponent(param.value);
						})
						.join('&')
				: this.config.urlRoot
				? ''
				: location.pathname) +
			(hashParams.length
				? '#/' +
				  hashParams
						.map((param) => {
							return param.map((v) => encodeHashComponent(v)).join(':');
						})
						.join('/')
				: '');

		return `${this.config.urlRoot}${paramString}`;
	}

	protected parseHashString(hashString: string): Array<HashParameter> {
		const justHashString = hashString.split('#').join('/') || '';

		return justHashString
			.split('/')
			.filter((v) => v)
			.map((hashEntries) => {
				return hashEntries.split(':').map((v) => decodeHashComponent(v));
			});
	}

	protected parseQuery(queryParams: Array<QueryParameter>): UrlState {
		const qParamKey: string = this.getConfig().queryParameter;

		const qParam = queryParams.find((param) => param.key.length == 1 && param.key[0] == qParamKey);

		return qParam ? { query: qParam.value } : {};
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

	protected parseHashFilter(hashParameters: Array<HashParameter>): UrlState {
		const filters = hashParameters.filter((p) => p[0] == 'filter');
		const valueFilterParams = filters.filter((p) => p.length == 3);
		const rangeFilterParams = filters.filter((p) => p.length == 4);

		const valueFilters = valueFilterParams.reduce((state: UrlState, param: HashParameter): UrlState => {
			const [type, field, value] = param;
			const currentValue = (state.filter || {})[field] || [];

			return {
				filter: {
					...state.filter,
					[field]: [...(Array.isArray(currentValue) ? currentValue : [currentValue]), value],
				},
			};
		}, {});

		const rangeFilters = rangeFilterParams.reduce((state: UrlState, param: HashParameter): UrlState => {
			// ranges should come as single param
			// use index to build pairs, ignore non pairs
			// build set as encountered - only return full sets (low + high)

			const [type, field, low, high] = param;
			const currentState = (state.filter || {})[field] || [];

			return {
				filter: {
					...state.filter,
					[field]: [
						...(Array.isArray(currentState) ? currentState : [currentState]),
						{
							[RangeValueProperties.LOW]: +low || null,
							[RangeValueProperties.HIGH]: +high || null,
						},
					],
				},
			};
		}, {});

		return {
			...(valueFilters.filter || rangeFilters.filter
				? {
						filter: {
							...valueFilters.filter,
							...rangeFilters.filter,
						},
				  }
				: {}),
		};
	}

	protected parseHashSort(hashParameters: Array<HashParameter>): UrlState {
		const sort = hashParameters.filter((p) => p[0] == 'sort');

		return sort.reduce((state: UrlState, param: HashParameter): UrlState => {
			const [type, field, direction] = param;

			const sortArray = state.sort ? (Array.isArray(state.sort) ? state.sort : [state.sort]) : [];

			return {
				sort: [...sortArray, { field, direction } as UrlStateSort],
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
				} else if (typeof value != 'undefined') {
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

			return (filter instanceof Array ? filter : [filter]).flatMap(
				(value: UrlStateFilterType): Array<HashParameter> => {
					if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
						return [['filter', key, '' + value]];
					} else if (
						typeof value == 'object' &&
						typeof value[RangeValueProperties.LOW] != 'undefined' &&
						typeof value[RangeValueProperties.HIGH] != 'undefined'
					) {
						return [['filter', key, '' + (value[RangeValueProperties.LOW] ?? '*'), '' + (value[RangeValueProperties.HIGH] ?? '*')]];
					}

					return [];
				}
			);
		});
	}

	protected encodeHashSort(state: UrlState): Array<HashParameter> {
		if (!state.sort) {
			return [];
		}

		return (state.sort instanceof Array ? state.sort : [state.sort]).map((sort: UrlStateSort) => {
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
				} else if (typeof value != 'undefined' && !Array.isArray(value)) {
					params.push([...currentPath, key, value]);
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
			...this.parseQuery(queryParams),
			...this.parsePage(queryParams),
			...this.parseOther(queryParams, ['page', this.getConfig().queryParameter]),
		};
	}

	protected hashParamsToState(hashParameters: Array<HashParameter>): UrlState {
		return {
			...this.parseHashOther(hashParameters, ['page', 'query', this.config.queryParameter, 'filter', 'sort', ...this.lookup.search]),
			...this.parseHashFilter(hashParameters),
			...this.parseHashSort(hashParameters),
		};
	}

	protected stateToQueryParams(state: UrlState = {}): Array<QueryParameter> {
		const whitelist = this.lookup.search;

		return [...this.encodeQuery(state), ...this.encodePage(state), ...this.encodeOther(state, whitelist)];
	}

	protected stateToHashParams(state: UrlState = {}): Array<HashParameter> {
		return [
			...this.encodeHashFilter(state),
			...this.encodeHashSort(state),
			...this.encodeHashOther(state, ['page', 'query', this.config.queryParameter, 'filter', 'sort', ...this.lookup.search]),
		];
	}

	serialize(state: UrlState): string {
		const queryParams = this.stateToQueryParams(state);
		const hashParams = this.stateToHashParams(state);

		return this.generateQueryString(queryParams, hashParams);
	}

	deserialize(url: string): UrlState {
		const queryString = url.includes('?') ? (url.split('?').pop() || '').split('#').shift() || '' : '';
		const hashString = url.includes('#') ? url.substring(url.indexOf('#') + 1) || '' : '';

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
