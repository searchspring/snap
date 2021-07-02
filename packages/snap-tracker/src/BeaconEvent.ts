import { v4 as uuidv4 } from 'uuid';

import { BeaconPayload } from './types';
import { PACKAGE_VERSION } from './version';

export class BeaconEvent implements BeaconPayload {
	type;
	category;
	context;
	event;
	meta;
	id;
	pid?;

	constructor(payload: BeaconPayload) {
		Object.keys(payload).forEach((key) => {
			this[key] = payload[key];
		});
		this.meta = {
			initiator: {
				lib: 'searchspring/snap',
				'lib.version': PACKAGE_VERSION,
			},
		};
		this.id = uuidv4();
	}
}
