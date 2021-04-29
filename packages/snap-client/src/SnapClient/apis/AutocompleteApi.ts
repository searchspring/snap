import { AbstractApi, HTTPHeaders } from './AbstractApi';
import { AutocompleteRequestModel, AutocompleteResponseModel } from '@searchspring/snapi-types';

export class AutocompleteApi extends AbstractApi {
	async postAutocomplete(requestParameters: AutocompleteRequestModel): Promise<AutocompleteResponseModel> {
		const queryParameters: any = {};

		const headerParameters: HTTPHeaders = {};

		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request({
			path: `/autocomplete`,
			method: 'POST',
			headers: headerParameters,
			query: queryParameters,
			body: requestParameters,
		});

		return response.json();
	}
}
