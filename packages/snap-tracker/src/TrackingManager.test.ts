import { TrackingManager } from './TrackingManager';
import { BeaconCategory, BeaconType } from './types';

const globals = {
	siteId: 'xxxzzz',
};

describe('Beacon Manager', () => {
	it('can create instance', async () => {
		const beacon = new TrackingManager(globals);

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
		expect(beacon.track.shopperLogin).toBeDefined();
	});

	it('can invoke setNamespace', async () => {
		const beacon = new TrackingManager(globals);

		expect(beacon.localStorage.key).toStrictEqual('ss-beacon-local');
		expect(beacon.sessionStorage.key).toStrictEqual('ss-beacon-session');

		const namespace = 'hello';
		beacon.setNamespace(namespace);

		expect(beacon.localStorage.key).toStrictEqual(`ss-${namespace}-local`);
		expect(beacon.sessionStorage.key).toStrictEqual(`ss-${namespace}-session`);
	});

	it('can invoke track.shopperLogin', async () => {
		const beacon = new TrackingManager(globals);
		const shopperLogin = jest.spyOn(beacon.track, 'shopperLogin');

		const shopperId = 'abc123';
		await beacon.track.shopperLogin(shopperId);

		expect(beacon.context.shopperId).toStrictEqual(shopperId);
		expect(shopperLogin).toHaveBeenCalledWith(shopperId);
	});

	it('can invoke product.click event method', async () => {
		const beacon = new TrackingManager(globals);

		const eventFn = jest.spyOn(beacon, 'event');

		const payload = {
			type: BeaconType.CLICK,
			category: BeaconCategory.INTERACTION,
			event: {
				intellisuggestData: 'abc',
				intellisuggestSignature: '123',
				href: '/hello',
			},
		};
		const beaconEvent = beacon.event(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.CLICK);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.INTERACTION);
		expect(beaconEvent.event).toStrictEqual(payload.event);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke product.view event method', async () => {
		const beacon = new TrackingManager(globals);

		const eventFn = jest.spyOn(beacon, 'event');

		const payload = {
			type: BeaconType.PRODUCT,
			category: BeaconCategory.PAGEVIEW,
			event: {
				sku: 'abc123',
				childSku: 'abc123_a',
			},
		};
		const beaconEvent = beacon.event(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.PRODUCT);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.PAGEVIEW);
		expect(beaconEvent.event).toStrictEqual(payload.event);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke cart.view event method', async () => {
		const beacon = new TrackingManager(globals);

		const eventFn = jest.spyOn(beacon, 'event');

		const payload = {
			type: BeaconType.CART,
			category: BeaconCategory.CARTVIEW,
			event: [
				{
					sku: 'abc123',
					childSku: 'abc123_a',
					qty: '1',
					price: '9.99',
				},
				{
					sku: 'abc456',
					childSku: 'abc456_a',
					qty: '2',
					price: '10.99',
				},
			],
		};
		const beaconEvent = beacon.event(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.CART);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.CARTVIEW);
		expect(beaconEvent.event).toStrictEqual(payload.event);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke cart.view event method without item skus', async () => {
		const beacon = new TrackingManager(globals);

		const eventFn = jest.spyOn(beacon, 'event');

		const payload = {
			type: BeaconType.CART,
			category: BeaconCategory.CARTVIEW,
			event: [
				{
					childSku: 'abc123_a',
					qty: '1',
					price: '9.99',
				},
				{
					childSku: 'abc456_a',
					qty: '2',
					price: '10.99',
				},
			],
		};
		const beaconEvent = beacon.event(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.CART);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.CARTVIEW);
		expect(beaconEvent.event).toStrictEqual(payload.event);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke order.transaction event method', async () => {
		const beacon = new TrackingManager(globals);

		const eventFn = jest.spyOn(beacon, 'event');

		const payload = {
			type: BeaconType.ORDER,
			category: BeaconCategory.ORDERVIEW,
			event: {
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
		const beaconEvent = beacon.event(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.ORDER);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.ORDERVIEW);
		expect(beaconEvent.event).toStrictEqual(payload.event);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke order.transaction event method without item skus', async () => {
		const beacon = new TrackingManager(globals);

		const eventFn = jest.spyOn(beacon, 'event');

		const payload = {
			type: BeaconType.ORDER,
			category: BeaconCategory.ORDERVIEW,
			event: {
				orderId: '123456',
				total: '9.99',
				city: 'Los Angeles',
				state: 'CA',
				country: 'US',
				items: [
					{
						childSku: 'abc123_a',
						qty: '1',
						price: '9.99',
					},
				],
			},
		};
		const beaconEvent = beacon.event(payload);

		expect(beaconEvent.type).toStrictEqual(BeaconType.ORDER);
		expect(beaconEvent.category).toStrictEqual(BeaconCategory.ORDERVIEW);
		expect(beaconEvent.event).toStrictEqual(payload.event);

		expect(eventFn).toHaveBeenCalledTimes(1);
		expect(eventFn).toHaveBeenCalledWith(payload);
	});

	it('can invoke init method', async () => {
		const beacon = new TrackingManager(globals);

		const initFn = jest.spyOn(beacon, 'init');
		const setIntervalFn = jest.spyOn(global.window, 'setInterval');

		beacon.init();

		expect(initFn).toHaveBeenCalledTimes(1);
		expect(setIntervalFn).toHaveBeenCalledTimes(1);
	});
});
