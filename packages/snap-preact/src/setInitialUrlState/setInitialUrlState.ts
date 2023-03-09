import type { UrlState } from '@searchspring/snap-url-manager';
import { SearchRequestModelFilterRange } from '@searchspring/snapi-types';
import deepmerge from 'deepmerge';

export const setInitialUrlState = (intitialStateConfig: any, _initialUrlState: UrlState) => {
	let { ignoreList, sorts, filters, pagination } = intitialStateConfig;

	ignoreList = (ignoreList || []).concat(['query', 'tag']);

	if (!Object.keys(_initialUrlState).filter((key) => ignoreList.indexOf(key) == -1).length) {
		let initialUrlState = { ..._initialUrlState };

		if (pagination?.page) {
			initialUrlState.page = pagination.page;
		}

		if (pagination?.pageSize) {
			initialUrlState.pageSize = pagination.pageSize;
		}

		if (sorts && sorts.length) {
			sorts.map((sort: any) => {
				if (!sort.field || !sort.direction) {
					console.log('valid sort requires field and direction');
				}

				if (sort.direction != 'asc' && sort.direction != 'desc') {
					console.log('valid sort directions: asc, desc');
				}
				if (sort.field && sort.direction) {
					initialUrlState.sort = {
						field: sort.field,
						direction: sort.direction,
					};
				}
			});
		}

		if (filters && filters?.length) {
			filters.map((filter: any) => {
				const baseKey = filter.background ? 'bgfilter' : 'filter';
				if (filter.type == 'value') {
					// @ts-ignore
					initialUrlState[baseKey] = deepmerge(initialUrlState[baseKey], {
						[filter.field]: (initialUrlState[baseKey] && initialUrlState[baseKey][filter.field]
							? [initialUrlState[baseKey][filter.field]]
							: []
						).concat([filter.value]),
					});
				} else if (filter.type == 'range') {
					const keyLow = baseKey + '.' + filter.field + '.low';
					const keyHigh = baseKey + '.' + filter.field + '.high';

					const low = (filter as SearchRequestModelFilterRange)?.value?.low ?? '*';
					const high = (filter as SearchRequestModelFilterRange)?.value?.high ?? '*';

					initialUrlState.filter = {
						...initialUrlState.filter,
						[filter.field]: {
							low: ((initialUrlState.filter && (initialUrlState.filter[keyLow] as any)) || []).concat([low]),
							high: ((initialUrlState.filter && (initialUrlState.filter[keyHigh] as any)) || []).concat([high]),
						},
					};
				}
			});
		}

		return initialUrlState;
	} else {
		return {};
	}
};
