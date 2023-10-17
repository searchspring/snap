import { RecommendationRequestFilterModel } from '../../types';

export const transformRecommendationFiltersGet = (filters: RecommendationRequestFilterModel[]) => {
	const filterArray: {
		[filter: `filter.${string}`]: (string | number)[];
	} = {};

	filters.map((filter) => {
		if (filter.type == 'value') {
			//check if filterArray contains a filter for this value already
			if (filterArray[`filter.${filter.field}`]) {
				// is the existing filter an array already? or just a single value
				filterArray[`filter.${filter.field}`].push(filter.value);
			} else {
				//else create a new one
				filterArray[`filter.${filter.field}`] = [filter.value];
			}
		} else if (filter.type == 'range') {
			if (typeof filter.value.low == 'number') {
				filterArray[`filter.${filter.field}.low`] = [filter.value.low];
			}
			if (typeof filter.value.high == 'number') {
				filterArray[`filter.${filter.field}.high`] = [filter.value.high];
			}
		}
	});
	return filterArray;
};
