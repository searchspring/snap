import { v4 as uuidv4 } from 'uuid';
import { version } from '@searchspring/snap-version';

import { BeaconPayload } from './types';

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
				'lib.version': version,
			},
		};
		this.id = uuidv4();
	}
}
