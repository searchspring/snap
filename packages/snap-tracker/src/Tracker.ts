import deepmerge from 'deepmerge';
import { v4 as uuidv4 } from 'uuid';

import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { cookies, featureFlags, version } from '@searchspring/snap-toolbox';

import { TrackEvent } from './TrackEvent';
import { PixelEvent } from './PixelEvent';
import { BeaconEvent } from './BeaconEvent';
import {
	TrackerGlobals,
	TrackMethods,
	BeaconPayload,
	BeaconType,
	BeaconCategory,
	BeaconContext,
	ProductViewEvent,
	CartViewEvent,
	ProductClickEvent,
	ShopperLoginEvent,
	OrderTransactionEvent,
	Product,
} from './types';

const BATCH_TIMEOUT = 150;
const USERID_COOKIE_NAME = 'ssUserId';
const SHOPPERID_COOKIE_NAME = 'ssShopperId';
const COOKIE_EXPIRATION = 31536000000; // 1 year
const VIEWED_COOKIE_EXPIRATION = 220752000000; // 7 years
const COOKIE_SAMESITE = 'Lax';
const SESSIONID_STORAGE_NAME = 'ssSessionIdNamespace';
const LOCALSTORAGE_BEACON_POOL_NAME = 'ssBeaconPool';
const VIEWED_PRODUCTS = 'ssViewedProducts';
const MAX_VIEWED_COUNT = 15;
const CART_PRODUCTS = 'ssCartProducts';

export class Tracker {
	globals: TrackerGlobals;
	localStorage: StorageStore;
	sessionStorage: StorageStore;
	context: BeaconContext;
	isSending: number;
	namespace = '';

	constructor(globals: TrackerGlobals) {
		if (typeof globals != 'object' || typeof globals.siteId != 'string') {
			throw new Error(`Invalid config passed to tracker. The "siteId" attribute must be provided.`);
		}

		this.globals = globals;
		this.setNamespace();

		this.context = {
			...this.getUserId(),
			...this.getSessionId(),
			...this.getShopperId(),
			pageLoadId: uuidv4(),
			website: {
				trackingCode: this.globals.siteId,
			},
		};

		if (!window.searchspring?.track) {
			this.setGlobal();
		}

		this.sendEvents();
	}

	setNamespace = (namespace?: string): void => {
		let prefix = 'tracker';
		if (namespace) {
			this.namespace = `${namespace}`;
			prefix = namespace;
		}
		this.localStorage = new StorageStore({
			type: StorageType.LOCAL,
			key: `ss-${prefix}-${this.globals.siteId}-local`,
		});
		this.sessionStorage = new StorageStore({
			type: StorageType.SESSION,
			key: `ss-${prefix}-${this.globals.siteId}-session`,
		});
	};

	setGlobal = (): void => {
		window.searchspring = window.searchspring || {};
		window.searchspring.track = this.track;
		window.searchspring.version = version;
	};

	track: TrackMethods = {
		event: (payload: BeaconPayload): BeaconEvent => {
			const event: BeaconPayload = {
				type: payload?.type || BeaconType.CUSTOM,
				category: payload?.category || BeaconCategory.CUSTOM,
				context: payload?.context ? deepmerge(this.context, payload.context) : this.context,
				event: payload.event,
				pid: payload?.pid || undefined,
			};

			const beaconEvent = new BeaconEvent(event);
			this.sendEvents([beaconEvent]);

			return beaconEvent;
		},

		shopper: {
			login: (details: { data: ShopperLoginEvent; siteId?: string }): BeaconEvent => {
				// sets shopperid if logged in
				if (!featureFlags.cookies) {
					return;
				}
				if (!details.data.id) {
					console.error('tracker.shopper.login event: requires a valid shopper ID parameter. Example: tracker.shopper.login("1234")');
					return;
				}
				let context = this.context;
				if (details.siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: details.siteId,
							},
						},
					});
				}
				const storedShopperId = this.getShopperId()?.shopperId;
				details.data.id = `${details.data.id}`;
				if (storedShopperId != details.data.id) {
					// user's logged in id has changed, update shopperId cookie send login event
					cookies.set(SHOPPERID_COOKIE_NAME, details.data.id, COOKIE_SAMESITE, COOKIE_EXPIRATION);
					this.context.shopperId = details.data.id;

					const payload = {
						type: BeaconType.LOGIN,
						category: BeaconCategory.PERSONALIZATION,
						context,
						event: {},
					};
					return this.track.event(payload);
				}
			},
		},
		product: {
			view: (details: { data: ProductViewEvent; siteId: string }): BeaconEvent => {
				if (!details?.data?.sku && !details?.data?.childSku) {
					console.error(
						'track.product.view event: requires a valid sku and/or childSku. \nExample: track.product.view({ sku: "product123", childSku: "product123_a" })'
					);
					return;
				}
				let context = this.context;
				if (details.siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: details.siteId,
							},
						},
					});
				}
				const payload = {
					type: BeaconType.PRODUCT,
					category: BeaconCategory.PAGEVIEW,
					context,
					event: {
						sku: details.data?.sku ? `${details.data.sku}` : undefined,
						childSku: details.data?.childSku ? `${details.data.childSku}` : undefined,
					},
				};

				// save recently viewed products to cookie
				if (details.data?.sku || details.data?.childSku) {
					const viewedProducts = cookies.get(VIEWED_PRODUCTS);
					const products = viewedProducts ? new Set(viewedProducts.split(',')) : new Set();
					products.add(details.data?.sku || details.data.childSku);
					cookies.set(VIEWED_PRODUCTS, Array.from(products).slice(0, MAX_VIEWED_COUNT).join(','), COOKIE_SAMESITE, VIEWED_COOKIE_EXPIRATION);
				}

				// legacy tracking
				if (details.data?.sku) {
					// only send sku to pixel tracker if present (don't send childSku)
					new PixelEvent({
						...payload,
						event: {
							sku: details.data.sku,
						},
					});
				}

				return this.track.event(payload);
			},
			click: (details: { data: ProductClickEvent; siteId?: string }): BeaconEvent => {
				if (!details.data?.intellisuggestData || !details.data?.intellisuggestSignature) {
					console.error(
						`track.product.click event: object parameter requires a valid intellisuggestData and intellisuggestSignature. \nExample: track.click.product([{ intellisuggestData: "eJwrTs4tNM9jYCjKTM8oYXDWdQ3TDTfUDbIwMDVjMARCYwMQSi_KTAEA9IQKWA", intellisuggestSignature: "9e46f9fd3253c267fefc298704e39084a6f8b8e47abefdee57277996b77d8e70" }])`
					);
					return;
				}
				let context = this.context;
				if (details.siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: details.siteId,
							},
						},
					});
				}
				const payload = {
					type: BeaconType.CLICK,
					category: BeaconCategory.INTERACTION,
					context,
					event: {
						intellisuggestData: details.data.intellisuggestData,
						intellisuggestSignature: details.data.intellisuggestSignature,
						href: details.data?.href ? `${details.data.href}` : undefined,
					},
				};

				// legacy tracking
				new TrackEvent(payload);

				return this.track.event(payload);
			},
		},
		cart: {
			view: (details: { data: CartViewEvent; siteId?: string }): BeaconEvent => {
				if (!Array.isArray(details?.data?.items) || !details?.data?.items.length) {
					console.error(
						'track.view.cart event: parameter must be an array of cart items. \nExample: track.view.cart([{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }])'
					);
					return;
				}
				let context = this.context;
				if (details.siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: details.siteId,
							},
						},
					});
				}
				const items = details.data.items.map((item, index) => {
					if (!item?.qty || !item?.price || (!item?.sku && !item?.childSku)) {
						console.error(
							`track.view.cart event: item ${item} at index ${index} requires a valid qty, price, and (sku and/or childSku.) \nExample: track.view.cart([{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }])`
						);
						return;
					}
					const product: Product = {
						qty: `${item.qty}`,
						price: `${item.price}`,
					};
					if (item?.sku) {
						product.sku = `${item.sku}`;
					}
					if (item?.childSku) {
						product.childSku = `${item.childSku}`;
					}
					return product;
				});
				const payload = {
					type: BeaconType.CART,
					category: BeaconCategory.CARTVIEW,
					context,
					event: { items },
				};

				// save cart items to cookie
				if (items.length) {
					const products = [];
					items.map((item) => products.push(item.sku || item.childSku));
					cookies.set(CART_PRODUCTS, products.join(','), COOKIE_SAMESITE, 0);
				}

				// legacy tracking
				new PixelEvent(payload);

				return this.track.event(payload);
			},
		},
		order: {
			transaction: (details: { data: OrderTransactionEvent; siteId?: string }): BeaconEvent => {
				if (!details.data?.items || !Array.isArray(details.data.items) || !details.data.items.length) {
					console.error(
						'track.order.transaction event: object parameter must contain `items` array of cart items. \nExample: order.transaction({ items: [{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }], orderId: "1001", total: "9.99", city: "Los Angeles", state: "CA", country: "US"})'
					);
					return;
				}
				let context = this.context;
				if (details.siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: details.siteId,
							},
						},
					});
				}
				const items = details.data.items.map((item, index) => {
					if (!item?.qty || !item?.price || (!item?.sku && !item?.childSku)) {
						console.error(
							`track.order.transaction event: object parameter \`items\`: item ${item} at index ${index} requires a valid qty, price, and (sku and/or childSku.) \nExample: order.view([{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }])`
						);
						return;
					}
					const product: Product = {
						qty: `${item.qty}`,
						price: `${item.price}`,
					};
					if (item?.sku) {
						product.sku = `${item.sku}`;
					}
					if (item?.childSku) {
						product.childSku = `${item.childSku}`;
					}
					return product;
				});
				const eventPayload = {
					items,
					orderId: details.data?.orderId ? `${details.data.orderId}` : undefined,
					total: details.data?.total ? `${details.data.total}` : undefined,
					city: details.data?.city ? `${details.data.city}` : undefined,
					state: details.data?.state ? `${details.data.state}` : undefined,
					country: details.data?.country ? `${details.data.country}` : undefined,
				};
				const payload = {
					type: BeaconType.ORDER,
					category: BeaconCategory.ORDERVIEW,
					context,
					event: eventPayload,
				};

				// legacy tracking
				new PixelEvent(payload);

				return this.track.event(payload);
			},
		},
	};

	getUserId = (): Record<string, string> => {
		let userId;
		try {
			userId = featureFlags.storage && this.localStorage.get(USERID_COOKIE_NAME);
			if (featureFlags.cookies) {
				userId = userId || cookies.get(USERID_COOKIE_NAME) || uuidv4();
				cookies.set(USERID_COOKIE_NAME, userId, COOKIE_SAMESITE, COOKIE_EXPIRATION);
			} else if (!userId && featureFlags.storage) {
				// if cookies are disabled, use localStorage instead
				userId = uuidv4();
				this.localStorage.set(USERID_COOKIE_NAME, userId);
			}
		} catch (e) {
			console.error('Failed to persist user id to cookie or local storage:', e);
		}
		return { userId };
	};

	getSessionId = (): Record<string, string> => {
		let sessionId;
		if (featureFlags.storage) {
			try {
				sessionId = this.sessionStorage.get(SESSIONID_STORAGE_NAME) || uuidv4();
				this.sessionStorage.set(SESSIONID_STORAGE_NAME, sessionId);
				featureFlags.cookies && cookies.set(SESSIONID_STORAGE_NAME, sessionId, COOKIE_SAMESITE, 0); //session cookie
			} catch (e) {
				console.error('Failed to persist session id to session storage:', e);
			}
		} else if (featureFlags.cookies) {
			// use cookies if sessionStorage is not enabled and only reset cookie if new session to keep expiration
			sessionId = cookies.get(SESSIONID_STORAGE_NAME);
			if (!sessionId) {
				sessionId = uuidv4();
				cookies.set(SESSIONID_STORAGE_NAME, sessionId, COOKIE_SAMESITE, 0);
			}
		}
		return { sessionId };
	};

	getShopperId = (): Record<string, string> => {
		const shopperId = cookies.get(SHOPPERID_COOKIE_NAME);
		if (!shopperId) {
			return;
		}
		return { shopperId };
	};

	getCartItems = (): string[] => {
		const items = cookies.get(CART_PRODUCTS);
		if (!items) {
			return [];
		}
		return items.split(',');
	};

	getLastViewedItems = (): string[] => {
		const items = cookies.get(VIEWED_PRODUCTS);
		if (!items) {
			return [];
		}
		return items.split(',');
	};

	sendEvents = (eventsToSend?: BeaconEvent[]): void => {
		const events = JSON.parse(this.localStorage.get(LOCALSTORAGE_BEACON_POOL_NAME) || '[]');

		if (eventsToSend) {
			eventsToSend.forEach((event) => {
				events.push({ ...event });
			});
			this.localStorage.set(LOCALSTORAGE_BEACON_POOL_NAME, JSON.stringify(events));
		}

		clearTimeout(this.isSending);
		this.isSending = window.setTimeout(() => {
			if (events.length) {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', 'https://beacon.searchspring.io/beacon');
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(events.length == 1 ? events[0] : events));
			}
			this.localStorage.set(LOCALSTORAGE_BEACON_POOL_NAME, JSON.stringify([]));
		}, BATCH_TIMEOUT);
	};
}
