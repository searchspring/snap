import { mergeParams } from '../utils';
import { SearchRequestModel, SearchRequestModelFilterRange, SearchRequestModelFilterValue } from '@searchspring/snapi-types';

export function transformSearchRequest(request: SearchRequestModel): any {
	return mergeParams(
		transformSearchRequest.sorts(request),
		transformSearchRequest.search(request),
		transformSearchRequest.filters(request),
		transformSearchRequest.merchandising(request),
		transformSearchRequest.pagination(request),
		transformSearchRequest.siteId(request),
		transformSearchRequest.facets(request),
		transformSearchRequest.tracking(request)
	);
}

transformSearchRequest.sorts = (request: SearchRequestModel = {}) => {
	return (request.sorts || []).reduce((acc, sort) => {
		if (!sort.field && !sort.direction) {
			return acc;
		}

		if (!sort.field || !sort.direction) {
			throw 'valid sort requires field and direction';
		}

		if (sort.direction != 'asc' && sort.direction != 'desc') {
			throw 'valid sort directions: asc, desc';
		}

		return {
			...acc,
			['sort.' + sort.field]: (acc[sort.field] || []).concat(sort.direction),
		};
	}, {});
};

transformSearchRequest.search = (request: SearchRequestModel = {}) => {
	const reqSearch = request.search || {};
	const search: {
		q?: string;
		rq?: string;
		originalQuery?: string;
		redirectResponse?: string;
	} = {};

	if (reqSearch.query && reqSearch.query.string) {
		search.q = reqSearch.query.string.trim();
	}

	if (reqSearch.subQuery) {
		search.rq = reqSearch.subQuery.trim();
	}

	if (reqSearch.originalQuery) {
		search.originalQuery = reqSearch.originalQuery.trim();
	}

	if (reqSearch.redirectResponse) {
		search.redirectResponse = reqSearch.redirectResponse;
	}

	return search;
};

transformSearchRequest.filters = (request: SearchRequestModel = {}) => {
	return (request.filters || []).reduce((acc, filter: SearchRequestModelFilterRange | SearchRequestModelFilterValue) => {
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

			const low = (filter as SearchRequestModelFilterRange).value.low ?? '*';
			const high = (filter as SearchRequestModelFilterRange).value.high ?? '*';

			return {
				...acc,
				[keyLow]: (acc[keyLow] || []).concat([low]),
				[keyHigh]: (acc[keyHigh] || []).concat([high]),
			};
		}

		return acc;
	}, {});
};

transformSearchRequest.merchandising = (request: SearchRequestModel = {}) => {
	const reqMerch = request.merchandising || {};

	const merch = reqMerch.disabled ? { disableMerchandising: true } : {};

	if (reqMerch.landingPage) {
		merch['landing-page'] = reqMerch.landingPage;
	}

	if (reqMerch.segments instanceof Array && reqMerch.segments.length) {
		merch['tag'] = reqMerch.segments.map((segment) => {
			return `merch.segment/${segment}`;
		});
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

	if (facets.include && facets.include.length && facets.exclude && facets.exclude.length) {
		throw 'cannot use facet include and exclude at the same time';
	}

	if (facets.include?.length) {
		return { includedFacets: facets.include };
	}

	if (facets.exclude?.length) {
		return { excludedFacets: facets.exclude };
	}

	return {};
};

transformSearchRequest.tracking = (request: SearchRequestModel = {}) => {
	const reqTracking = request.tracking || {};

	if (reqTracking.userId) {
		return { userId: reqTracking.userId };
	}

	return {};
};
