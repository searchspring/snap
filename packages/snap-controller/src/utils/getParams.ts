import {
	SearchRequestModel,
	SearchRequestModelFilterTypeEnum,
	SearchRequestModelFilterRange,
	SearchRequestModelFilterValue,
} from '@searchspring/snapi-types';
import type { ImmutableUrlState } from '@searchspring/snap-url-manager';

export function getSearchParams(state: ImmutableUrlState): Record<string, any> {
	const params: SearchRequestModel = {};

	if (state.tag) {
		params.merchandising = params.merchandising || {};
		params.merchandising.landingPage = state.tag;
	}

	if (state.query) {
		params.search = params.search || {};
		params.search.query = params.search.query || {};
		params.search.query.string = state.query;
	}

	if (state.rq) {
		params.search = params.search || {};
		params.search.subQuery = state.rq;
	}

	if (state.oq) {
		params.search = params.search || {};
		params.search.originalQuery = state.oq;
	}

	if (state.fallbackQuery) {
		params.search = params.search || {};
		params.search.fallbackQuery = state.fallbackQuery;
	}

	if (state.page) {
		params.pagination = params.pagination || {};
		params.pagination.page = state.page;
	}

	if (state.pageSize) {
		params.pagination = params.pagination || {};
		params.pagination.pageSize = state.pageSize;
	}

	if (state.sort) {
		params.sorts = params.sorts || [];

		const sorts = Array.isArray(state.sort) ? state.sort : [state.sort];
		const sort = sorts[0];

		if (sort && sort.field && sort.direction) {
			params.sorts.push({
				field: sort.field,
				direction: sort.direction,
			});
		}
	}

	if (state.filter) {
		params.filters = params.filters || [];

		Object.keys(state.filter).forEach((field) => {
			if (typeof field != 'string') {
				return;
			}

			const filter = state.filter![field];

			// ensure values are an array
			const values = Array.isArray(filter) ? filter : [filter];

			values.forEach((value) => {
				if (typeof value != 'object') {
					params.filters!.push({
						type: 'value' as SearchRequestModelFilterTypeEnum,
						field: field,
						value,
					} as SearchRequestModelFilterRange);
				} else if (typeof value.low != 'undefined' && typeof value.high != 'undefined') {
					params.filters!.push({
						type: 'range' as SearchRequestModelFilterTypeEnum,
						field: field,
						value,
					} as SearchRequestModelFilterValue);
				}
			});
		});
	}

	return params;
}
