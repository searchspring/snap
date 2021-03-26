import { UrlState, UrlTranslator, UrlStateRangeValue } from '../../types';

import Immutable from 'seamless-immutable';

type QueryParameter = {
	key: Array<string>;
	value: string;
};

type QueryParameterConfig = {
	queryParameter: string;
	urlRoot: string;
};

export default class QueryStringTranslator implements UrlTranslator {
	private config: QueryParameterConfig;
	private detached = false;

	constructor(config: { queryParameter?: string; urlRoot?: string } = {}) {
		this.config = Immutable({
			urlRoot: typeof config.urlRoot == 'string' ? config.urlRoot : '',
			queryParameter: typeof config.queryParameter == 'string' ? config.queryParameter : 'q',
			...config,
			//urlRoot: '',
		});
	}

	bindExternalEvents(update: () => void): void {
		window.addEventListener('popstate', update);
	}

	getCurrentUrl(): string {
		return location.search || '';
	}

	getConfig(): QueryParameterConfig {
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

	protected generateQueryString(params: Array<QueryParameter>): string {
		return (
			this.config.urlRoot +
			(params.length || !this.config.urlRoot
				? '?' +
				  params
						.map((param) => {
							return encodeURIComponent(param.key.join('.')) + '=' + encodeURIComponent(param.value);
						})
						.join('&')
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
		const filters = queryParams.filter((p) => p.key.length == 2 && p.key[0] == 'filter');

		return filters.reduce((state: UrlState, param: QueryParameter): UrlState => {
			return {
				filter: {
					...state.filter,
					[param.key[1]]: [...((state.filter || {})[param.key[1]] || []), param.value],
				},
			};
		}, {});
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

	protected encodeFilter(state: UrlState): Array<QueryParameter> {
		if (!state.filter) {
			return [];
		}

		return Object.keys(state.filter).flatMap((key) => {
			if (!state.filter || !state.filter[key]) {
				return [];
			}

			const filter = state.filter[key];

			return filter.flatMap((value: string | number | UrlStateRangeValue) => {
				if (typeof value == 'string' || typeof value == 'number') {
					return [
						{
							key: ['filter', key],
							value: '' + value,
						},
					];
				} else if (typeof value == 'object') {
					const val = [
						...(value.low
							? [
									{
										key: ['filter', key, 'low'],
										value: '' + value.low,
									},
							  ]
							: []),

						...(value.high
							? [
									{
										key: ['filter', key, 'high'],
										value: '' + value.high,
									},
							  ]
							: []),
					];

					return val;
				}

				return [];
			});
		});
	}

	protected queryParamsToState(queryParams: Array<QueryParameter>): UrlState {
		// Todo: Special stage storage for sorts
		return {
			page: this.parsePage(queryParams).page,
			query: this.parseQuery(queryParams).query,
			filter: this.parseFilter(queryParams).filter,
			...this.parseOther(queryParams, ['page', this.getConfig().queryParameter, 'filter']),
		};
	}

	protected stateToQueryParams(state: UrlState = {}): Array<QueryParameter> {
		return [
			...this.encodePage(state),
			...this.encodeQuery(state),
			...this.encodeFilter(state),
			...this.encodeOther(state, ['page', 'query', 'filter', this.getConfig().queryParameter]),
		];
	}

	serialize(state: UrlState): string {
		const queryParams = this.stateToQueryParams(state);

		return this.generateQueryString(queryParams);
	}

	deserialize(url: string): UrlState {
		const queryString = url.split('?').pop() || '';

		const queryParams = this.parseQueryString(queryString);

		return this.queryParamsToState(queryParams);
	}

	go(url: string) {
		history.pushState(null, '', url);
	}
}
