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
		...transformSearchResponse.filters(response, request),
		...transformSearchResponse.facets(response, request),
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

transformSearchResponse.filters = (response, request) => {
	const filterSummary = request.filters || [];

	return {
		filters: filterSummary.map((filter) => {
			let value = filter.value;
			let type = 'value';

			return {
				type,
				field: filter.field,
				label: filter.value,
				value,
			};
		}),
	};
};

transformSearchResponse.facets = (response, request: SearchRequestModel = {}) => {
	const filters = request.filters || [];
	const facets = response?.data?.aggregations || {};

	return {
		facets: Object.keys(facets).map((field) => {
			// assuming all value type facets for now
			const facet = facets[field];

			let transformedFacet: SearchResponseModelFacetValue | SearchResponseModelFacetRange = {
				field: facet.name,
				type: 'value',
				filtered: false,
			};

			if (facet.buckets instanceof Array) {
				const filteredValues = facet.buckets.filter((value) => {
					return value.selected;
				});
				transformedFacet.filtered = filteredValues.length > 0;
				transformedFacet.type = 'value';
				(transformedFacet as SearchResponseModelFacetValue).values = facet.buckets
					.filter((value) => {
						return value.doc_count;
					})
					.map((value) => {
						return {
							filtered: value.selected,
							value: value.key,
							label: value.key,
							count: value.doc_count,
						};
					});
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
