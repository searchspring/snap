import { htmlUnescape } from '../utils/htmlUnescape';

import {
	SearchRequestModel,
	SearchRequestModelFilterValue,
	SearchResponseModelResult,
	SearchResponseModelResultCoreMappings,
	SearchResponseModelPagination,
	SearchResponseModelSearchMatchTypeEnum,
	SearchResponseModelMerchandising,
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

type sortingOption = {
	field: string;
	direction: string;
	label: string;
	active?: number;
};

type rawResult = {
	brand?: string;
	collection_handle?: string[];
	collection_id?: string[];
	handle?: string;
	id: string;
	imageUrl: string;
	intellisuggestData?: string;
	intellisuggestSignature?: string;
	msrp?: string;
	name: string;
	price: string;
	product_type?: string[];
	product_type_unigram?: string;
	sku: string;
	ss_available?: string;
	ss_best_selling?: string;
	ss_days_since_published?: string;
	ss_id?: string;
	ss_image_hover?: string;
	ss_images?: string[];
	ss_inventory_count?: string;
	ss_tags?: string[];
	thumbnailImageUrl?: string;
	uid?: string;
	url?: string;
	children?: [];
};

type facetValue = {
	active: boolean;
	type: string;
	value: string;
	label: string;
	count: number;
	low?: string | number;
	high?: string | number;
};

type facet = {
	hierarchyDelimiter?: string;
	multiple?: string;
	active?: any;
	count?: number;
	high?: string;
	low?: string;
	field: string;
	label: string;
	type: null | string;
	collapse: number;
	facet_active: number;
	values: facetValue[];
	step?: number;
	filtered?: boolean;
	range?: string[];
};

type breadcrumb = {
	field: string;
	label: string;
	filterLabel: string;
	filterValue: string;
	removeFilters: [];
	removeRefineQuery: [];
};

export type searchResponseType = {
	pagination: {
		totalResults: number;
		begin: number;
		end: number;
		currentPage: number;
		totalPages: number;
		previousPage: number;
		nextPage: number;
		perPage: number;
		defaultPerPage: number;
	};
	sorting: {
		options: sortingOption[];
	};
	resultLayout?: string;
	results: rawResult[];
	facets: facet[];
	breadcrumbs?: breadcrumb[];
	filterSummary: {
		field: string;
		filterLabel: string;
		filterValue: string;
		label: string;
		value: { rangeHigh?: string | number; rangeLow?: string | number; low?: string | number; high?: string | number } | string;
	}[];
	merchandising: {
		redirect: string;
		is_elevated: string[];
		elevated: any[];
		removed: string[];
		content: object;
		facets: any[];
		facetsHide: any[];
		experiments?: [];
		variants?: [];
		personalized?: boolean;
		triggeredCampaigns?: {
			id: string;
			title: string;
			type: string;
		}[];
	};
	didYouMean?: {
		query: string;
	};
	query?: {
		matchType?: SearchResponseModelSearchMatchTypeEnum;
		corrected?: string;
		original?: string;
	};
};

class Result implements SearchResponseModelResult {
	constructor(result: SearchResponseModelResult) {
		Object.assign(this, result);
	}
}

export function transformSearchResponse(response: searchResponseType, request: SearchRequestModel) {
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

transformSearchResponse.pagination = (response: searchResponseType): { pagination: SearchResponseModelPagination } => {
	const pagination = response?.pagination;

	return {
		pagination: {
			totalResults: pagination?.totalResults,
			page: pagination?.currentPage,
			pageSize: pagination?.perPage,
			totalPages: pagination?.totalPages,
		},
	};
};

transformSearchResponse.results = (response: searchResponseType) => {
	const results = response?.results || [];

	return { results: results.map(transformSearchResponse.result) };
};

transformSearchResponse.result = (rawResult: rawResult): SearchResponseModelResult => {
	const coreFieldValues: SearchResponseModelResultCoreMappings = CORE_FIELDS.reduce((coreFields, key) => {
		if (typeof rawResult[key as keyof rawResult] != 'undefined') {
			return {
				...coreFields,
				[key]: decodeProperty(rawResult[key as keyof rawResult] || ''),
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
				[key]: decodeProperty(rawResult[key as keyof rawResult] || ''),
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

transformSearchResponse.filters = (response: searchResponseType): any => {
	const filterSummary = response?.filterSummary || [];

	return {
		filters: filterSummary.map((filter) => {
			let value = filter.value;
			let type = 'value';

			if (typeof filter.value == 'object') {
				if (filter && filter.value && filter.value.rangeHigh && filter.value.rangeLow) {
					(type = 'range'),
						(value = {
							low: +filter.value.rangeLow,
							high: +filter.value.rangeHigh,
						});
				}
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

transformSearchResponse.facets = (response: searchResponseType, request: SearchRequestModel = {}) => {
	const filters = request.filters || [];
	const facets = response?.facets || [];
	const limit = request?.facets?.limit;
	const valueLimit = request?.facets?.valueLimit;

	let transformedFacets = facets.map((facet) => {
		let transformedFacet: any = {
			field: facet.field,
			type: 'value',
			filtered: Boolean(facet.facet_active),
		};

		if (facet.step) {
			if (facet.range) {
				transformedFacet = {
					...transformedFacet,
					type: 'range',
					step: facet.step,
					range: {
						// TODO: change to null
						low: facet.range[0] == '*' ? undefined : +facet.range[0],
						high: facet.range[1] == '*' ? undefined : +facet.range[1],
					},
				};
			}
			if (facet.active && typeof facet.active != 'boolean' && facet.active.length > 1) {
				transformedFacet.active = {
					// TODO: change to null
					low: facet.active[0] == '*' ? undefined : +facet.active[0],
					high: facet.active[1] == '*' ? undefined : +facet.active[1],
				};
			}
		} else if (facet.values instanceof Array) {
			if (facet.type == 'hierarchy') {
				transformedFacet.type = 'value';

				transformedFacet.values = (facet.values || []).map((value) => {
					return {
						filtered: Boolean(value.active),
						value: value.value,
						label: value.label,
						count: value.count,
					};
				});

				const filterSelected: SearchRequestModelFilterValue | undefined = filters.find((f: any) => f.field == facet.field);

				const newValues = [];
				if (filterSelected && !filterSelected.background) {
					const valueLevels = filterSelected.value?.split(facet.hierarchyDelimiter || '>');

					if (valueLevels) {
						for (let i = valueLevels.length - 1; i >= 0; i--) {
							const valueSplit = valueLevels.slice(0, i + 1);
							const value = valueSplit.join(facet.hierarchyDelimiter);
							newValues.unshift({
								value,
								filtered: value == (filterSelected as SearchRequestModelFilterValue).value,
								label: valueSplit[valueSplit.length - 1],
							});
						}
					}

					newValues.unshift({
						value: null,
						filtered: false,
						label: 'View All',
					});
				}

				transformedFacet.values = newValues.concat(transformedFacet.values);
			} else if (facet.values[0].type == 'value') {
				transformedFacet.type = 'value';
				transformedFacet.values = facet.values.map((value) => {
					return {
						filtered: value.active,
						value: value.value,
						label: value.label,
						count: value.count,
					};
				});
			} else if (facet.values[0].type == 'range') {
				transformedFacet.type = 'range-buckets';
				transformedFacet.values = facet.values.map((value) => {
					return {
						filtered: value.active,
						low: value.low == '*' ? null : value.low ? +value.low : null,
						high: value.high == '*' ? null : value.high ? +value.high : null,
						label: value.label,
						count: value.count,
					};
				});
			}
		}

		return transformedFacet;
	});

	// limit facets based on request
	if (limit) {
		transformedFacets = transformedFacets.slice(0, limit);
	}

	// limit facet values based on request
	if (valueLimit) {
		transformedFacets = transformedFacets.map((facet) => {
			if (facet.values) {
				facet.values = facet.values.slice(0, valueLimit);
			}
			return facet;
		});
	}

	return {
		facets: transformedFacets,
	};
};

transformSearchResponse.sorting = (response: searchResponseType) => {
	const sorts = response?.sorting?.options || [];
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

transformSearchResponse.merchandising = (response: searchResponseType) => {
	const merchandising = response?.merchandising;

	if (merchandising?.content && Array.isArray(merchandising.content) && !merchandising.content.length) {
		merchandising.content = {};
	}

	const transformedMerchandising: SearchResponseModelMerchandising = {
		redirect: merchandising?.redirect || '',
		content: merchandising?.content || {},
		campaigns: merchandising?.triggeredCampaigns || [],
		personalized: merchandising?.personalized,
	};

	return {
		merchandising: transformedMerchandising,
	};
};

transformSearchResponse.search = (response: searchResponseType, request: SearchRequestModel) => {
	const searchObj: {
		search: {
			query?: string;
			didYouMean?: string;
			matchType?: string;
			originalQuery?: string;
		};
	} = {
		search: {
			query: request?.search?.query?.string,
			didYouMean: response?.didYouMean?.query,
			matchType: response?.query?.matchType,
		},
	};

	if (response?.query?.corrected && response?.query.original) {
		// integrated spell correction is enabled
		searchObj.search.query = response?.query?.corrected;
		searchObj.search.originalQuery = response?.query?.original;
	} else if (request?.search?.originalQuery) {
		// using 'oq'
		searchObj.search.originalQuery = request?.search?.originalQuery;
	}

	return searchObj;
};

// used for HTML entities decoding
function decodeProperty(encoded: string | string[]) {
	if (Array.isArray(encoded)) {
		return encoded.map((item) => htmlUnescape(String(item)));
	} else {
		return htmlUnescape(String(encoded));
	}
}
