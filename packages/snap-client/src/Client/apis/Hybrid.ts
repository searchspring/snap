import { AppMode } from '@searchspring/snap-toolbox';

import {
	AutocompleteRequestModel,
	AutocompleteResponseModel,
	MetaRequestModel,
	MetaResponseModel,
	SearchRequestModel,
	SearchResponseModel,
} from '@searchspring/snapi-types';

import { API, ApiConfigurationParameters, HTTPHeaders, LegacyAPI, SuggestAPI, ApiConfiguration, SuggestRequestModel, SuggestResponseModel } from '.';
import { transformSearchRequest, transformSearchResponse, transformSuggestResponse } from '../transforms';

export class HybridAPI extends API {
	private requesters: {
		legacy: LegacyAPI;
		suggest: SuggestAPI;
	};

	constructor(configuration: ApiConfiguration) {
		super(configuration);

		const legacyConfig: ApiConfigurationParameters = { mode: configuration.mode, origin: configuration.origin, cache: this.configuration.cache };
		if (configuration.mode == AppMode.development) {
			legacyConfig.headers = { 'searchspring-no-beacon': '' };
		}

		const legacyConfiguration = new ApiConfiguration(legacyConfig);
		const suggestConfiguration = new ApiConfiguration({ mode: configuration.mode, origin: configuration.origin, cache: this.configuration.cache });

		this.requesters = {
			legacy: new LegacyAPI(legacyConfiguration),
			suggest: new SuggestAPI(suggestConfiguration),
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
