import { mergeParams } from '../utils';
import {
	SearchRequestModel,
	SearchRequestModelFilterRange,
	SearchRequestModelFilterValue,
	SearchRequestModelSorts,
	SearchRequestModelSortsDirectionEnum,
	SearchRequestModelFilterRangeAllOfValue,
} from '@searchspring/snapi-types';

export function transformSearchRequest(request: SearchRequestModel): any {
	return mergeParams(
		transformSearchRequest.sorts(request),
		transformSearchRequest.search(request),
		transformSearchRequest.filters(request),
		transformSearchRequest.merchandising(request),
		transformSearchRequest.pagination(request),
		transformSearchRequest.siteId(request),
		transformSearchRequest.facets(request),
		transformSearchRequest.tracking(request),
		transformSearchRequest.personalization(request)
	);
}

transformSearchRequest.sorts = (request: SearchRequestModel = {}) => {
	return (request.sorts || []).reduce((acc: Record<string, Array<SearchRequestModelSortsDirectionEnum>>, sort: SearchRequestModelSorts) => {
		if (!sort.field || !sort.direction || (sort.direction != 'asc' && sort.direction != 'desc')) {
			return acc;
		}

		return {
			...acc,
			['sort.' + sort.field]: (acc[sort.field] || []).concat([sort.direction]),
		};
	}, {});
};

transformSearchRequest.search = (request: SearchRequestModel = {}) => {
	const reqSearch = request.search || {};
	const search: {
		q?: string;
		rq?: string;
		originalQuery?: string;
		fallbackQuery?: string;
		redirectResponse?: string;
	} = {};

	if (reqSearch.query && reqSearch.query.string) {
		search.q = reqSearch.query.string;
	}

	if (reqSearch.subQuery) {
		search.rq = reqSearch.subQuery.trim();
	}

	if (reqSearch.originalQuery) {
		search.originalQuery = reqSearch.originalQuery.trim();
	}

	if (reqSearch.fallbackQuery) {
		search.fallbackQuery = reqSearch.fallbackQuery.trim();
	}

	if (reqSearch.redirectResponse) {
		search.redirectResponse = reqSearch.redirectResponse;
	}

	return search;
};

transformSearchRequest.filters = (request: SearchRequestModel = {}) => {
	return (request.filters || []).reduce(
		(
			acc: Record<string, Array<string | number | SearchRequestModelFilterRangeAllOfValue | undefined>>,
			filter: SearchRequestModelFilterRange | SearchRequestModelFilterValue
		) => {
			const baseKey = filter.background ? 'bgfilter' : 'filter';

			if (filter.type == 'value') {
				const key = baseKey + '.' + filter.field;

				return {
					...acc,
					[key]: (acc[key] || []).concat([filter.value]),
				};
			} else if (filter.type == 'range') {
				const keyLow = baseKey + '.' + filter.field + '.low';
				const keyHigh = baseKey + '.' + filter.field + '.high';

				const low = (filter as SearchRequestModelFilterRange)?.value?.low ?? '*';
				const high = (filter as SearchRequestModelFilterRange)?.value?.high ?? '*';

				return {
					...acc,
					[keyLow]: (acc[keyLow] || []).concat([low]),
					[keyHigh]: (acc[keyHigh] || []).concat([high]),
				};
			}

			return acc;
		},
		{}
	);
};

transformSearchRequest.merchandising = (request: SearchRequestModel = {}) => {
	const reqMerch = request.merchandising || {};

	const merch: {
		disableMerchandising?: boolean;
		tag?: string[];
		'landing-page'?: string;
		intellisuggest?: boolean;
		disableInlineBanners?: boolean;
	} = reqMerch.disabled ? { disableMerchandising: true } : {};

	if (reqMerch.landingPage) {
		merch['landing-page'] = reqMerch.landingPage;
	}

	if (reqMerch.segments instanceof Array && reqMerch.segments.length) {
		merch['tag'] = reqMerch.segments.map((segment) => {
			return `merch.segment/${segment}`;
		});
	}

	if (typeof reqMerch.intellisuggest == 'boolean') {
		merch['intellisuggest'] = reqMerch.intellisuggest;
	}

	if (reqMerch.disableInlineBanners) {
		merch['disableInlineBanners'] = reqMerch.disableInlineBanners;
	}

	return merch;
};

transformSearchRequest.pagination = (request: SearchRequestModel = {}) => {
	const pagination = request.pagination || {};
	const params: {
		page?: number;
		resultsPerPage?: number;
	} = {};

	if (pagination.page) {
		params.page = pagination.page;
	}

	if (pagination.pageSize || pagination.pageSize === 0) {
		params.resultsPerPage = pagination.pageSize;
	}

	return params;
};

transformSearchRequest.siteId = (request: SearchRequestModel = {}) => {
	if (request.siteId) {
		return { siteId: request.siteId };
	}

	return {};
};

transformSearchRequest.facets = (request: SearchRequestModel = {}) => {
	const facets = request.facets || {};
	const params: {
		includedFacets?: string[];
		excludedFacets?: string[];
		disableFacetDrillDown?: boolean;
	} = {};

	if (facets.include && facets.include.length && facets.exclude && facets.exclude.length) {
		throw 'cannot use facet include and exclude at the same time';
	}

	if (facets.include?.length) {
		params.includedFacets = facets.include;
	}

	if (facets.exclude?.length) {
		params.excludedFacets = facets.exclude;
	}

	if (facets.autoDrillDown === false) {
		params.disableFacetDrillDown = true;
	}

	return params;
};

transformSearchRequest.tracking = (request: SearchRequestModel = {}) => {
	const reqTracking = request.tracking || {};
	const params: {
		userId?: string;
		domain?: string;
		sessionId?: string;
		pageLoadId?: string;
	} = {};

	if (reqTracking.userId) {
		params.userId = reqTracking.userId;
	}
	if (reqTracking.domain) {
		params.domain = reqTracking.domain;
	}
	if (reqTracking.sessionId) {
		params.sessionId = reqTracking.sessionId;
	}
	if (reqTracking.pageLoadId) {
		params.pageLoadId = reqTracking.pageLoadId;
	}

	return params;
};

transformSearchRequest.personalization = (request: SearchRequestModel = {}) => {
	const personalization = request.personalization || {};
	const params: {
		skipPersonalization?: boolean;
		cart?: string;
		shopper?: string;
		lastViewed?: string;
	} = {};

	if (personalization.disabled) {
		params.skipPersonalization = personalization.disabled;
	}

	if (personalization.cart) {
		params.cart = personalization.cart;
	}

	if (personalization.lastViewed) {
		params.lastViewed = personalization.lastViewed;
	}

	if (personalization.shopper) {
		params.shopper = personalization.shopper;
	}

	return params;
};
