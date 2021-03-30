// translate state to snAPI params

type searchParams = {
	search?: {
		query?: {
			string?: string;
		}
		subQuery?: string;
		originalQuery?: string;
	},
	pagination?: {
		pageSize?: number;
		page?: number;
	},
	sorts?: {
		field: string;
		direction: string;
	}[],
	filters?: {
		type: string;
		field: string;
		value: string | {
			low: number;
			high: number;
		};
		background?: boolean;
	}[],
	merchandising?: {
		landingPage?: string
	}
}


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
		Object.keys(state.sort).forEach((field) => {
			const direction = state.sort[field];

			if (typeof field != 'string' || !Array.isArray(direction) || direction.length != 1) {
				return;
			}

			params.sorts.push({
				field: field,
				direction: direction[0],
			});
		});
	}

	if (state.filter) {
		params.filters = params.filters || [];

		Object.keys(state.filter).forEach((field) => {
			if (typeof field != 'string') {
				return;
			}

			const filter = state.filter[field];

			const values = filter;
			const keys = Object.keys(filter || {});

			// TODO: should always be an array
			if (values.length) {
				// value filters
				if (Array.isArray(values)) {
					values.forEach((value) => {
						params.filters.push({
							type: 'value',
							field: field,
							value: value,
						});
					});
				} else {
					params.filters.push({
						type: 'value',
						field: field,
						value: values,
					});
				}
			} else if (keys.length && filter.low && filter.high && filter.low.length == filter.high.length) {
				// range filters
				filter.low.forEach((value, i) => {
					params.filters.push({
						type: 'range',
						field: field,
						value: {
							low: filter.low[i],
							high: filter.high[i],
						},
					});
				});
			}
		});
	}

	return params;
}