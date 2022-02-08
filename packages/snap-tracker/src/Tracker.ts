import deepmerge from 'deepmerge';
import { v4 as uuidv4 } from 'uuid';

import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { cookies, featureFlags, version, DomTargeter, getContext } from '@searchspring/snap-toolbox';

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
	OrderTransactionData,
	Product,
	TrackerConfig,
} from './types';

const BATCH_TIMEOUT = 150;
const USERID_COOKIE_NAME = 'ssUserId';
const SHOPPERID_COOKIE_NAME = 'ssShopperId';
const COOKIE_EXPIRATION = 31536000000; // 1 year
const VIEWED_COOKIE_EXPIRATION = 220752000000; // 7 years
const COOKIE_SAMESITE = 'Lax';
const SESSIONID_STORAGE_NAME = 'ssSessionIdNamespace';
const LOCALSTORAGE_BEACON_POOL_NAME = 'ssBeaconPool';
const CART_PRODUCTS = 'ssCartProducts';
const VIEWED_PRODUCTS = 'ssViewedProducts';
const MAX_VIEWED_COUNT = 15;

const defaultConfig: TrackerConfig = {
	id: 'track',
};

export class Tracker {
	globals: TrackerGlobals;
	client: any;
	localStorage: StorageStore;
	context: BeaconContext;
	isSending: number;

	private config: TrackerConfig;
	private targeters: DomTargeter[] = [];

	constructor(globals: TrackerGlobals, client: any, config?: TrackerConfig) {
		if (typeof globals != 'object' || typeof globals.siteId != 'string') {
			throw new Error(`Invalid config passed to tracker. The "siteId" attribute must be provided.`);
		}

		this.config = deepmerge(defaultConfig, config || {});

		this.globals = globals;
		this.client = client;

		this.localStorage = new StorageStore({
			type: StorageType.LOCAL,
			key: `ss-${this.config.id}-${this.globals.siteId}-local`,
		});

		this.context = {
			userId: this.getUserId(),
			sessionId: this.getSessionId(),
			shopperId: this.getShopperId(),
			pageLoadId: uuidv4(),
			website: {
				trackingCode: this.globals.siteId,
			},
		};

		if (!window.searchspring?.tracker) {
			window.searchspring = window.searchspring || {};
			window.searchspring.tracker = this;
			window.searchspring.version = version;
		}

		// one targeter to rule them all
		this.targeters.push(
			new DomTargeter([{ selector: 'script[type^="searchspring/track/"]', emptyTarget: false }], (target, elem) => {
				const { item, items, siteId, shopper, order, type } = getContext(['item', 'items', 'siteId', 'shopper', 'order'], elem as HTMLScriptElement);

				switch (type) {
					case 'searchspring/track/shopper/login':
						this.track.shopper.login(shopper, siteId);
						break;
					case 'searchspring/track/product/view':
						this.track.product.view(item, siteId);
						break;
					case 'searchspring/track/cart/view':
						this.track.cart.view({ items }, siteId);
						break;
					case 'searchspring/track/order/transaction':
						this.track.order.transaction({ order, items }, siteId);
						break;
					default:
						console.error(`${type} event is not supported or incorrect`);
						break;
				}
			})
		);

		document.addEventListener('click', (event: Event) => {
			const attributes = {};
			Object.values((event.target as HTMLElement).attributes).forEach((attr: Attr) => {
				attributes[attr.nodeName] = (event.target as HTMLElement).getAttribute(attr.nodeName);
			});

			const updateRecsControllers = (): void => {
				if (window.searchspring.controller) {
					Object.keys(window.searchspring.controller).forEach((name) => {
						const controller = window.searchspring.controller[name];
						if (controller.type === 'recommendation' && controller.config?.realtime) {
							controller.search();
						}
					});
				}
			};

			if (attributes[`ss-${this.config.id}-cart-add`]) {
				// add skus to cart
				const skus = attributes[`ss-${this.config.id}-cart-add`].split(',');
				this.cookies.cart.add(skus);
				updateRecsControllers();
			} else if (attributes[`ss-${this.config.id}-cart-remove`]) {
				// remove skus from cart
				const skus = attributes[`ss-${this.config.id}-cart-remove`].split(',');
				this.cookies.cart.remove(skus);
				updateRecsControllers();
			} else if (`ss-${this.config.id}-cart-clear` in attributes) {
				// clear all from cart
				this.cookies.cart.clear();
				updateRecsControllers();
			} else if (attributes[`ss-${this.config.id}-intellisuggest`] && attributes[`ss-${this.config.id}-intellisuggest-signature`]) {
				// product click
				const intellisuggestData = attributes[`ss-${this.config.id}-intellisuggest`];
				const intellisuggestSignature = attributes[`ss-${this.config.id}-intellisuggest-signature`];
				const href = attributes['href'];
				this.track.product.click({
					intellisuggestData,
					intellisuggestSignature,
					href,
				});
			}
		});

		this.sendEvents();
	}

	public retarget(): void {
		this.targeters.forEach((target) => {
			target.retarget();
		});
	}

	sendPreflight = (): void => {
		const userId = this.getUserId();
		const siteId = this.context.website.trackingCode;
		const shopper = this.getShopperId();
		const cart = this.cookies.cart.get().join(','); // TODO: remove join once API supports multiple same params, also update PreflightRequestModel
		const lastViewed = this.cookies.viewed.get().join(','); //

		if (shopper && (cart || lastViewed)) {
			this.client.preflight({
				userId,
				siteId,
				shopper,
				cart,
				lastViewed,
			});
		}
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
			login: (data: ShopperLoginEvent, siteId?: string): BeaconEvent => {
				// sets shopperid if logged in
				if (!featureFlags.cookies) {
					return;
				}
				if (!data.id) {
					console.error('tracker.shopper.login event: requires a valid shopper ID parameter. Example: tracker.shopper.login({ id: "1234" })');
					return;
				}
				let context = this.context;
				if (siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: siteId,
							},
						},
					});
				}
				const storedShopperId = this.getShopperId();
				data.id = `${data.id}`;
				if (storedShopperId != data.id) {
					// user's logged in id has changed, update shopperId cookie send login event
					cookies.set(SHOPPERID_COOKIE_NAME, data.id, COOKIE_SAMESITE, COOKIE_EXPIRATION);
					this.context.shopperId = data.id;

					this.sendPreflight();

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
			view: (data: ProductViewEvent, siteId: string): BeaconEvent => {
				if (!data?.sku && !data?.childSku) {
					console.error(
						'track.product.view event: requires a valid sku and/or childSku. \nExample: track.product.view({ sku: "product123", childSku: "product123_a" })'
					);
					return;
				}
				let context = this.context;
				if (siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: siteId,
							},
						},
					});
				}
				const payload = {
					type: BeaconType.PRODUCT,
					category: BeaconCategory.PAGEVIEW,
					context,
					event: {
						sku: data?.sku ? `${data.sku}` : undefined,
						childSku: data?.childSku ? `${data.childSku}` : undefined,
					},
				};

				// save recently viewed products to cookie
				const sku = data?.sku || data?.childSku;
				if (sku) {
					const lastViewedProducts = this.cookies.viewed.get();
					const uniqueCartItems = Array.from(new Set([...lastViewedProducts, sku])).map((item) => item.trim());
					cookies.set(VIEWED_PRODUCTS, uniqueCartItems.slice(0, MAX_VIEWED_COUNT).join(','), COOKIE_SAMESITE, VIEWED_COOKIE_EXPIRATION);
					this.sendPreflight();
				}

				// legacy tracking
				if (data?.sku) {
					// only send sku to pixel tracker if present (don't send childSku)
					new PixelEvent({
						...payload,
						event: {
							sku: data.sku,
						},
					});
				}

				return this.track.event(payload);
			},
			click: (data: ProductClickEvent, siteId?: string): BeaconEvent => {
				if (!data?.intellisuggestData || !data?.intellisuggestSignature) {
					console.error(
						`track.product.click event: object parameter requires a valid intellisuggestData and intellisuggestSignature. \nExample: track.click.product({ intellisuggestData: "eJwrTs4tNM9jYCjKTM8oYXDWdQ3TDTfUDbIwMDVjMARCYwMQSi_KTAEA9IQKWA", intellisuggestSignature: "9e46f9fd3253c267fefc298704e39084a6f8b8e47abefdee57277996b77d8e70" })`
					);
					return;
				}
				let context = this.context;
				if (siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: siteId,
							},
						},
					});
				}
				const payload = {
					type: BeaconType.CLICK,
					category: BeaconCategory.INTERACTION,
					context,
					event: {
						intellisuggestData: data.intellisuggestData,
						intellisuggestSignature: data.intellisuggestSignature,
						href: data?.href ? `${data.href}` : undefined,
					},
				};

				// legacy tracking
				new TrackEvent(payload);

				return this.track.event(payload);
			},
		},
		cart: {
			view: (data: CartViewEvent, siteId?: string): BeaconEvent => {
				if (!Array.isArray(data?.items) || !data?.items.length) {
					console.error(
						'track.view.cart event: parameter must be an array of cart items. \nExample: track.view.cart({ items: [{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }] })'
					);
					return;
				}
				let context = this.context;
				if (siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: siteId,
							},
						},
					});
				}
				const items = data.items.map((item, index) => {
					if (!item?.qty || !item?.price || (!item?.sku && !item?.childSku)) {
						console.error(
							`track.view.cart event: item ${item} at index ${index} requires a valid qty, price, and (sku and/or childSku.) \nExample: track.view.cart({ items: [{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }] })`
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
					const products = items.map((item) => item.sku || item.childSku);
					this.cookies.cart.add(products);
				}

				// legacy tracking
				new PixelEvent(payload);

				return this.track.event(payload);
			},
		},
		order: {
			transaction: (data: OrderTransactionData, siteId?: string): BeaconEvent => {
				if (!data?.items || !Array.isArray(data.items) || !data.items.length) {
					console.error(
						'track.order.transaction event: object parameter must contain `items` array of cart items. \nExample: order.transaction({ order: { id: "1001", total: "9.99", city: "Los Angeles", state: "CA", country: "US" }, items: [{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }] })'
					);
					return;
				}
				let context = this.context;
				if (siteId) {
					context = deepmerge(context, {
						context: {
							website: {
								trackingCode: siteId,
							},
						},
					});
				}
				const items = data.items.map((item, index) => {
					if (!item?.qty || !item?.price || (!item?.sku && !item?.childSku)) {
						console.error(
							`track.order.transaction event: object parameter \`items\`: item ${item} at index ${index} requires a valid qty, price, and (sku and/or childSku.) \nExample: order.view({ items: [{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }] })`
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
					orderId: data?.order?.id ? `${data.order.id}` : undefined,
					total: data?.order?.total ? `${data.order.total}` : undefined,
					city: data?.order?.city ? `${data.order.city}` : undefined,
					state: data?.order?.state ? `${data.order.state}` : undefined,
					country: data?.order?.country ? `${data.order.country}` : undefined,
					items,
				};
				const payload = {
					type: BeaconType.ORDER,
					category: BeaconCategory.ORDERVIEW,
					context,
					event: eventPayload,
				};

				// clear cart items from cookie when order is placed
				this.cookies.cart.clear();

				// legacy tracking
				new PixelEvent(payload);

				return this.track.event(payload);
			},
		},
	};

	getUserId = (): string => {
		let userId;
		try {
			userId = featureFlags.storage && window.localStorage.getItem(USERID_COOKIE_NAME);
			if (featureFlags.cookies) {
				userId = userId || cookies.get(USERID_COOKIE_NAME) || uuidv4();
				cookies.set(USERID_COOKIE_NAME, userId, COOKIE_SAMESITE, COOKIE_EXPIRATION);
			} else if (!userId && featureFlags.storage) {
				// if cookies are disabled, use localStorage instead
				userId = uuidv4();
				window.localStorage.setItem(USERID_COOKIE_NAME, userId);
			}
		} catch (e) {
			console.error('Failed to persist user id to cookie or local storage:', e);
		}

		return userId;
	};

	getSessionId = (): string => {
		let sessionId;
		if (featureFlags.storage) {
			try {
				sessionId = window.sessionStorage.getItem(SESSIONID_STORAGE_NAME) || uuidv4();
				window.sessionStorage.setItem(SESSIONID_STORAGE_NAME, sessionId);
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

		return sessionId;
	};

	getShopperId = (): string => {
		const shopperId = cookies.get(SHOPPERID_COOKIE_NAME);
		if (!shopperId) {
			return;
		}

		return shopperId;
	};

	cookies = {
		cart: {
			get: (): string[] => {
				const items = cookies.get(CART_PRODUCTS);
				if (!items) {
					return [];
				}
				return items.split(',');
			},
			set: (items: string[]): void => {
				if (items.length) {
					const cartItems = items.map((item) => item.trim());
					const uniqueCartItems = Array.from(new Set(cartItems));
					cookies.set(CART_PRODUCTS, uniqueCartItems.join(','), COOKIE_SAMESITE, 0);
				}
			},
			add: (items: string[]): void => {
				if (items.length) {
					const currentCartItems = this.cookies.cart.get();
					const itemsToAdd = items.map((item) => item.trim());
					const uniqueCartItems = Array.from(new Set([...currentCartItems, ...itemsToAdd]));
					cookies.set(CART_PRODUCTS, uniqueCartItems.join(','), COOKIE_SAMESITE, 0);

					this.sendPreflight();
				}
			},
			remove: (items: string[]): void => {
				if (items.length) {
					const currentCartItems = this.cookies.cart.get();
					const itemsToRemove = items.map((item) => item.trim());
					const updatedItems = currentCartItems.filter((item) => !itemsToRemove.includes(item));
					cookies.set(CART_PRODUCTS, updatedItems.join(','), COOKIE_SAMESITE, 0);
				}
			},
			clear: () => {
				cookies.unset(CART_PRODUCTS);
			},
		},
		viewed: {
			get: (): string[] => {
				const items = cookies.get(VIEWED_PRODUCTS);
				if (!items) {
					return [];
				}
				return items.split(',');
			},
		},
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
				this.client.beacon(events);
			}
			this.localStorage.set(LOCALSTORAGE_BEACON_POOL_NAME, JSON.stringify([]));
		}, BATCH_TIMEOUT);
	};
}
