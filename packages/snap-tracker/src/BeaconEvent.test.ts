import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';

import { BeaconEvent } from './BeaconEvent';
import { BeaconCategory, BeaconType } from './types';

describe('BeaconEvent', () => {
	const trackerConfig = {
		id: 'customTracker',
		framework: 'test',
	};

	const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({} as Response);

	beforeEach(() => {
		fetchSpy.mockClear();
	});

	it('can create product click event', async () => {
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
		const event = new BeaconEvent(data, trackerConfig);

		expect(event.type).toStrictEqual(data.type);
		expect(event.category).toStrictEqual(data.category);
		expect(event.context).toStrictEqual(data.context);
		expect(event.event).toStrictEqual(data.event);

		const payload = event.send();
		expect(payload['origin']).toBeUndefined();
		expect(payload.type).toStrictEqual(data.type);
		expect(payload.category).toStrictEqual(data.category);
		expect(payload.context).toStrictEqual(data.context);
		expect(payload.event).toStrictEqual(data.event);
		expect(payload.meta).toStrictEqual({
			initiator: {
				lib: 'searchspring/snap',
				'lib.version': expect.any(String),
				'lib.framework': trackerConfig.framework,
			},
		});
		expect(payload.id).toBeDefined();
		expect(fetchSpy).toBeCalledWith('https://beacon.searchspring.io/beacon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
			keepalive: true,
		});
	});

	it('can provide custom beacon origin', async () => {
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

		const requesters = {
			beacon: {
				origin: 'https://custom.beacon.io',
			},
		};
		const event = new BeaconEvent(data, { ...trackerConfig, requesters });
		event.send();

		expect(fetchSpy).toHaveBeenCalledWith(`${requesters.beacon.origin}/beacon`, expect.any(Object));
	});
});
