import { UrlState, UrlTranslator, UrlTranslatorConfig, RangeValueProperties, UrlStateFilterType } from '../../types';

import Immutable from 'seamless-immutable';
import { ImmutableObject } from 'seamless-immutable';

type QueryParameter = {
	key: Array<string>;
	value: string;
};

type QueryParameterConfig = {
	queryParameter: string;
	urlRoot: string;
};

export class QueryStringTranslator implements UrlTranslator {
	private config: ImmutableObject<QueryParameterConfig>;

	constructor(config: UrlTranslatorConfig = {}) {
		this.config = Immutable({
			urlRoot: typeof config.urlRoot == 'string' ? config.urlRoot.replace(/\/$/, '') : '',
			queryParameter: typeof config.queryParameter == 'string' ? config.queryParameter : 'q',
			...config,
		});
	}

	bindExternalEvents(update: () => void): void {
		window.addEventListener('popstate', update);
	}

	getCurrentUrl(): string {
		return location.search || '';
	}

	getConfig(): QueryParameterConfig {
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

	protected generateQueryString(params: Array<QueryParameter>): string {
		const paramString = params.length
			? '?' +
			  params
					.map((param) => {
						return encodeURIComponent(param.key.join('.')) + '=' + encodeURIComponent(param.value);
					})
					.join('&')
			: this.config.urlRoot
			? ''
			: location.pathname;

		return `${this.config.urlRoot}${paramString}`;
	}

	protected parsePage(queryParams: Array<QueryParameter>): UrlState {
		const pageParam = queryParams.find((param) => param.key.length == 1 && param.key[0] == 'page');

		if (!pageParam) {
			return {};
		}

		const page = Number(pageParam.value);

		return !isNaN(page) && page > 1 ? { page } : {};
	}

	protected parseSort(queryParams: Array<QueryParameter>): UrlState {
		const sortParams = queryParams.filter((param) => param.key.length == 2 && param.key[0] == 'sort');

		if (!sortParams.length) {
			return {};
		}

		return {
			sort: sortParams.map((param) => ({
				field: param.key[1],
				direction: param.value,
			})),
		};
	}

	protected parseOther(queryParams: Array<QueryParameter>, except: Array<string> = []): UrlState {
		const state: UrlState = {};

		queryParams
			.filter((param) => except.indexOf(param.key[0]) == -1)
			.forEach((param) => {
				const path = param.key;
				const value = param.value;

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

	protected parseQuery(queryParams: Array<QueryParameter>): UrlState {
		const qParamKey: string = this.getConfig().queryParameter;

		const qParam = queryParams.find((param) => param.key.length == 1 && param.key[0] == qParamKey);

		return qParam ? { query: qParam.value } : {};
	}

	protected parseFilter(queryParams: Array<QueryParameter>): UrlState {
		const valueFilterParams = queryParams.filter((p) => p.key.length == 2 && p.key[0] == 'filter');
		const rangeFilterParams = queryParams.filter((p) => p.key.length == 3 && p.key[0] == 'filter');

		const valueFilters = valueFilterParams.reduce((state: UrlState, param: QueryParameter): UrlState => {
			const currentValue = (state.filter || {})[param.key[1]] || [];
			return {
				filter: {
					...state.filter,
					[param.key[1]]: [...(Array.isArray(currentValue) ? currentValue : [currentValue]), param.value],
				},
			};
		}, {});

		const rangeFilters = rangeFilterParams.reduce((state: UrlState, param: QueryParameter, index: number): UrlState => {
			// ranges should come in pairs!
			// use index to build pairs, ignore non pairs
			// build set as encountered - only return full sets (low + high)

			let newState = state;
			const nextRangeParam = rangeFilterParams[index + 1];
			if (
				index % 2 == 0 &&
				nextRangeParam &&
				nextRangeParam.key[1] == param.key[1] &&
				param.key[2] == RangeValueProperties.LOW &&
				nextRangeParam.key[2] == RangeValueProperties.HIGH
			) {
				const currentValue = (state.filter || {})[param.key[1]] || [];

				newState = {
					filter: {
						...state.filter,
						[param.key[1]]: [
							...(Array.isArray(currentValue) ? currentValue : [currentValue]),
							{
								[RangeValueProperties.LOW]: +param.value || null,
								[RangeValueProperties.HIGH]: +nextRangeParam.value || null,
							},
						],
					},
				};
			}

			return newState;
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

	protected encodePage(state: UrlState): Array<QueryParameter> {
		if (!state.page || state.page === 1) {
			return [];
		}

		return [{ key: ['page'], value: '' + state.page }];
	}

	protected encodeOther(state: UrlState, except: Array<string> = []): Array<QueryParameter> {
		let params: Array<QueryParameter> = [];

		const addRecursive = (obj: Record<string, any>, currentPath: Array<string>) => {
			Object.keys(obj).forEach((key) => {
				if (currentPath.length == 0 && except.indexOf(key) != -1) {
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

	protected encodeSort(state: UrlState): Array<QueryParameter> {
		if (!state.sort) {
			return [];
		}

		return (state.sort instanceof Array ? state.sort : [state.sort]).map((sort) => {
			return {
				key: ['sort', sort.field],
				value: sort.direction,
			};
		});
	}

	protected encodeFilter(state: UrlState): Array<QueryParameter> {
		if (!state.filter) {
			return [];
		}

		return Object.keys(state.filter).flatMap((key) => {
			if (!state.filter || !state.filter[key]) {
				return [];
			}

			const filter = state.filter[key];

			return (filter instanceof Array ? filter : [filter]).flatMap((value: UrlStateFilterType) => {
				if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
					return [
						{
							key: ['filter', key],
							value: '' + value,
						},
					];
				} else if (
					typeof value == 'object' &&
					typeof value[RangeValueProperties.LOW] != 'undefined' &&
					typeof value[RangeValueProperties.HIGH] != 'undefined'
				) {
					return [
						{
							key: ['filter', key, RangeValueProperties.LOW],
							value: '' + (value[RangeValueProperties.LOW] ?? '*'),
						},
						{
							key: ['filter', key, RangeValueProperties.HIGH],
							value: '' + (value[RangeValueProperties.HIGH] ?? '*'),
						},
					];
				}

				return [];
			});
		});
	}

	protected queryParamsToState(queryParams: Array<QueryParameter>): UrlState {
		// Todo: Special stage storage for sorts
		return {
			...this.parseQuery(queryParams),
			...this.parsePage(queryParams),
			...this.parseFilter(queryParams),
			...this.parseSort(queryParams),
			...this.parseOther(queryParams, ['page', this.getConfig().queryParameter, 'filter', 'sort']),
		};
	}

	protected stateToQueryParams(state: UrlState = {}): Array<QueryParameter> {
		return [
			...this.encodeQuery(state),
			...this.encodePage(state),
			...this.encodeFilter(state),
			...this.encodeSort(state),
			...this.encodeOther(state, ['page', 'query', 'filter', 'sort', this.getConfig().queryParameter]),
		];
	}

	serialize(state: UrlState): string {
		const queryParams = this.stateToQueryParams(state);

		return this.generateQueryString(queryParams);
	}

	deserialize(url: string): UrlState {
		const queryString = url.includes('?') ? (url.split('?').pop() || '').split('#').shift() || '' : '';

		const queryParams = this.parseQueryString(queryString);

		return this.queryParamsToState(queryParams);
	}

	go(url: string): void {
		history.pushState(null, '', url);
	}
}
