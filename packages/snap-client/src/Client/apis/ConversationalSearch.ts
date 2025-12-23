import { API } from './Abstract';
import { HTTPHeaders } from '../../types';

export class ConversationalSearchAPI extends API {
	async postMessage(queryParameters: any): Promise<any> {
		const headerParameters: HTTPHeaders = {};

		headerParameters['Content-Type'] = 'application/json';

		const response = await this.request<any>(
			{
				path: '/chat/send',
				method: 'POST',
				headers: headerParameters,
				query: queryParameters,
			},
			JSON.stringify(queryParameters)
		);

		return response;
	}
}
