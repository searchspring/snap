import { v4 as uuidv4 } from 'uuid';
import { version } from '@searchspring/snap-toolbox';

import * as Types from './types';

import { BeaconPayload } from './types';

export class BeaconEvent {
	type: any;
	category: any;
	context?: Types.BeaconContext;
	meta?: Types.BeaconMeta;
	event?:
		| Types.ProductViewEvent
		| Types.CartViewEvent
		| Types.OrderTransactionEvent
		| Types.RecommendationsEvent
		| Types.ProductClickEvent
		| Types.CustomBeaconEvent
		| Record<string, never>;
	id?: string;
	pid?: string | null;

	constructor(payload: BeaconPayload, config: TrackerConfig) {
		this.type = payload.type;
		this.category = payload.category;
		this.context = payload.context;
		this.meta = payload.meta;
		this.event = payload.event;
		this.id = payload.id;
		this.pid = payload.pid;

		this.meta = {
			initiator: {
				lib: 'searchspring/snap',
				'lib.version': version,
				framework: config.framework,
			},
		};
		this.id = uuidv4();
	}
}
