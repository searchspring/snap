export function checkStateRangeValue(value: Record<string, unknown>): boolean {
	if (typeof value != 'object') {
		return false;
	}

	if (typeof value.low != 'number' && value.low !== undefined) {
		return false;
	}

	if (typeof value.high != 'number' && value.high !== undefined) {
		return false;
	}

	if (typeof value.low != 'number' && typeof value.high != 'number') {
		// at least one must be defined
		return true;
	}

	return true;
}

export function checkStateFilter(filters: Record<string, Array<unknown>>): boolean {
	for (const key of Object.keys(filters)) {
		if (typeof key !== 'string') {
			return false;
		}

		const fieldFilter = filters[key];

		const invalidFilter = fieldFilter.find((filter) => {
			if (typeof filter == 'string') {
				return false;
			}

			if (typeof filter == 'number') {
				return false;
			}

			if (typeof filter == 'object' && filter !== null) {
				return !checkStateRangeValue(filter as Record<string, unknown>);
			}
		});

		if (invalidFilter) {
			return false;
		}
	}

	return true;
}

export function checkStateSort(sort: unknown): boolean {
	const sortsAsArray = sort instanceof Array ? sort : [sort];

	for (const sort of sortsAsArray) {
		if (typeof sort.field != 'string') {
			return false;
		}

		if (typeof sort.direction != 'string') {
			return false;
		}
	}

	return true;
}

export function checkState(state: Record<string, unknown>): boolean {
	if (typeof state.filter == 'object' && !checkStateFilter(state.filter as Record<string, Array<unknown>>)) {
		return false;
	}

	if (typeof state.sort == 'object' && !checkStateSort(state.sort)) {
		return false;
	}

	if (state.page !== undefined && typeof state.page != 'number') {
		return false;
	}

	if (state.query !== undefined && typeof state.query != 'string') {
		return false;
	}

	return true;
}
