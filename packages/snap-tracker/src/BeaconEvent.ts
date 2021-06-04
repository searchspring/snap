import { v4 as uuidv4 } from 'uuid';

import {
	BeaconPayload,
	BeaconType,
	BeaconCategory,
	BeaconContext,
	ProductViewEvent,
	CartViewEvent,
	OrderTransactionEvent,
	RecommendationsEvent,
	TrackClickEvent,
	CustomBeaconEvent,
} from './types';

const VERSION = process.env.npm_package_version || 'dev';

export class BeaconEvent {
	payload: BeaconPayload;

	type: BeaconType;
	category: BeaconCategory;
	context: BeaconContext;
	event:
		| ProductViewEvent
		| CartViewEvent[]
		| OrderTransactionEvent
		| RecommendationsEvent
		| TrackClickEvent
		| CustomBeaconEvent
		| Record<string, never>;
	pid: string;
	id: string;

	constructor(payload: BeaconPayload) {
		this.type = payload.type;
		this.category = payload.category;
		this.context = payload.context;
		this.event = payload.event;
		this.pid = payload.pid || null;
		this.id = uuidv4();

		this.createPayload();
	}

	createPayload = (): void => {
		this.payload = {
			type: this.type,
			category: this.category,
			context: this.context,
			meta: {
				initiator: {
					lib: 'searchspring/snap',
					'lib.version': VERSION,
				},
			},
			event: this.event,
			id: this.id,
			pid: this.pid,
		};
	};
}
