import { v4 as uuidv4 } from 'uuid';

import { BeaconCategory, BeaconType } from './types';
import { TrackEvent } from './TrackEvent';

describe('TrackEvent', () => {
	it('throws if context is not provided', async () => {
		const data = {
			type: BeaconType.CLICK,
			category: BeaconCategory.INTERACTION,
			event: {
				intellisuggestData: 'abc',
				intellisuggestSignature: 'def',
				href: '/hello',
			},
		};

		expect(() => {
			// @ts-ignore
			new TrackEvent(data);
		}).toThrow();
	});

	it('throws if event is not provided', async () => {
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
		};
		expect(() => {
			// @ts-ignore
			new TrackEvent(data);
		}).toThrow();
	});

	it('throws if event is not valid', async () => {
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
				// intellisuggestData: 'abc',
				// intellisuggestSignature: 'def',
				// href: '/hello',
			},
		};
		expect(() => {
			// @ts-ignore
			new TrackEvent(data);
		}).toThrow();
	});

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

	it('can create click interaction event without href', async () => {
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
			},
		};
		const event = new TrackEvent(data);

		expect(event.href).toBe('');
	});

	it('can create click interaction event with referrer', async () => {
		const referrer = 'https://www.example.com';
		Object.defineProperty(document, 'referrer', { value: referrer, configurable: true });

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

		expect(event.img.src).toContain(`&r=${encodeURIComponent(referrer)}`);
	});
});
