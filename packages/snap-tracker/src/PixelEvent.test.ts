import { v4 as uuidv4 } from 'uuid';

import { BeaconCategory, BeaconType } from './types';
import { PixelEvent } from './PixelEvent';

describe('PixelEvent', () => {
	it('can create page view event', async () => {
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
			},
		};
		const event = new PixelEvent(data);

		expect(event.event).toStrictEqual(data.event);
		expect(event.src).toContain('&a=viewItem');
		expect(event.src).toContain(event.endpoint);
		expect(event.src).toContain(data.event.sku);
		expect(event.img.src).toBe(event.src);
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
					qty: '3',
					price: '10.99',
				},
			],
		};
		const event = new PixelEvent(data);

		expect(event.event).toStrictEqual(data.event);
		expect(event.src).toContain('&a=basket');
		expect(event.src).toContain(event.endpoint);
		expect(event.event).toHaveLength(data.event.length);

		data.event.forEach((cartItem) => {
			expect(event.src).toContain(cartItem.sku);
			expect(event.src).toContain(cartItem.qty);
			expect(event.src).toContain(cartItem.price);
		});

		expect(event.img.src).toBe(event.src);
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
						qty: '3',
						price: '10.99',
					},
				],
			},
		};
		const event = new PixelEvent(data);

		expect(event.event).toStrictEqual(data.event);
		expect(event.src).toContain('&a=sale');
		expect(event.src).toContain(event.endpoint);
		expect(event.src.split('&item=')).toHaveLength(data.event.items.length + 1);

		data.event.items.forEach((orderItem) => {
			expect(event.src).toContain(orderItem.sku);
			expect(event.src).toContain(orderItem.qty);
			expect(event.src).toContain(orderItem.price);
		});

		expect(event.src).toContain(`&orderId=${encodeURIComponent(data.event.orderId)}`);
		expect(event.src).toContain(`&total=${encodeURIComponent(data.event.total)}`);
		expect(event.src).toContain(`&city=${encodeURIComponent(data.event.city)}`);
		expect(event.src).toContain(`&state=${encodeURIComponent(data.event.state)}`);
		expect(event.src).toContain(`&country=${encodeURIComponent(data.event.country)}`);

		expect(event.img.src).toBe(event.src);
	});
});
