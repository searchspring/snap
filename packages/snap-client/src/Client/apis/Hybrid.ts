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

const badges = [
	{
		tag: 'on-sale',
		label: '30% Off',
	},
	{
		tag: 'free-shipping',
		label: 'Free Shipping',
	},
	{
		tag: 'christmas',
		label: 'On Sale for Christmas',
	},
	{
		tag: 'specialoffer',
		label: 'Special Offer',
	},
];

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
		const mockBadgesMeta = {
			badges: {
				locations: {
					overlay: {
						left: [
							{
								name: 'left-upper',
								label: 'Left',
								description: 'description for left',
							},
							{
								name: 'left-middle-upper',
								label: 'Left',
								description: 'description for left',
							},
							{
								name: 'left-middle',
								label: 'Left',
								description: 'description for left',
							},
							{
								name: 'left-middle-lower',
								label: 'Left',
								description: 'description for left',
							},
							{
								name: 'left-lower',
								label: 'Left',
								description: 'description for left',
							},
						],
						right: [
							{
								name: 'right-upper',
								label: 'Right',
								description: 'description for right',
							},
							{
								name: 'right-middle-upper',
								label: 'Right',
								description: 'description for right',
							},
							{
								name: 'right-middle',
								label: 'Right',
								description: 'description for right',
							},
							{
								name: 'right-middle-lower',
								label: 'Right',
								description: 'description for right',
							},
							{
								name: 'right-lower',
								label: 'Right',
								description: 'description for right',
							},
						],
					},
					callouts: [
						{
							name: 'callout',
							label: 'Callout',
							description: 'description for callout',
						},
						{
							name: 'callout2',
							label: 'Callout2',
							description: 'description for callout2',
						},
					],
				},
				tags: {
					'on-sale': {
						location: 'left-middle-upper',
						component: 'BadgePill',
						parameters: {
							color: '#0000FF',
							colorText: '#FFFFFF',
						},
					},
					'free-shipping': {
						location: 'callout',
						component: 'BadgePill',
						parameters: {
							color: '#FF0000',
							colorText: '#FFFFFF',
						},
					},
					specialoffer: {
						location: 'callout2',
						component: 'BadgePill',
						parameters: {
							color: '#00ff00',
							colorText: '#000000',
						},
					},
					// "new": {
					// 	"location": "right",
					// 	"component": "BadgeStar",
					// 	"parameters": {
					// 		"color": "#faff00",
					// 		"colorText": "#000000",
					// 		"points": 5
					// 	}
					// },
					christmas: {
						location: 'right-lower',
						component: 'BadgeImage',
						parameters: {
							url: 'https://placehold.co/100x100',
						},
					},
				},
			},
		};
		return { ...(await this.requesters.legacy.getMeta(legacyRequestParameters)), ...mockBadgesMeta };
	}

	async getSearch(requestParameters: SearchRequestModel): Promise<SearchResponseModel> {
		const legacyRequestParameters = transformSearchRequest(requestParameters);

		const legacyData = await this.requesters.legacy.getSearch(legacyRequestParameters);

		const response = transformSearchResponse(legacyData, requestParameters);

		response.results = response.results.map((result: any, index: number) => {
			// if(badges[index]) {
			// 	return {
			// 		...result,
			// 		badges: [
			// 			badges[index],
			// 		],
			// 	}
			// }
			// return result;

			return {
				...result,
				badges: [
					badges[index % badges.length],
					// ...badges
				],
			};
		});
		return response;
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
		searchResults.results = searchResults.results.map((result: any, index: number) => {
			// if(badges[index]) {
			// 	return {
			// 		...result,
			// 		badges: [
			// 			badges[index],
			// 		],
			// 	}
			// }
			// return result;

			return {
				...result,
				badges: [
					badges[index % badges.length],
					// ...badges
				],
			};
		});

		return {
			...searchResults,
			autocomplete: transformedSuggestResults,
		};
	}
}
