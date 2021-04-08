// translate state to snAPI params

type searchParams = {
	search?: {
		query?: {
			string?: string;
		};
		subQuery?: string;
		originalQuery?: string;
	};
	pagination?: {
		pageSize?: number;
		page?: number;
	};
	sorts?: {
		field: string;
		direction: string;
	}[];
	filters?: {
		type: string;
		field: string;
		value:
			| string
			| {
					low: number;
					high: number;
			  };
		background?: boolean;
	}[];
	merchandising?: {
		landingPage?: string;
	};
};

export function getSearchParams(state): Record<string, any> {
	const params: searchParams = {};

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
		params.search.subQuery = state.rq[0];
	}

	if (state.oq) {
		params.search = params.search || {};
		params.search.originalQuery = state.oq[0];
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

			const filter = state.filter[field];

			// ensure values are an array
			const values = Array.isArray(filter) ? filter : [filter];

			values.forEach((value) => {
				if (typeof value != 'object') {
					params.filters.push({
						type: 'value',
						field: field,
						value,
					});
				} else if (typeof value.low != 'undefined' && typeof value.high != 'undefined') {
					params.filters.push({
						type: 'range',
						field: field,
						value,
					});
				}
			});
		});
	}

	return params;
}
