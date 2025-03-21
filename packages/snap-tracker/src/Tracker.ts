import deepmerge from 'deepmerge';

import { StorageStore } from '@searchspring/snap-store-mobx';
import { cookies, version, DomTargeter, getContext } from '@searchspring/snap-toolbox';
import { AppMode } from '@searchspring/snap-toolbox';
import { Beacon } from '@searchspring/beacon';
import type { Context, ContextCurrency, CartSchemaData, Item, OrderTransactionSchemaData, Product } from '@searchspring/beacon';

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
	TrackErrorEvent,
	OrderTransactionData,
	TrackerConfig,
	TrackerEvents,
} from './types';

export const BATCH_TIMEOUT = 200;
const COOKIE_SAMESITE = 'Lax';
const COOKIE_DOMAIN =
	(typeof window !== 'undefined' && window.location.hostname && '.' + window.location.hostname.replace(/^www\./, '')) || undefined;
const CART_PRODUCTS = 'ssCartProducts';
export const MAX_VIEWED_COUNT = 20;
const MAX_PARENT_LEVELS = 3;

const defaultConfig: TrackerConfig = {
	id: 'track',
	framework: 'snap',
	mode: AppMode.production,
};

export class Tracker {
	private mode = AppMode.production;
	private globals: TrackerGlobals;
	private localStorage: StorageStore;
	private doNotTrack: TrackerEvents[];

	private config: TrackerConfig;
	private targeters: DomTargeter[] = [];
	public beacon: Beacon;

	constructor(globals: TrackerGlobals, config?: TrackerConfig) {
		if (typeof globals != 'object' || typeof globals.siteId != 'string') {
			throw new Error(`Invalid config passed to tracker. The "siteId" attribute must be provided.`);
		}

		this.config = deepmerge(defaultConfig, config || {});
		this.doNotTrack = this.config.doNotTrack || [];

		if (Object.values(AppMode).includes(this.config.mode as AppMode)) {
			this.mode = this.config.mode as AppMode;
		}

		this.globals = globals;

		this.localStorage = new StorageStore({
			type: 'local',
			key: `ss-${this.config.id}`,
		});

		this.localStorage.set('siteId', this.globals.siteId);

		this.beacon = new Beacon(
			{
				siteId: this.globals.siteId,
				currency: this.globals.currency,
			},
			{
				version,
				framework: this.config.framework,
				mode: this.mode,
				apis: {
					requesters: {
						personalization: this.config.requesters?.personalization,
						beacon: this.config.requesters?.beacon,
					},
				},
			}
		);

		if (!window.searchspring?.tracker) {
			window.searchspring = window.searchspring || {};
			window.searchspring.tracker = this;
			window.searchspring.version = version;
		}

		// since this is in the constructor, setTimeout is required for jest.spyOn
		setTimeout(() => {
			this.targeters.push(
				new DomTargeter([{ selector: 'script[type^="searchspring/track/"]', emptyTarget: false }], (target: any, elem: Element) => {
					const { item, items, siteId, shopper, order, type, currency } = getContext(
						['item', 'items', 'siteId', 'shopper', 'order', 'type', 'currency'],
						elem as HTMLScriptElement
					);

					this.setCurrency(currency);
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
							console.error(`event '${type}' is not supported`);
							break;
					}
				})
			);
		});

		document.addEventListener('click', (event: Event) => {
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

			const getClickAttributes = (event: Event): Record<string, any> => {
				const attributeList = [
					`ss-${this.config.id}-cart-add`,
					`ss-${this.config.id}-cart-remove`,
					`ss-${this.config.id}-cart-clear`,
					`ss-${this.config.id}-cart-view`,
					`ss-${this.config.id}-intellisuggest`,
					`ss-${this.config.id}-intellisuggest-signature`,
					`href`,
				];
				const attributes: { [key: string]: any } = {};
				let levels = 0;

				let elem: HTMLElement | null = null;
				elem = event && (event.target as HTMLElement);

				while (Object.keys(attributes).length == 0 && elem !== null && levels <= MAX_PARENT_LEVELS) {
					Object.values(elem.attributes).forEach((attr: Attr) => {
						const attrName = attr.nodeName;

						if (attributeList.indexOf(attrName) != -1) {
							attributes[attrName] = elem && elem.getAttribute(attrName);
						}
					});

					elem = elem.parentElement;
					levels++;
				}

				return attributes;
			};

			const attributes = getClickAttributes(event);

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
			} else if (`ss-${this.config.id}-cart-view` in attributes) {
				// update recs
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
	}

	public getContext(): Context {
		return this.beacon.getContext();
	}

	public retarget(): void {
		this.targeters.forEach((target) => {
			target.retarget();
		});
	}

	track: TrackMethods = {
		// TODO: search where this is used and remove unwanted fields from type
		error: (data: TrackErrorEvent, siteId?: string): undefined => {
			if (this.doNotTrack?.includes('error') || this.mode === AppMode.development) {
				return;
			}

			if (!data?.stack && !data?.message) {
				// no console log
				return;
			}
			const { stack, message, details } = data;
			const href = typeof window !== 'undefined' ? window?.location?.href || '' : '';

			// prevent sending of errors when on localhost or CDN
			if (message?.includes('Profile is currently paused') || href.includes('//localhost') || href.includes('//snapui.searchspring.io/')) {
				return;
			}

			this.beacon.events.error.snap({
				data: {
					message: message || 'unknown',
					stack,
					details,
				},
				siteId,
			});
		},

		shopper: {
			login: (data: ShopperLoginEvent, siteId?: string): undefined => {
				if (this.doNotTrack?.includes('shopper.login')) {
					return;
				}
				this.beacon.events.shopper.login({ data: { id: data.id }, siteId });
			},
		},
		product: {
			view: (data: Item | ProductViewEvent, siteId?: string): undefined => {
				if (this.doNotTrack?.includes('product.view')) {
					return;
				}
				let result = data;
				if (!data.uid && data.sku) {
					result = {
						...data,
						uid: data.sku,
					};
				}

				this.beacon.events.product.pageView({ data: { result: result as Item }, siteId });
			},
			/**
			 * @deprecated tracker.track.product.click() is deprecated and will be removed. Use tracker.beacon.events['search' | 'category'].clickThrough() instead
			 */
			click: (data: ProductClickEvent, siteId?: string): BeaconEvent | undefined => {
				// Controllers will send product click events through tracker.beacon
				// For legacy support if someone calls this, continute to 1.0 beacon just like is.js
				// TODO: remove after 1.0 deprecation period

				if (this.doNotTrack?.includes('product.click')) {
					return;
				}

				if (!data?.intellisuggestData || !data?.intellisuggestSignature) {
					console.error(
						`track.product.click event: object parameter requires a valid intellisuggestData and intellisuggestSignature. \nExample: track.click.product({ intellisuggestData: "eJwrTs4tNM9jYCjKTM8oYXDWdQ3TDTfUDbIwMDVjMARCYwMQSi_KTAEA9IQKWA", intellisuggestSignature: "9e46f9fd3253c267fefc298704e39084a6f8b8e47abefdee57277996b77d8e70" })`
					);
					return;
				}

				const beaconContext = this.beacon.getContext();
				const context = transformToLegacyContext(beaconContext, siteId || this.globals.siteId);
				const event = {
					type: BeaconType.CLICK,
					category: BeaconCategory.INTERACTION,
					context,
					event: {
						intellisuggestData: data.intellisuggestData,
						intellisuggestSignature: data.intellisuggestSignature,
						href: data?.href ? `${data.href}` : undefined,
					},
				};

				const beaconEvent = new BeaconEvent(event as BeaconPayload, this.config);
				const beaconEventData = beaconEvent.send();
				return beaconEventData;
			},
		},
		cart: {
			add: (data: CartSchemaData, siteId?: string): undefined => {
				if (this.doNotTrack?.includes('cart.add')) {
					return;
				}
				this.beacon.events.cart.add({ data, siteId });
			},
			remove: (data: CartSchemaData, siteId?: string): undefined => {
				if (this.doNotTrack?.includes('cart.remove')) {
					return;
				}
				this.beacon.events.cart.remove({ data, siteId });
			},
			view: (data: CartViewEvent | CartSchemaData, siteId?: string): undefined => {
				if (this.doNotTrack?.includes('cart.view')) {
					return;
				}
				let results;
				if ((data as CartViewEvent).items) {
					// uid can be optional in legacy payload but required in 2.0 spec - use sku as fallback
					results = (data as CartViewEvent).items.map((item) => {
						if (!item.uid && item.sku) {
							return {
								...item,
								uid: item.sku,
							};
						}
					});
				} else if ((data as CartSchemaData).results) {
					results = (data as CartSchemaData).results;
				}

				this.beacon.events.cart.view({ data: { results: results as Product[] }, siteId });
			},
		},
		order: {
			transaction: (data: OrderTransactionData | OrderTransactionSchemaData, siteId?: string): undefined => {
				if (this.doNotTrack?.includes('order.transaction')) {
					return;
				}
				if ((data as OrderTransactionData).items && !(data as OrderTransactionSchemaData).orderId) {
					// backwards compatibility for OrderTransactionData
					const order = (data as OrderTransactionData).order;
					const items = (data as OrderTransactionData).items as Product[];
					const orderTransactionData: OrderTransactionSchemaData = {
						orderId: `${order?.id || ''}`,
						transactionTotal: Number(order?.transactionTotal || 0),
						total: Number(order?.total || 0),
						city: order?.city,
						state: order?.state,
						country: order?.country,
						results: items.map((item) => {
							return {
								// uid is required - fallback to get most relevant
								uid: item.uid || item.sku || item.childUid || item.childSku || '', // TODO: is this correct order?
								childUid: item.childUid,
								sku: item.sku,
								childSku: item.childSku,
								qty: Number(item.qty),
								price: Number(item.price),
							};
						}),
					};
					this.beacon.events.order.transaction({ data: orderTransactionData, siteId });
				} else {
					this.beacon.events.order.transaction({ data: data as OrderTransactionSchemaData, siteId });
				}
			},
		},
	};

	updateContext = (key: keyof Context, value: any) => {
		this.beacon.updateContext(key, value);
	};

	setCurrency = (currency: ContextCurrency): void => {
		this.beacon.setCurrency(currency);
	};

	getUserId = (): string => {
		return this.beacon.getContext().userId;
	};

	getSessionId = (): string => {
		return this.beacon.getContext().sessionId;
	};

	getShopperId = (): string => {
		return this.beacon.getShopperId();
	};

	sendPreflight = (): void => {
		this.beacon.sendPreflight();
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
					const cartItems = items.map((item) => `${item}`.trim());
					const uniqueCartItems = Array.from(new Set(cartItems));
					cookies.set(CART_PRODUCTS, uniqueCartItems.join(','), COOKIE_SAMESITE, 0, COOKIE_DOMAIN);

					const itemsHaveChanged = cartItems.filter((item) => items.includes(item)).length !== items.length;
					if (itemsHaveChanged) {
						this.beacon.sendPreflight();
					}
				}
			},
			add: (items: string[]): void => {
				if (items.length) {
					const currentCartItems = this.cookies.cart.get();
					const itemsToAdd = items.map((item) => `${item}`.trim());
					const uniqueCartItems = Array.from(new Set([...currentCartItems, ...itemsToAdd]));
					cookies.set(CART_PRODUCTS, uniqueCartItems.join(','), COOKIE_SAMESITE, 0, COOKIE_DOMAIN);

					const itemsHaveChanged = currentCartItems.filter((item) => itemsToAdd.includes(item)).length !== itemsToAdd.length;
					if (itemsHaveChanged) {
						this.beacon.sendPreflight();
					}
				}
			},
			remove: (items: string[]): void => {
				if (items.length) {
					const currentCartItems = this.cookies.cart.get();
					const itemsToRemove = items.map((item) => `${item}`.trim());
					const updatedItems = currentCartItems.filter((item) => !itemsToRemove.includes(item));
					cookies.set(CART_PRODUCTS, updatedItems.join(','), COOKIE_SAMESITE, 0, COOKIE_DOMAIN);

					const itemsHaveChanged = currentCartItems.length !== updatedItems.length;
					if (itemsHaveChanged) {
						this.beacon.sendPreflight();
					}
				}
			},
			clear: () => {
				if (this.cookies.cart.get().length) {
					cookies.unset(CART_PRODUCTS, COOKIE_DOMAIN);
					this.beacon.sendPreflight();
				}
			},
		},
		viewed: {
			get: (): string[] => this.beacon.storage.viewed.get(),
		},
	};
}

function transformToLegacyContext(_context: Context, siteId: string): BeaconContext {
	const context = { ..._context };
	if (context.userAgent) {
		delete context.userAgent;
	}
	if (context.timestamp) {
		// @ts-ignore - property not optional
		delete context.timestamp;
	}
	if (context.initiator) {
		// @ts-ignore - property not optional
		delete context.initiator;
	}
	if (context.dev) {
		delete context.dev;
	}
	let attribution:
		| {
				type?: string;
				id?: string;
		  }
		| undefined;
	if (context.attribution?.length) {
		attribution = {
			type: context.attribution[0].type,
			id: context.attribution[0].id,
		};
		delete context.attribution;
	}
	const beaconContext: BeaconContext = {
		...(context as unknown as BeaconContext),
		website: {
			trackingCode: siteId,
		},
	};
	if (attribution) {
		beaconContext.attribution = attribution;
	}
	return beaconContext;
}
