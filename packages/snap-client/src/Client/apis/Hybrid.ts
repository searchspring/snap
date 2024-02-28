import deepmerge from 'deepmerge';
import { AppMode } from '@searchspring/snap-toolbox';

import {
	AutocompleteRequestModel,
	AutocompleteResponseModel,
	MetaRequestModel,
	MetaResponseModel,
	SearchRequestModel,
	SearchResponseModel,
} from '@searchspring/snapi-types';

import { API, ApiConfigurationParameters, LegacyAPI, SuggestAPI, ApiConfiguration } from '.';
import { transformSearchRequest, transformSearchResponse, transformSuggestResponse } from '../transforms';
import type { SuggestRequestModel, HybridRequesterConfig } from '../../types';

export class HybridAPI extends API {
	private requesters: {
		legacy: LegacyAPI;
		suggest: SuggestAPI;
	};

	constructor(configuration: ApiConfiguration, requesterConfigurations?: HybridRequesterConfig) {
		super(configuration);

		const legacyConfig: ApiConfigurationParameters = deepmerge(
			{
				mode: configuration.mode,
				origin: configuration.origin,
				cache: this.configuration.cache,
			},
			requesterConfigurations?.legacy || {}
		);

		if (configuration.mode == AppMode.development) {
			legacyConfig.headers = { ...legacyConfig.headers, 'searchspring-no-beacon': '' };
		}

		const suggestConfig = deepmerge(
			{
				mode: configuration.mode,
				origin: configuration.origin,
				cache: this.configuration.cache,
			},
			requesterConfigurations?.suggest || {}
		);

		const legacyConfiguration = new ApiConfiguration(legacyConfig);
		const suggestConfiguration = new ApiConfiguration(suggestConfig);

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

		// determine the query to utilize
		let q = (transformedSuggestResults.suggested || {}).text || transformedSuggestResults.correctedQuery || transformedSuggestResults.query;
		if (this.requesters.suggest.configuration?.globals?.integratedSpellCorrection) {
			q = (transformedSuggestResults.suggested || {}).text || transformedSuggestResults.query || transformedSuggestResults.correctedQuery;
		}

		const queryParameters = {
			...legacyRequestParameters,
			redirectResponse: 'full',
			q,
		};

		// modify the original request parameter for the transform
		if (requestParameters.search?.query?.string) {
			requestParameters.search.query.string = q;
		}

		const legacyResults = await this.requesters.legacy.getAutocomplete(queryParameters);
		const searchResults = transformSearchResponse(legacyResults, requestParameters);

		return {
			...searchResults,
			autocomplete: transformedSuggestResults,
		};
	}
}
