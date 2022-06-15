import {
	AutocompleteRequestModel,
	AutocompleteResponseModel,
	MetaRequestModel,
	MetaResponseModel,
	SearchRequestModel,
	SearchResponseModel,
} from '@searchspring/snapi-types';

import { API, LegacyAPI, SuggestAPI, ApiConfiguration } from '.';
import { transformSearchRequest, transformSearchResponse, transformSuggestResponse } from '../transforms';
import type { SuggestRequestModel } from '../../types';

export class HybridAPI extends API {
	private requesters: {
		legacy: LegacyAPI;
		suggest: SuggestAPI;
	};

	constructor(configuration: ApiConfiguration) {
		super(configuration);

		this.requesters = {
			legacy: new LegacyAPI(new ApiConfiguration({ origin: configuration.origin, cache: this.configuration.cache })),
			suggest: new SuggestAPI(new ApiConfiguration({ origin: configuration.origin, cache: this.configuration.cache })),
		};
	}

	async getMeta(requestParameters: MetaRequestModel): Promise<MetaResponseModel> {
		const legacyRequestParameters = requestParameters;
		return this.requesters.legacy.getMeta(legacyRequestParameters);
	}

	async getSearch(requestParameters: SearchRequestModel): Promise<SearchResponseModel> {
		const legacyRequestParameters = transformSearchRequest(requestParameters);

		const legacyData = await this.requesters.legacy.getSearch(legacyRequestParameters);

		return transformSearchResponse(legacyData, requestParameters);
	}

	async getFinder(requestParameters: SearchRequestModel): Promise<SearchResponseModel> {
		const legacyRequestParameters = transformSearchRequest(requestParameters);

		const legacyData = await this.requesters.legacy.getFinder(legacyRequestParameters);

		return transformSearchResponse(legacyData, requestParameters);
	}

	async getAutocomplete(requestParameters: AutocompleteRequestModel): Promise<AutocompleteResponseModel> {
		const legacyRequestParameters = transformSearchRequest(requestParameters);

		const suggestParams: SuggestRequestModel = {
			siteId: legacyRequestParameters.siteId,
			language: 'en',
			query: legacyRequestParameters.q,
			suggestionCount: (requestParameters.suggestions || {}).count || 5,
		};

		if (!((requestParameters.search || {}).query || {}).spellCorrection) {
			suggestParams.disableSpellCorrect = true;
		}

		const suggestResults = await this.requesters.suggest.getSuggest(suggestParams);
		const transformedSuggestResults = transformSuggestResponse(suggestResults);

		const q = (suggestResults.suggested || {}).text || transformedSuggestResults.correctedQuery || suggestResults.query;

		const queryParameters = {
			...legacyRequestParameters,
			redirectResponse: 'full',
			q,
		};

		const legacyResults = await this.requesters.legacy.getAutocomplete(queryParameters);
		const searchResults = transformSearchResponse(legacyResults, requestParameters);

		return {
			...searchResults,
			search: {
				query: q,
			},
			autocomplete: transformedSuggestResults,
		};
	}
}
