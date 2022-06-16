import { v4 as uuidv4 } from 'uuid';

import { BeaconEvent } from './BeaconEvent';
import { BeaconCategory, BeaconType } from './types';

describe('BeaconEvent', () => {
	it('can create login event', async () => {
		const data = {
			type: BeaconType.LOGIN,
			category: BeaconCategory.PERSONALIZATION,
			context: {
				userId: uuidv4(),
				sessionId: uuidv4(),
				shopperId: uuidv4(),
				pageLoadId: uuidv4(),
				website: {
					trackingCode: '8uyt2m',
				},
			},
			event: {},
			pid: uuidv4(),
		};
		const event = new BeaconEvent(data);

		expect(event.type).toStrictEqual(data.type);
		expect(event.category).toStrictEqual(data.category);
		expect(event.context).toStrictEqual(data.context);
		expect(event.event).toStrictEqual(data.event);
		expect(event.id).toBeDefined();
		expect(event.pid).toStrictEqual(data.pid);
		expect(event.meta.framework).toBeDefined();
	});

	it('can create event (login) with custom config', async () => {
		const config = {
			id: 'customTracker',
			framework: 'test',
		};
		const data = {
			type: BeaconType.LOGIN,
			category: BeaconCategory.PERSONALIZATION,
			context: {
				userId: uuidv4(),
				sessionId: uuidv4(),
				shopperId: uuidv4(),
				pageLoadId: uuidv4(),
				website: {
					trackingCode: '8uyt2m',
				},
			},
			event: {},
			pid: uuidv4(),
		};
		const event = new BeaconEvent(data, config);

		expect(event.type).toStrictEqual(data.type);
		expect(event.category).toStrictEqual(data.category);
		expect(event.context).toStrictEqual(data.context);
		expect(event.event).toStrictEqual(data.event);
		expect(event.id).toBeDefined();
		expect(event.pid).toStrictEqual(data.pid);
		expect(event.meta.framework).toStrictEqual(config.framework);
	});

	it('can create product view event', async () => {
		const data = {
			type: BeaconType.PRODUCT,
			category: BeaconCategory.PAGEVIEW,
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
				sku: 'product123',
				childSku: 'product123_a',
			},
		};
		const event = new BeaconEvent(data);

		expect(event.type).toStrictEqual(data.type);
		expect(event.category).toStrictEqual(data.category);
		expect(event.context).toStrictEqual(data.context);
		expect(event.event).toStrictEqual(data.event);
	});

	it('can create cart view event', async () => {
		const data = {
			type: BeaconType.CART,
			category: BeaconCategory.CARTVIEW,
			context: {
				userId: uuidv4(),
				sessionId: uuidv4(),
				shopperId: uuidv4(),
				pageLoadId: uuidv4(),
				website: {
					trackingCode: '8uyt2m',
				},
			},
			event: [
				{
					sku: 'product123',
					childSku: 'product123_a',
					qty: '1',
					price: '9.99',
				},
				{
					sku: 'product456',
					childSku: 'product456_a',
					qty: '2',
					price: '10.99',
				},
			],
		};
		const event = new BeaconEvent(data);

		expect(event.type).toStrictEqual(data.type);
		expect(event.category).toStrictEqual(data.category);
		expect(event.context).toStrictEqual(data.context);
		expect(event.event).toStrictEqual(data.event);
	});

	it('can create order view event', async () => {
		const data = {
			type: BeaconType.ORDER,
			category: BeaconCategory.ORDERVIEW,
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
				orderId: '123456',
				total: '42.96',
				city: 'Los Angeles',
				state: 'CA',
				country: 'US',
				items: [
					{
						sku: 'product123',
						childSku: 'product123_a',
						qty: '1',
						price: '9.99',
					},
					{
						sku: 'product456',
						childSku: 'product456_a',
						qty: '2',
						price: '10.99',
					},
				],
			},
		};
		const event = new BeaconEvent(data);

		expect(event.type).toStrictEqual(data.type);
		expect(event.category).toStrictEqual(data.category);
		expect(event.context).toStrictEqual(data.context);
		expect(event.event).toStrictEqual(data.event);
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
		const event = new BeaconEvent(data);

		expect(event.type).toStrictEqual(data.type);
		expect(event.category).toStrictEqual(data.category);
		expect(event.context).toStrictEqual(data.context);
		expect(event.event).toStrictEqual(data.event);
	});

	it('can create custom event object', async () => {
		const data = {
			type: BeaconType.CUSTOM,
			category: BeaconCategory.CUSTOM,
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
				hello: 'world',
			},
		};
		const event = new BeaconEvent(data);

		expect(event.type).toStrictEqual(data.type);
		expect(event.category).toStrictEqual(data.category);
		expect(event.context).toStrictEqual(data.context);
		expect(event.event).toStrictEqual(data.event);
	});
});
