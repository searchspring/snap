import { AppMode } from '@searchspring/snap-toolbox';

import {
	AutocompleteRequestModel,
	AutocompleteResponseModel,
	MetaRequestModel,
	MetaResponseModel,
	SearchRequestModel,
	SearchResponseModel,
} from '@searchspring/snapi-types';

import { API, HTTPHeaders, LegacyAPI, SuggestAPI, ApiConfiguration, SuggestRequestModel, SuggestResponseModel } from '.';
import { transformSearchRequest, transformSearchResponse, transformSuggestResponse } from '../transforms';

export class HybridAPI extends API {
	private requesters: {
		legacy: LegacyAPI;
		suggest: SuggestAPI;
	};

	private requestersConfiguration: {
		legacy: ApiConfiguration;
		suggest: ApiConfiguration;
	};

	constructor(configuration: ApiConfiguration) {
		super(configuration);

		this.requestersConfiguration = {
			legacy: new ApiConfiguration({ origin: configuration.origin, cache: this.configuration.cache }),
			suggest: new ApiConfiguration({ origin: configuration.origin, cache: this.configuration.cache }),
		};

		this.requesters = {
			legacy: new LegacyAPI(this.requestersConfiguration.legacy),
			suggest: new SuggestAPI(this.requestersConfiguration.suggest),
		};
	}

	public setMode(mode: AppMode): void {
		if (Object.values(AppMode).includes(mode as AppMode)) {
			this.configuration.mode = mode as AppMode;

			// adding searchspring-no-beacon header to requests to search API to prevent reporting

			switch (mode) {
				case AppMode.development: {
					this.requestersConfiguration.legacy.headers = {
						'searchspring-no-beacon': '',
					};
					break;
				}

				case AppMode.production: {
					const previousHeaders = { ...this.requestersConfiguration.legacy.headers };
					delete previousHeaders['searchspring-no-beacon'];

					this.requestersConfiguration.legacy.headers = previousHeaders;
				}
			}

			this.requesters.legacy.setMode(mode);
			this.requesters.suggest.setMode(mode);
		}
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
