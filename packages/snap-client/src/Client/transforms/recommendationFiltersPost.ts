import { RecommendationRequestFilterModel, RecommendPostRequestFiltersModel } from '../../types';

export const transformRecommendationFiltersPost = (filters?: RecommendationRequestFilterModel[]) => {
	if (!filters) return;

	const filterArray: RecommendPostRequestFiltersModel[] = [];
	filters.map((filter) => {
		if (filter.type == 'value') {
			//check if filterArray contains a filter for this value already
			const i = filterArray.findIndex((_filter) => _filter.field == filter.field);
			if (i > -1) {
				//if so just push another value to the already existing obj
				filterArray[i].values.push(filter.value);
			} else {
				//else create a new one
				const val = {
					field: filter.field,
					type: '=' as const,
					values: [filter.value],
				};

				filterArray.push(val);
			}
		} else if (filter.type == 'range') {
			//low
			if (typeof filter.value.low == 'number') {
				const low = {
					field: filter.field,
					type: '>=' as const,
					values: [filter.value.low as number],
				};

				//dedupe
				const i = filterArray.findIndex((_filter) => _filter.field == filter.field && _filter.type == '>=');
				if (i > -1) {
					filterArray[i] = low;
				} else {
					filterArray.push(low);
				}
			}
			//high
			if (typeof filter.value.high == 'number') {
				const high = {
					field: filter.field,
					type: '<=' as const,
					values: [filter.value.high as number],
				};

				//dedupe
				const i = filterArray.findIndex((_filter) => _filter.field == filter.field && _filter.type == '<=');
				if (i > -1) {
					filterArray[i] = high;
				} else {
					filterArray.push(high);
				}
			}
		}
	});

	return filterArray;
};
