import {
	AutocompleteRequestModel,
	AutocompleteResponseModel,
	MetaRequestModel,
	MetaResponseModel,
	SearchRequestModel,
	SearchResponseModel,
} from '@searchspring/snapi-types';

import { API } from '.';
import { HTTPHeaders } from '../../types';

export class SnapAPI extends API {
	async postMeta(requestParameters: MetaRequestModel): Promise<MetaResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request(
			{
				path: '/api/v1/meta',
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			'/api/v1/meta' + JSON.stringify(requestParameters)
		);

		return response as MetaResponseModel;
	}

	async postSearch(requestParameters: SearchRequestModel): Promise<SearchResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request(
			{
				path: '/api/v1/search',
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			'/api/v1/search' + JSON.stringify(requestParameters)
		);

		return response as SearchResponseModel;
	}

	async postAutocomplete(requestParameters: AutocompleteRequestModel): Promise<AutocompleteResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request(
			{
				path: '/api/v1/autocomplete',
				method: 'POST',
				headers: headerParameters,
				body: requestParameters,
			},
			'/api/v1/autocomplete' + JSON.stringify(requestParameters)
		);

		return response as AutocompleteResponseModel;
	}
}
