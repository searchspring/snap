import type { UrlState, UrlStateFilter, UrlStateRangeValue } from '@searchspring/snap-url-manager';
import { initialUrlConfig } from '../types';
import deepmerge from 'deepmerge';

export const setInitialUrlState = (intitialStateConfig: initialUrlConfig, _initialUrlState: UrlState) => {
	let { ignoreList } = intitialStateConfig;
	const { state } = intitialStateConfig;

	if (state) {
		const { sort, filter, page, pageSize } = state;

		ignoreList = (ignoreList || []).concat(['query', 'tag']);

		if (!Object.keys(_initialUrlState).filter((key) => ignoreList!.indexOf(key) == -1).length) {
			let initialUrlState = { ..._initialUrlState };

			if (page) {
				initialUrlState.page = page;
			}

			if (pageSize) {
				initialUrlState.pageSize = pageSize;
			}

			if (sort) {
				initialUrlState.sort = sort;
			}

			if (filter) {
				if (initialUrlState.filter) {
					Object.keys(filter).map((filterField) => {
						const baseKey = 'filter';

						//is it a range type?
						if (Object.keys(filter![filterField]).indexOf('low' || 'high') > -1) {
							const keyLow = baseKey + '.' + filterField + '.low';
							const keyHigh = baseKey + '.' + filterField + '.high';

							const low = (filter![filterField] as UrlStateRangeValue).low ?? '*';
							const high = (filter![filterField] as UrlStateRangeValue).high ?? '*';

							initialUrlState.filter = {
								...initialUrlState.filter,
								[filterField]: {
									low: ((initialUrlState.filter && (initialUrlState.filter as any)[keyLow]) || []).concat([low]),
									high: ((initialUrlState.filter && (initialUrlState.filter as any)[keyHigh]) || []).concat([high]),
								},
							};
						} else {
							const initFilterState = initialUrlState[baseKey] as UrlStateFilter;
							initialUrlState[baseKey] = deepmerge(initFilterState, {
								[filterField]: (initialUrlState[baseKey] && initFilterState[filterField] ? [initFilterState[filterField]] : []).concat(
									filter![filterField]
								),
							});
						}
					});
				} else {
					initialUrlState.filter = filter;
				}
			}
			return initialUrlState;
		} else {
			return {};
		}
	} else {
		return {};
	}
};
