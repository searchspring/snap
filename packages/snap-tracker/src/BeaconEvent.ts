import { v4 as uuidv4 } from 'uuid';

import { BeaconPayload } from './types';
import { PACKAGE_VERSION } from './version';

export class BeaconEvent {
	payload: BeaconPayload;

	constructor(payload: BeaconPayload) {
		this.payload = {
			...payload,
			meta: {
				initiator: {
					lib: 'searchspring/snap',
					'lib.version': PACKAGE_VERSION,
				},
			},
			id: uuidv4(),
		};
	}
}
