import { v4 as uuidv4 } from 'uuid';

import { BeaconCategory, BeaconType } from './types';
import { TrackEvent } from './TrackEvent';

describe('TrackEvent', () => {
	it('can create click interaction event', async () => {
		const data = {
			type: BeaconType.CLICK,
			category: BeaconCategory.INTERACTION,
			context: {
				userId: uuidv4(),
				sessionId: uuidv4(),
				shopperId: uuidv4(),
				pageLoadId: uuidv4(),
				website: {
					trackingCode: '8uyt2m',
				},
			},
			event: {
				intellisuggestData: 'abc',
				intellisuggestSignature: 'def',
				href: '/hello',
			},
		};
		const event = new TrackEvent(data);

		expect(event.intellisuggestData).toBe(data.event.intellisuggestData);
		expect(event.intellisuggestSignature).toBe(data.event.intellisuggestSignature);
		expect(event.href).toBe(data.event.href);
		expect(event.endpoint).toContain(data.context.website.trackingCode);
		expect(event.img.src).toBe(event.src);
	});
});
