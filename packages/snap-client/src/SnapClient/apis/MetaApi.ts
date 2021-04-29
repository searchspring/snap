import { AbstractApi, HTTPHeaders } from './AbstractApi';
import { MetaRequestModel, MetaResponseModel } from '@searchspring/snapi-types';

export class MetaApi extends AbstractApi {
	async postMeta(requestParameters: MetaRequestModel): Promise<MetaResponseModel> {
		const queryParameters: any = {};

		const headerParameters: HTTPHeaders = {};

		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request({
			path: `/meta`,
			method: 'POST',
			headers: headerParameters,
			query: queryParameters,
			body: requestParameters,
		});

		return response.json();
	}
}
