import { Tracker } from './Tracker';
import { BeaconCategory, BeaconType } from './types';

const globals = {
	siteId: 'xxxzzz',
};

describe('Beacon Manager', () => {
	it('can create instance', async () => {
		const beacon = new Tracker(globals);

		expect(beacon.globals).toStrictEqual(globals);
		expect(beacon.localStorage).toBeDefined();
		expect(beacon.sessionStorage).toBeDefined();
		expect(beacon.context).toBeDefined();
		expect(beacon.context.userId).toBeDefined();
		expect(beacon.context.sessionId).toBeDefined();
		expect(beacon.context.shopperId).not.toBeDefined(); // should not be defined
		expect(beacon.context.pageLoadId).toBeDefined();
		expect(beacon.context.website).toBeDefined();
		expect(beacon.context.website.trackingCode).toBeDefined();
		expect(beacon.context.website.trackingCode).toStrictEqual(globals.siteId);
		expect(beacon.track).toBeDefined();
		expect(beacon.track.event).toBeDefined();
		expect(beacon.track.shopper.login).toBeDefined();
		expect(beacon.track.product.view).toBeDefined();
		expect(beacon.track.product.click).toBeDefined();
		expect(beacon.track.cart.view).toBeDefined();
		expect(beacon.track.order.transaction).toBeDefined();
	});

	it('can invoke setNamespace', async () => {
		const beacon = new Tracker(globals);

		expect(beacon.localStorage.key).toStrictEqual(`ss-tracker-${globals.siteId}-local`);
		expect(beacon.sessionStorage.key).toStrictEqual(`ss-tracker-${globals.siteId}-session`);

		const namespace = 'hello';
		beacon.setNamespace(namespace);

		expect(beacon.localStorage.key).toStrictEqual(`ss-${namespace}-${globals.siteId}-local`);
		expect(beacon.sessionStorage.key).toStrictEqual(`ss-${namespace}-${globals.siteId}-session`);
	});

	it('can invoke track.shopperLogin', async () => {
		const beacon = new Tracker(globals);
		const shopperLogin = jest.spyOn(beacon.track.shopper, 'login');

		const shopperId = 'abc123';
		const payload = { data: { id: shopperId } };
		await beacon.track.shopper.login(payload);

		expect(beacon.context.shopperId).toStrictEqual(shopperId);
		expect(shopperLogin).toHaveBeenCalledWith(payload);
	});

	it('can invoke product.view event method', async () => {
		const beacon = new Tracker(globals);

		const eventFn = jest.spyOn(beacon.track.product, 'view');

		const payload = {
			data: {
				sku: 'abc123',
				childSku: 'abc123_a',
			},
		};
		const beaconEvent = await beacon.track.product.view(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.PRODUCT);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.PAGEVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke product.click event method', async () => {
		const beacon = new Tracker(globals);

		const eventFn = jest.spyOn(beacon.track.product, 'click');

		const payload = {
			data: {
				intellisuggestData: 'abc123',
				intellisuggestSignature: 'def456',
				href: '/test',
			},
		};
		const beaconEvent = await beacon.track.product.click(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.CLICK);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.INTERACTION);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke cart.view event method', async () => {
		const beacon = new Tracker(globals);

		const eventFn = jest.spyOn(beacon.track.cart, 'view');

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
		const beaconEvent = await beacon.track.cart.view(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.CART);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.CARTVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke cart.view event method without item skus', async () => {
		const beacon = new Tracker(globals);

		const eventFn = jest.spyOn(beacon.track.cart, 'view');

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
		const beaconEvent = await beacon.track.cart.view(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.CART);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.CARTVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke order.transaction event method', async () => {
		const beacon = new Tracker(globals);

		const eventFn = jest.spyOn(beacon.track.order, 'transaction');

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
		const beaconEvent = await beacon.track.order.transaction(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.ORDER);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.ORDERVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke order.transaction event method without item skus', async () => {
		const beacon = new Tracker(globals);

		const eventFn = jest.spyOn(beacon.track.order, 'transaction');

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
		const beaconEvent = await beacon.track.order.transaction(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.ORDER);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.ORDERVIEW);
		expect(beaconEvent.payload.event).toStrictEqual(payload.data);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke custom event method', async () => {
		const beacon = new Tracker(globals);

		const eventFn = jest.spyOn(beacon.track, 'event');

		const payload = {
			type: BeaconType.CUSTOM,
			category: BeaconCategory.CUSTOM,
			event: {
				custom: '123',
			},
		};
		const beaconEvent = await beacon.track.event(payload);

		expect(beaconEvent.payload.type).toStrictEqual(BeaconType.CUSTOM);
		expect(beaconEvent.payload.category).toStrictEqual(BeaconCategory.CUSTOM);
		expect(beaconEvent.payload.event).toStrictEqual(payload.event);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});
});
