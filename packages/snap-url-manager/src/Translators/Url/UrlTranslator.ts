import deepmerge from 'deepmerge';

import { UrlState, Translator, UrlStateSort, RangeValueProperties, UrlStateFilterType, ParamLocationType } from '../../types';

type UrlParameter = {
	key: Array<string>;
	value: string;
	type: ParamLocationType;
};

type MapOptions = {
	name?: string;
	type?: ParamLocationType;
};

type CoreMap = {
	query?: MapOptions;
	oq?: MapOptions;
	rq?: MapOptions;
	tag?: MapOptions;
	page?: MapOptions;
	pageSize?: MapOptions;
	sort?: MapOptions;
	filter?: MapOptions;
};

type CustomMap = {
	[param: string]: {
		type?: ParamLocationType;
	};
};

export type UrlTranslatorParametersConfig = {
	core?: CoreMap;
	custom?: CustomMap;
};

export type UrlTranslatorConfig = {
	urlRoot?: string;
	settings?: {
		corePrefix?: string;
		coreType?: ParamLocationType;
		customType?: ParamLocationType;
		rootParams?: boolean;
	};
	parameters?: UrlTranslatorParametersConfig;
};

const defaultConfig: UrlTranslatorConfig = {
	urlRoot: '',
	settings: {
		corePrefix: '',
		customType: ParamLocationType.HASH,
		rootParams: true,
	},
	parameters: {
		core: {
			query: { name: 'q', type: ParamLocationType.QUERY },
			oq: { name: 'oq', type: ParamLocationType.QUERY },
			rq: { name: 'rq', type: ParamLocationType.QUERY },
			tag: { name: 'tag', type: ParamLocationType.QUERY },
			page: { name: 'page', type: ParamLocationType.QUERY },
			pageSize: { name: 'pageSize', type: ParamLocationType.HASH },
			sort: { name: 'sort', type: ParamLocationType.HASH },
			filter: { name: 'filter', type: ParamLocationType.HASH },
		},
		custom: {},
	},
};

const CORE_FIELDS = ['query', 'oq', 'rq', 'tag', 'page', 'pageSize', 'sort', 'filter'];

export class UrlTranslator implements Translator {
	private config: UrlTranslatorConfig;
	private reverseMapping: Record<string, string> = {};

	constructor(config: UrlTranslatorConfig = {}) {
		this.config = deepmerge(defaultConfig, config);

		Object.keys(this.config.parameters.core).forEach((param) => {
			// param prefix
			if (this.config.settings.corePrefix) {
				this.config.parameters.core[param].name = this.config.settings.corePrefix + this.config.parameters.core[param].name;
			}

			// global type override
			const paramType = this.config.settings.coreType;
			if (paramType && Object.values(ParamLocationType).includes(paramType)) {
				this.config.parameters.core[param].type = (config?.parameters?.core && config?.parameters?.core[param]?.type) || paramType;
			}

			// create reverse mapping for quick lookup later
			this.reverseMapping[this.config.parameters.core[param].name] = param;
		});

		const implicit = this.config.settings.customType;
		if (implicit && !Object.values(ParamLocationType).includes(implicit)) {
			// invalid type specified - falling back to hash as implicit type
			this.config.settings.customType = ParamLocationType.HASH;
		}
	}

	bindExternalEvents(update: () => void): void {
		window.addEventListener('popstate', update);
	}

	getCurrentUrl(): string {
		return window.location.search + window.location.hash;
	}

	getConfig(): UrlTranslatorConfig {
		return deepmerge({}, this.config);
	}

	deserialize(url: string): UrlState {
		const params = this.parseUrlParams(url);

		return this.paramsToState(params);
	}

	protected parseUrlParams(url: string): Array<UrlParameter> {
		const queryString = url.includes('?') ? (url.split('?').pop() || '').split('#').shift() || '' : '';
		const hashString = url.includes('#') ? url.substring(url.indexOf('#') + 1) || '' : '';

		return [...this.parseHashString(hashString), ...this.parseQueryString(queryString)];
	}

	protected parseQueryString(queryString: string): Array<UrlParameter> {
		const justQueryString = queryString.split('?').pop() || '';

		return justQueryString
			.split('&')
			.filter((v) => v)
			.map((kvPair) => {
				const [key, value] = kvPair.split('=').map((v) => decodeURIComponent(v.replace(/\+/g, ' ')));
				return { key: key.split('.'), value, type: ParamLocationType.QUERY };
			})
			.filter((param) => {
				// remove core fields that do not contain a value
				const isCoreField = this.reverseMapping[param.key[0]];
				return !isCoreField || (isCoreField && param.value);
			});
	}

	protected parseHashString(hashString: string): Array<UrlParameter> {
		const params = [];
		const justHashString = hashString.split('#').join('/') || '';
		justHashString
			.split('/')
			.filter((v) => v)
			.map((hashEntries) => {
				return hashEntries.split(':').map((v) => decodeHashComponent(v));
			})
			.filter((param) => {
				// remove core fields that do not contain a value
				const [key, value] = param;
				const isCoreField = this.reverseMapping[key];
				return !isCoreField || (isCoreField && value);
			})
			.forEach((decodedHashEntries) => {
				if (decodedHashEntries.length == 1) {
					params.push({ key: [decodedHashEntries[0]], value: undefined, type: ParamLocationType.HASH });
				} else if (decodedHashEntries.length && decodedHashEntries.length <= 3) {
					const [value, ...keys] = decodedHashEntries.reverse();
					params.push({ key: keys.reverse(), value, type: ParamLocationType.HASH });
				} else if (decodedHashEntries.length && decodedHashEntries.length == 4) {
					// range filter
					const [path0, path1, low, high] = decodedHashEntries;
					params.push({ key: [path0, path1, 'low'], value: low, type: ParamLocationType.HASH });
					params.push({ key: [path0, path1, 'high'], value: high, type: ParamLocationType.HASH });
				}
			});

		return params;
	}

	// parse params into state

	protected paramsToState(params: Array<UrlParameter>): UrlState {
		const coreOtherParams = [],
			coreFilterParams = [],
			coreSortParams = [],
			otherParams = [];

		params?.forEach((param) => {
			const coreStateKey = this.reverseMapping[param.key[0]];
			const coreConfig: MapOptions = this.config.parameters.core[coreStateKey];
			const customStateKey: MapOptions = this.config.parameters.custom[param.key[0]];

			if (coreStateKey) {
				// core state
				switch (coreStateKey) {
					case 'filter': {
						if (coreConfig.type == param.type) coreFilterParams.push(param);
						break;
					}
					case 'sort': {
						if (coreConfig.type == param.type) coreSortParams.push(param);
						break;
					}
					default: {
						if (coreConfig.type == param.type) coreOtherParams.push(param);
						break;
					}
				}
			} else if (!CORE_FIELDS.includes(param.key[0])) {
				// custom state
				if (!customStateKey) {
					// unrecognized state - store in custom config map (as implicit type)
					this.config.parameters.custom[param.key[0]] = {
						type: param.type || this.config.settings.customType,
					};
				}

				otherParams.push(param);
			}
		});

		return {
			...this.parseCoreOther(coreOtherParams),
			...this.parseCoreFilter(coreFilterParams),
			...this.parseCoreSort(coreSortParams),
			...this.parseOther(otherParams),
		};
	}

	protected parseCoreOther(otherParams: Array<UrlParameter>): UrlState {
		const state: UrlState = {};
		const numberTypeParams = ['page', 'pageSize'];

		if (!otherParams) {
			return {};
		}

		otherParams.forEach((param) => {
			const coreKey = this.reverseMapping[param.key[0]];

			if (numberTypeParams.includes(coreKey)) {
				const numValue = Number(param.value);
				if (coreKey == 'page' && numValue > 1) {
					state[coreKey] = numValue;
				} else if (coreKey != 'page') {
					state[coreKey] = numValue;
				}
			} else {
				state[coreKey] = param.value;
			}
		});

		return state;
	}

	protected parseCoreFilter(filterParams: Array<UrlParameter>): UrlState {
		const valueFilterParams = filterParams.filter((p) => p.key.length == 2);
		const rangeFilterParams = filterParams.filter((p) => p.key.length == 3);

		const valueFilters = valueFilterParams.reduce((state: UrlState, param: UrlParameter): UrlState => {
			const currentValue = (state.filter || {})[param.key[1]] || [];
			return {
				filter: {
					...state.filter,
					[param.key[1]]: [...(Array.isArray(currentValue) ? currentValue : [currentValue]), param.value],
				},
			};
		}, {});

		const rangeFilters = rangeFilterParams.reduce((state: UrlState, param: UrlParameter, index: number): UrlState => {
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

	protected parseCoreSort(sortParams: Array<UrlParameter>): UrlState {
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

	protected parseOther(otherParams: Array<UrlParameter>): UrlState {
		const state: UrlState = {};

		otherParams.forEach((param) => {
			let node = state;

			param.key.forEach((key, i) => {
				const isLast = i == param.key.length - 1;

				if (isLast) {
					node[key] = node[key] || [];
					param.value && (node[key] as unknown[]).push(param.value);
				} else {
					node[key] = node[key] || {};
					(node as unknown) = node[key];
				}
			});
		});

		return state;
	}

	serialize(state: UrlState): string {
		const root = this.config.urlRoot.includes('?')
			? this.config.urlRoot.split('?')[0]
			: this.config.urlRoot.includes('#')
			? this.config.urlRoot.split('#')[0]
			: this.config.urlRoot || window.location.pathname;

		const rootUrlParams = this.config.settings.rootParams ? this.parseUrlParams(this.config.urlRoot) : [];
		const stateParams = this.stateToParams(state);
		const params = [...rootUrlParams, ...stateParams];
		const queryParams = params.filter((p) => p.type == ParamLocationType.QUERY);
		const hashParams = params.filter((p) => p.type == ParamLocationType.HASH);

		const queryParamString = queryParams.length
			? '?' +
			  queryParams
					.map((param) => {
						const keyString = encodeURIComponent(param.key.join('.'));
						const valueString = param.value ? '=' + encodeURIComponent(param.value) : '';
						return keyString + valueString;
					})
					.join('&')
			: '';

		const hashParamString = hashParams.length
			? '#/' +
			  hashParams
					.map((param) => {
						const keyString = param.key.map((k) => encodeHashComponent(k)).join(':');
						const valueString = param.value ? ':' + encodeHashComponent(param.value) : '';
						return keyString + valueString;
					})
					.join('/')
			: '';

		return `${root}${queryParamString}${hashParamString}`;
	}

	// encode state into params

	protected stateToParams(state: UrlState): Array<UrlParameter> {
		return [
			...this.encodeCoreOther(state, ['filter', 'sort']),
			...this.encodeCoreFilters(state),
			...this.encodeCoreSorts(state),
			...this.encodeOther(state),
		];
	}

	protected encodeCoreFilters(state: UrlState): Array<UrlParameter> {
		const filterConfig = this.config.parameters.core.filter;

		if (!state.filter || !filterConfig) {
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
							key: [filterConfig.name, key],
							value: '' + value,
							type: filterConfig.type,
						},
					];
				} else if (
					typeof value == 'object' &&
					typeof value[RangeValueProperties.LOW] != 'undefined' &&
					typeof value[RangeValueProperties.HIGH] != 'undefined'
				) {
					if (filterConfig.type == ParamLocationType.QUERY) {
						return [
							{
								key: [filterConfig.name, key, RangeValueProperties.LOW],
								value: '' + (value[RangeValueProperties.LOW] ?? '*'),
								type: filterConfig.type,
							},
							{
								key: [filterConfig.name, key, RangeValueProperties.HIGH],
								value: '' + (value[RangeValueProperties.HIGH] ?? '*'),
								type: filterConfig.type,
							},
						];
					} else if (filterConfig.type == ParamLocationType.HASH) {
						return [
							{
								key: [filterConfig.name, key, '' + (value[RangeValueProperties.LOW] ?? '*')],
								value: '' + (value[RangeValueProperties.HIGH] ?? '*'),
								type: filterConfig.type,
							},
						];
					}
				}

				return [];
			});
		});
	}

	protected encodeCoreSorts(state: UrlState): Array<UrlParameter> {
		const sortConfig = this.config.parameters.core.sort;

		if (!state.sort || !sortConfig) {
			return [];
		}

		return (state.sort instanceof Array ? state.sort : [state.sort]).map((sort) => {
			return {
				key: [sortConfig.name, sort.field],
				value: sort.direction,
				type: sortConfig.type,
			};
		});
	}

	protected encodeCoreOther(state: UrlState, except: string[]): Array<UrlParameter> {
		const params: Array<UrlParameter> = [];

		Object.keys(state)
			// sorting to determine order of params in URL
			.sort(function (a, b) {
				return CORE_FIELDS.indexOf(a) - CORE_FIELDS.indexOf(b);
			})
			.map((param) => {
				if (CORE_FIELDS.includes(param) && !except.includes(param)) {
					const paramConfig = this.config.parameters.core[param];
					if (param == 'page' && state[param] == 1) {
						// do not include page 1
					} else {
						params.push({ key: [paramConfig.name], value: '' + state[param], type: paramConfig.type });
					}
				}
			});

		return params;
	}

	protected encodeOther(state: UrlState): Array<UrlParameter> {
		let params: Array<UrlParameter> = [];

		const addRecursive = (obj: Record<string, unknown>, currentPath: Array<string>) => {
			Object.keys(obj).forEach((key) => {
				if (currentPath.length == 0 && CORE_FIELDS.includes(key)) {
					return;
				}

				const value = obj[key];

				if (value instanceof Array) {
					const customConfig = this.config.parameters.custom[currentPath[0] || key];
					const type = customConfig?.type || this.config.settings.customType;

					if (value.length) {
						params = params.concat(
							value.map((v) => {
								return { key: [...currentPath, key], value: v, type };
							})
						);
					} else {
						params = params.concat({ key: [...currentPath, key], value: undefined, type });
					}
				} else if (typeof value == 'object' && Object.keys(value).length) {
					addRecursive(value as Record<string, unknown>, [...currentPath, key]);
				} else {
					const customConfig = this.config.parameters.custom[currentPath[0] || key];
					const type = customConfig?.type || this.config.settings.customType;
					const stringValue = (typeof value == 'object' ? undefined : value) as string;
					params = params.concat([{ key: [...currentPath, key], value: stringValue, type }]);
				}
			});
		};

		addRecursive(state, []);

		return params;
	}

	go(url: string, config?: { history: string }): void {
		const currentUrl = this.getCurrentUrl();
		if (url != currentUrl) {
			if (config?.history == 'replace') {
				history.replaceState(null, '', url);
			} else {
				history.pushState(null, '', url);
			}
		}
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
