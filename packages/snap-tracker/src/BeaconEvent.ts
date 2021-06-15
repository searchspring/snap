import { v4 as uuidv4 } from 'uuid';

import { BeaconPayload } from './types';

const VERSION = process.env.npm_package_version || 'dev';

export class BeaconEvent {
	payload: BeaconPayload;

	constructor(payload: BeaconPayload) {
		this.payload = {
			...payload,
			meta: {
				initiator: {
					lib: 'searchspring/snap',
					'lib.version': VERSION,
				},
			},
			id: uuidv4(),
		};
	}
}
