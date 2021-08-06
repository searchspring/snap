import he from 'he';

import {
	SearchRequestModel,
	SearchRequestModelFilterValue,
	SearchResponseModel,
	SearchResponseModelResult,
	SearchResponseModelResultCoreMappings,
	SearchResponseModelFacetRange,
	SearchResponseModelFacetValue,
	SearchResponseModelPagination,
} from '@searchspring/snapi-types';

// TODO: Add all core fields
const CORE_FIELDS = ['name', 'sku', 'imageUrl', 'thumbnailImageUrl', 'price', 'msrp', 'brand', 'url', 'uid'];

class Result {
	constructor(result) {
		Object.assign(this, result);
	}
}

export function transformSearchResponse(response: any, request: SearchRequestModel): SearchResponseModel {
	return {
		...transformSearchResponse.pagination(response),
		...transformSearchResponse.results(response),
		...transformSearchResponse.filters(response),
		...transformSearchResponse.facets(response, request),
		...transformSearchResponse.sorting(response),
		...transformSearchResponse.merchandising(response),
		...transformSearchResponse.search(response, request),
	};
}

transformSearchResponse.pagination = (response): { pagination: SearchResponseModelPagination } => {
	const pagination = (response || {}).pagination || {};

	return {
		pagination: {
			totalResults: pagination.totalResults,
			page: pagination.currentPage,
			pageSize: pagination.perPage,
			defaultPageSize: pagination.defaultPerPage,
		},
	};
};

transformSearchResponse.results = (response) => {
	const results = (response || {}).results || [];

	return { results: results.map(transformSearchResponse.result) };
};

transformSearchResponse.result = (rawResult): SearchResponseModelResult => {
	const coreFieldValues: SearchResponseModelResultCoreMappings = CORE_FIELDS.reduce((coreFields, key) => {
		return {
			...coreFields,
			[key]: decodeProperty(rawResult[key]),
		};
	}, {});

	coreFieldValues.price = +coreFieldValues.price;
	coreFieldValues.msrp = +coreFieldValues.msrp;

	const attributes = Object.keys(rawResult)
		.filter((k) => CORE_FIELDS.indexOf(k) == -1)
		.reduce((attributes, key) => {
			return {
				...attributes,
				[key]: decodeProperty(rawResult[key]),
			};
		}, {});

	return new Result({
		id: rawResult.uid,
		mappings: {
			core: coreFieldValues,
		},
		attributes,
	});
};

transformSearchResponse.filters = (response) => {
	const filterSummary = (response || {}).filterSummary || [];

	return {
		filters: filterSummary.map((filter) => {
			let value = filter.value;
			let type = 'value';

			if (typeof filter.value == 'object') {
				(type = 'range'),
					(value = {
						low: +filter.value.rangeLow,
						high: +filter.value.rangeHigh,
					});
			}

			return {
				type,
				field: filter.field,
				label: filter.filterValue,
				value,
			};
		}),
	};
};

transformSearchResponse.facets = (response, request: SearchRequestModel = {}) => {
	const filters = request.filters || [];
	const facets = (response || {}).facets || [];

	return {
		facets: facets.map((facet) => {
			let transformedFacet: SearchResponseModelFacetValue | SearchResponseModelFacetRange = {
				field: facet.field,
				type: 'value',
				filtered: Boolean(facet.facet_active),
			};

			if (facet.step) {
				transformedFacet = {
					...transformedFacet,
					type: 'range',
					step: facet.step,
					range: {
						low: facet.range[0],
						high: facet.range[1],
					},
				};

				if (facet.active && facet.active.length > 1) {
					transformedFacet.active = {
						low: facet.active[0],
						high: facet.active[1],
					};
				}
			} else if (facet.values instanceof Array) {
				if (facet.type == 'hierarchy') {
					transformedFacet.type = 'value';

					(transformedFacet as SearchResponseModelFacetValue).values = (facet.values || []).map((value) => {
						return {
							filtered: Boolean(value.active),
							value: value.value,
							label: value.label,
							count: value.count,
						};
					});

					const filterSelected = filters.find((f) => f.field == facet.field);

					const newValues = [];
					if (filterSelected && !filterSelected.background) {
						const valueLevels = (filterSelected as SearchRequestModelFilterValue).value.split(facet.hierarchyDelimiter);

						for (let i = valueLevels.length - 1; i >= 0; i--) {
							const valueSplit = valueLevels.slice(0, i + 1);
							const value = valueSplit.join(facet.hierarchyDelimiter);
							newValues.unshift({
								value,
								filtered: value == (filterSelected as SearchRequestModelFilterValue).value,
								label: valueSplit[valueSplit.length - 1],
							});
						}

						newValues.unshift({
							value: null,
							filtered: false,
							label: 'View All',
						});
					}

					(transformedFacet as SearchResponseModelFacetValue).values = newValues.concat((transformedFacet as SearchResponseModelFacetValue).values);
				} else if (facet.values[0].type == 'value') {
					transformedFacet.type = 'value';
					(transformedFacet as SearchResponseModelFacetValue).values = facet.values.map((value) => {
						return {
							filtered: value.active,
							value: value.value,
							label: value.label,
							count: value.count,
						};
					});
				} else if (facet.values[0].type == 'range') {
					transformedFacet.type = 'range-buckets';
					(transformedFacet as SearchResponseModelFacetValue).values = facet.values.map((value) => {
						return {
							filtered: value.active,
							low: value.low,
							high: value.high,
							label: value.label,
							count: value.count,
						};
					});
				}
			}

			return transformedFacet;
		}),
	};
};

transformSearchResponse.sorting = (response) => {
	const sorts = ((response || {}).sorting || {}).options || [];
	const transformedSorting = sorts
		.filter((sort) => sort.active)
		.map((sort) => {
			return {
				field: sort.field,
				direction: sort.direction,
			};
		});

	return {
		sorting: transformedSorting,
	};
};

transformSearchResponse.merchandising = (response) => {
	const merchandising = (response || {}).merchandising || {};

	if (merchandising.content && Array.isArray(merchandising.content) && !merchandising.content.length) {
		merchandising.content = {};
	}

	return {
		merchandising,
	};
};

transformSearchResponse.search = (response, request) => {
	const didYouMean = ((response || {}).didYouMean || {}).query;
	const originalQuery = ((request || {}).search || {}).originalQuery;

	return {
		search: {
			query: (((request || {}).search || {}).query || {}).string,
			didYouMean,
			originalQuery,
		},
	};
};

// used for HTML entities decoding
function decodeProperty(encoded) {
	if (Array.isArray(encoded)) {
		return encoded.map((item) => he.decode(String(item)));
	} else {
		return he.decode(String(encoded));
	}
}
