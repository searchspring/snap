import {
	AutocompleteRequestModel,
	AutocompleteResponseModel,
	MetaRequestModel,
	MetaResponseModel,
	SearchRequestModel,
	SearchResponseModel,
} from '@searchspring/snapi-types';

import { API, HTTPHeaders } from '.';

export class SnapAPI extends API {
	async postMeta(requestParameters: MetaRequestModel): Promise<MetaResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request({
			path: '/api/v1/meta',
			method: 'POST',
			headers: headerParameters,
			body: requestParameters,
		});

		return response.json();
	}

	async postSearch(requestParameters: SearchRequestModel): Promise<SearchResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request({
			path: '/api/v1/search',
			method: 'POST',
			headers: headerParameters,
			body: requestParameters,
		});

		return response.json();
	}

	async postAutocomplete(requestParameters: AutocompleteRequestModel): Promise<AutocompleteResponseModel> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request({
			path: '/api/v1/autocomplete',
			method: 'POST',
			headers: headerParameters,
			body: requestParameters,
		});

		return response.json();
	}
}
