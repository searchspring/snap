import { Tracker } from './Tracker';
import { BeaconCategory, BeaconType } from './types';

const globals = {
	siteId: 'xxxzzz',
};

describe('Tracker', () => {
	it('can create instance', async () => {
		const tracker = new Tracker(globals);

		expect(tracker.globals).toStrictEqual(globals);
		expect(tracker.localStorage).toBeDefined();
		expect(tracker.context).toBeDefined();
		expect(tracker.context.userId).toBeDefined();
		expect(tracker.context.sessionId).toBeDefined();
		expect(tracker.context.shopperId).not.toBeDefined(); // should not be defined
		expect(tracker.context.pageLoadId).toBeDefined();
		expect(tracker.context.website).toBeDefined();
		expect(tracker.context.website.trackingCode).toBeDefined();
		expect(tracker.context.website.trackingCode).toStrictEqual(globals.siteId);
		expect(tracker.track).toBeDefined();
		expect(tracker.track.event).toBeDefined();
		expect(tracker.track.shopper.login).toBeDefined();
		expect(tracker.track.product.view).toBeDefined();
		expect(tracker.track.product.click).toBeDefined();
		expect(tracker.track.cart.view).toBeDefined();
		expect(tracker.track.order.transaction).toBeDefined();
	});

	it('can pass config and use custom namespace', async () => {
		const config = {
			namespace: 'trackerrrr',
		};

		const tracker = new Tracker(globals);

		expect(tracker.localStorage.key).toStrictEqual(`ss-track-${globals.siteId}-local`);

		const tracker2 = new Tracker(globals, config);

		expect(tracker2.localStorage.key).toStrictEqual(`ss-${config.namespace}-${globals.siteId}-local`);
	});

	it('can invoke track.shopper.login', async () => {
		const tracker = new Tracker(globals);
		const shopperLogin = jest.spyOn(tracker.track.shopper, 'login');

		const shopperId = 'abc123';
		const payload = { id: shopperId };
		await tracker.track.shopper.login(payload);

		expect(tracker.context.shopperId).toStrictEqual(shopperId);
		expect(shopperLogin).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.product.view event method', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.product, 'view');

		const payload = {
			sku: 'abc123',
			childSku: 'abc123_a',
		};
		const beaconEvent = await tracker.track.product.view(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.PRODUCT);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.PAGEVIEW);
		expect(beaconEvent.event).toStrictEqual(payload);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.product.click event method', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.product, 'click');

		const payload = {
			intellisuggestData: 'abc123',
			intellisuggestSignature: 'def456',
			href: '/test',
		};
		const beaconEvent = await tracker.track.product.click(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.CLICK);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.INTERACTION);
		expect(beaconEvent.event).toStrictEqual(payload);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.cart.view event method', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.cart, 'view');

		const payload = {
			items: [
				{
					sku: 'abc123',
					childSku: 'abc123_a',
					qty: '1',
					price: '9.99',
				},
				{
					sku: 'def456',
					childSku: 'def456_a',
					qty: '2',
					price: '10.99',
				},
			],
		};
		const beaconEvent = await tracker.track.cart.view(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.CART);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.CARTVIEW);
		expect(beaconEvent.event).toStrictEqual(payload);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.cart.view event method without item skus', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.cart, 'view');

		const payload = {
			items: [
				{
					childSku: 'abc123_a',
					qty: '1',
					price: '9.99',
				},
				{
					childSku: 'def456_a',
					qty: '2',
					price: '10.99',
				},
			],
		};
		const beaconEvent = await tracker.track.cart.view(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.CART);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.CARTVIEW);
		expect(beaconEvent.event).toStrictEqual(payload);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.order.transaction event method', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.order, 'transaction');

		const payload = {
			order: {
				id: '123456',
				total: '9.99',
				city: 'Los Angeles',
				state: 'CA',
				country: 'US',
			},
			items: [
				{
					sku: 'abc123',
					childSku: 'abc123_a',
					qty: '1',
					price: '9.99',
				},
			],
		};
		const beaconEvent = await tracker.track.order.transaction(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.ORDER);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.ORDERVIEW);
		expect(beaconEvent.event).toStrictEqual({
			orderId: payload.order.id,
			total: payload.order.total,
			city: payload.order.city,
			state: payload.order.state,
			country: payload.order.country,
			items: payload.items,
		});

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.order.transaction event method without item skus', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.order, 'transaction');

		const payload = {
			order: {
				id: '123456',
				total: '9.99',
				city: 'Los Angeles',
				state: 'CA',
				country: 'US',
			},
			items: [
				{
					sku: 'abc123',
					childSku: 'abc123_a',
					qty: '1',
					price: '9.99',
				},
			],
		};
		const beaconEvent = await tracker.track.order.transaction(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.ORDER);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.ORDERVIEW);
		expect(beaconEvent.event).toStrictEqual({
			orderId: payload.order.id,
			total: payload.order.total,
			city: payload.order.city,
			state: payload.order.state,
			country: payload.order.country,
			items: payload.items,
		});

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke generic track.event method', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track, 'event');

		const payload = {
			type: BeaconType.CUSTOM,
			category: BeaconCategory.CUSTOM,
			event: {
				custom: '123',
			},
		};
		const beaconEvent = await tracker.track.event(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.CUSTOM);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.CUSTOM);
		expect(beaconEvent.event).toStrictEqual(payload.event);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});
});
