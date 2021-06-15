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
		expect(tracker.sessionStorage).toBeDefined();
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

	it('can invoke setNamespace method', async () => {
		const tracker = new Tracker(globals);

		expect(tracker.localStorage.key).toStrictEqual(`ss-tracker-${globals.siteId}-local`);
		expect(tracker.sessionStorage.key).toStrictEqual(`ss-tracker-${globals.siteId}-session`);

		const namespace = 'hello';
		tracker.setNamespace(namespace);

		expect(tracker.localStorage.key).toStrictEqual(`ss-${namespace}-${globals.siteId}-local`);
		expect(tracker.sessionStorage.key).toStrictEqual(`ss-${namespace}-${globals.siteId}-session`);
	});

	it('can invoke track.shopper.login', async () => {
		const tracker = new Tracker(globals);
		const shopperLogin = jest.spyOn(tracker.track.shopper, 'login');

		const shopperId = 'abc123';
		const payload = { data: { id: shopperId } };
		await tracker.track.shopper.login(payload);

		expect(tracker.context.shopperId).toStrictEqual(shopperId);
		expect(shopperLogin).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.product.view event method', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.product, 'view');

		const payload = {
			data: {
				sku: 'abc123',
				childSku: 'abc123_a',
			},
		};
		const beaconEvent = await tracker.track.product.view(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.PRODUCT);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.PAGEVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.product.click event method', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.product, 'click');

		const payload = {
			data: {
				intellisuggestData: 'abc123',
				intellisuggestSignature: 'def456',
				href: '/test',
			},
		};
		const beaconEvent = await tracker.track.product.click(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.CLICK);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.INTERACTION);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.cart.view event method', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.cart, 'view');

		const payload = {
			data: {
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
			},
		};
		const beaconEvent = await tracker.track.cart.view(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.CART);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.CARTVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.cart.view event method without item skus', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.cart, 'view');

		const payload = {
			data: {
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
			},
		};
		const beaconEvent = await tracker.track.cart.view(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.CART);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.CARTVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.order.transaction event method', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.order, 'transaction');

		const payload = {
			data: {
				orderId: '123456',
				total: '9.99',
				city: 'Los Angeles',
				state: 'CA',
				country: 'US',
				items: [
					{
						sku: 'abc123',
						childSku: 'abc123_a',
						qty: '1',
						price: '9.99',
					},
				],
			},
		};
		const beaconEvent = await tracker.track.order.transaction(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.ORDER);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.ORDERVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke track.order.transaction event method without item skus', async () => {
		const tracker = new Tracker(globals);

		const eventFn = jest.spyOn(tracker.track.order, 'transaction');

		const payload = {
			data: {
				orderId: '123456',
				total: '9.99',
				city: 'Los Angeles',
				state: 'CA',
				country: 'US',
				items: [
					{
						sku: 'abc123',
						childSku: 'abc123_a',
						qty: '1',
						price: '9.99',
					},
				],
			},
		};
		const beaconEvent = await tracker.track.order.transaction(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.ORDER);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.ORDERVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

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

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.CUSTOM);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.CUSTOM);
		expect(beaconEvent.payload.event).toStrictEqual(payload.event);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});
});
