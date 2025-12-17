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
import { INPUT_PARAM, SOURCE_PARAM, transformSearchRequest, transformSearchResponse, transformSuggestResponse } from '../transforms';
import type { SuggestRequestModel, HybridRequesterConfig } from '../../types';
export const DEVELOPMENT_MODE_PARAM = 'test';

export class HybridAPI extends API {
	private requesters: {
		legacy: LegacyAPI;
		suggest: SuggestAPI;
	};

	constructor(configuration: ApiConfiguration, requesterConfigurations?: HybridRequesterConfig) {
		super(configuration);

		const legacyConfig: ApiConfigurationParameters = deepmerge(
			{
				mode: this.configuration.mode,
				origin: this.configuration.origin,
				cache: this.configuration.cache,
				fetchApi: this.configuration.fetchApi,
			},
			requesterConfigurations?.legacy || {}
		);

		if (configuration.mode == AppMode.development) {
			legacyConfig.headers = { ...legacyConfig.headers };
		}

		const suggestConfig: ApiConfigurationParameters = deepmerge(
			{
				mode: this.configuration.mode,
				origin: this.configuration.origin,
				cache: this.configuration.cache,
				fetchApi: this.configuration.fetchApi,
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

		if (this.configuration.mode == AppMode.development) {
			legacyRequestParameters[DEVELOPMENT_MODE_PARAM] = true;
		}

		const legacyData = await this.requesters.legacy.getSearch(legacyRequestParameters);

		return transformSearchResponse(legacyData, requestParameters);
	}

	async getCategory(requestParameters: SearchRequestModel): Promise<SearchResponseModel> {
		const legacyRequestParameters = transformSearchRequest(requestParameters);

		if (this.configuration.mode == AppMode.development) {
			legacyRequestParameters[DEVELOPMENT_MODE_PARAM] = true;
		}

		const legacyData = await this.requesters.legacy.getCategory(legacyRequestParameters);

		return transformSearchResponse(legacyData, requestParameters);
	}

	async getFinder(requestParameters: SearchRequestModel): Promise<SearchResponseModel> {
		const legacyRequestParameters = transformSearchRequest(requestParameters);

		if (this.configuration.mode == AppMode.development) {
			legacyRequestParameters[DEVELOPMENT_MODE_PARAM] = true;
		}

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

		if (this.configuration.mode == AppMode.development) {
			queryParameters[DEVELOPMENT_MODE_PARAM] = true;
		}

		// modify the original request parameter for the transform
		if (requestParameters.search?.query?.string) {
			requestParameters.search.query.string = q;
		}

		// @ts-ignore - AutocompleteRequestModel to be updated
		if (requestParameters[INPUT_PARAM]) {
			// @ts-ignore - AutocompleteRequestModel to be updated
			queryParameters[INPUT_PARAM] = requestParameters[INPUT_PARAM];
		}

		// @ts-ignore - AutocompleteRequestModel to be updated
		if (requestParameters[SOURCE_PARAM]) {
			// @ts-ignore - AutocompleteRequestModel to be updated
			queryParameters[SOURCE_PARAM] = requestParameters[SOURCE_PARAM];
		}

		const legacyResults = await this.requesters.legacy.getAutocomplete(queryParameters);
		const searchResults = transformSearchResponse(legacyResults, requestParameters);

		return {
			...searchResults,
			autocomplete: transformedSuggestResults,
		};
	}
}
