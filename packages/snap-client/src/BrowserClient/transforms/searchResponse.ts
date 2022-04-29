import { htmlUnescape } from '../../Client/utils/htmlUnescape';

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
const CORE_FIELDS = [
	'uid',
	'sku',
	'name',
	'url',
	'addToCartUrl',
	'price',
	'msrp',
	'imageUrl',
	'secureImageUrl',
	'thumbnailImageUrl',
	'secureThumbnailImageUrl',
	'rating',
	'ratingCount',
	'description',
	'stockMessage',
	'brand',
	'popularity',
	'caption',
];

class Result {
	constructor(result) {
		Object.assign(this, result);
	}
}

export function transformSearchResponse(response: any, request: SearchRequestModel, options): SearchResponseModel {
	return {
		...transformSearchResponse.pagination(response, options),
		...transformSearchResponse.results(response),
		// ...transformSearchResponse.filters(response),
		// ...transformSearchResponse.facets(response, request),
		...transformSearchResponse.sorting(request),
		// ...transformSearchResponse.merchandising(response),
		...transformSearchResponse.search(response, request),
	};
}

transformSearchResponse.pagination = (response, options): { pagination: SearchResponseModelPagination } => {
	const pagination = response.pagination || {};

	return {
		pagination: {
			totalResults: pagination.total,
			page: pagination.page,
			pageSize: pagination.per_page,
			defaultPageSize: options.defaultPageSize,
			totalPages: Math.ceil(pagination.total / pagination.per_page),
		},
	};
};

transformSearchResponse.results = (response) => {
	const results = response?.data?.items || [];

	return { results: results.map(transformSearchResponse.result) };
};

transformSearchResponse.result = (rawResult): SearchResponseModelResult => {
	const coreFieldValues: SearchResponseModelResultCoreMappings = CORE_FIELDS.reduce((coreFields, key) => {
		if (typeof rawResult[key] != 'undefined') {
			return {
				...coreFields,
				[key]: decodeProperty(rawResult[key]),
			};
		}
		return coreFields;
	}, {});

	if (coreFieldValues.price) coreFieldValues.price = +coreFieldValues.price;
	if (coreFieldValues.msrp) coreFieldValues.msrp = +coreFieldValues.msrp;

	const attributes = Object.keys(rawResult)
		.filter((k) => CORE_FIELDS.indexOf(k) == -1)
		.reduce((attributes, key) => {
			return {
				...attributes,
				[key]: decodeProperty(rawResult[key]),
			};
		}, {});

	const children =
		rawResult?.children?.map((child) => {
			return {
				attributes: {
					...Object.keys(child).reduce((attributes, key) => {
						return {
							...attributes,
							[key]: decodeProperty(child[key]),
						};
					}, {}),
				},
			};
		}) || [];

	return new Result({
		id: rawResult.uid,
		mappings: {
			core: coreFieldValues,
		},
		attributes,
		children,
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
						low: facet.range[0] == '*' ? null : +facet.range[0],
						high: facet.range[1] == '*' ? null : +facet.range[1],
					},
				};

				if (facet.active && facet.active.length > 1) {
					transformedFacet.active = {
						low: facet.active[0] == '*' ? null : +facet.active[0],
						high: facet.active[1] == '*' ? null : +facet.active[1],
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
							low: value.low == '*' ? null : +value.low,
							high: value.high == '*' ? null : +value.high,
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

transformSearchResponse.sorting = (request) => {
	return { sorting: request.sorts || [] };
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
	return {
		search: {
			query: request?.search?.query?.string,
		},
	};
};

// used for HTML entities decoding
function decodeProperty(encoded) {
	if (Array.isArray(encoded)) {
		return encoded.map((item) => htmlUnescape(String(item)));
	} else {
		return htmlUnescape(String(encoded));
	}
}
