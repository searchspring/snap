import { API, ApiConfiguration, HTTPHeaders } from './Abstract';

export class BeaconAPI extends API {
	constructor(config: ApiConfiguration) {
		super(config);
	}

	async sendEvents(events: Array<any>): Promise<Response> {
		const headerParameters: HTTPHeaders = {};
		headerParameters['Content-Type'] = 'application/json';

		const path = '/beacon';

		const response = await this.request({
			path,
			method: 'POST',
			headers: headerParameters,
			body: events.length == 1 ? events[0] : events,
		});

		return response;
	}
}
