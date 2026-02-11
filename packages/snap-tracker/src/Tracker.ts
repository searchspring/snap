import deepmerge from 'deepmerge';

import { StorageStore } from '@searchspring/snap-store-mobx';
import { version, DomTargeter, getContext } from '@searchspring/snap-toolbox';
import { AppMode } from '@searchspring/snap-toolbox';
import { Beacon } from '@athoscommerce/beacon';
import type { OrderTransactionSchemaData, Product, ProductPageviewSchemaData } from '@athoscommerce/beacon';

import {
	TrackerGlobals,
	TrackMethods,
	ProductViewEvent,
	ShopperLoginEvent,
	TrackErrorEvent,
	OrderTransactionData,
	TrackerConfig,
	TrackerEvents,
} from './types';

const MAX_PARENT_LEVELS = 3;

const defaultConfig: TrackerConfig = {
	id: 'track',
	framework: 'snap',
	mode: AppMode.production,
	requesters: {
		beacon: {
			origin: 'https://beacon.searchspring.io/beacon/v2',
		},
	},
};

export class Tracker extends Beacon {
	private localStorage: StorageStore;
	private doNotTrack: TrackerEvents[];

	public config: TrackerConfig;
	private targeters: DomTargeter[] = [];

	constructor(globals: TrackerGlobals, config?: TrackerConfig) {
		config = deepmerge(defaultConfig, config || {});
		config.initiator = `searchspring/${config.framework}/${version}`;

		if (typeof globals != 'object' || typeof globals.siteId != 'string') {
			throw new Error(`Invalid config passed to tracker. The "siteId" attribute must be provided.`);
		}

		super(globals, config);
		this.config = config;

		this.doNotTrack = this.config.doNotTrack || [];

		if (Object.values(AppMode).includes(this.config.mode as AppMode)) {
			this.mode = this.config.mode as AppMode;
		}

		this.localStorage = new StorageStore({
			type: 'local',
			key: `ss-${this.config.id}`,
		});

		this.localStorage.set('siteId', this.globals.siteId);

		if ((this.globals as TrackerGlobals).currency) {
			this.setCurrency((this.globals as TrackerGlobals).currency!);
		}

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
							this.track.cart.view();
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
				this.track.product.click();
			}
		});

		const cart = (this.globals as TrackerGlobals).cart;
		if (Array.isArray(cart)) {
			if (cart.length === 0) {
				// cart is empty, clear storage and send remove event if storage had items
				const storedCart = this.storage.cart.get();
				if (storedCart.length) {
					this.events.cart.remove({
						data: {
							results: storedCart,
							cart: [],
						},
					});
				}
				this.storage.cart.clear();
			} else if (cart.length) {
				// length check here to be able to sent error event if invalid array of objects is provided
				const currentCart: Product[] = cart
					.filter((item) => typeof item === 'object' && (item.parentId || item.uid || item.sku) && item.qty !== undefined && item.price !== undefined)
					.map((item): Product => {
						return {
							parentId: item.parentId || item.uid,
							uid: item.uid,
							sku: item.sku,
							price: item.price,
							qty: item.qty,
						};
					});

				// beacon 2.0 requires all parameters to be present
				// send error to keep track of integrations to be updated
				if (!currentCart.length) {
					this.events.error.snap({
						data: {
							message: 'cart globals missing properties',
							details: { cart },
						},
					});
				}

				const storedCart = this.storage.cart.get();
				const toAdd: Product[] = [];
				const toRemove: Product[] = [];

				if (!storedCart?.length && currentCart.length) {
					// no stored cart, add all items
					toAdd.push(...currentCart);
				} else if (currentCart.length) {
					currentCart.forEach((item) => {
						const existingItem = storedCart.find((existingItem) => {
							return existingItem.parentId === item.parentId && existingItem.uid === item.uid && existingItem.sku === item.sku;
						});
						if (!existingItem) {
							// item does not exist in cart, add it
							toAdd.push(item);
						} else if (existingItem) {
							// item already exists in cart, check if qty has changed
							if (item.qty > existingItem.qty) {
								toAdd.push({
									...item,
									qty: item.qty - existingItem.qty,
								});
							} else if (item.qty < existingItem.qty) {
								toRemove.push({
									...existingItem,
									qty: existingItem.qty - item.qty,
								});
							}
							// remove from existing cart
							const index = storedCart.indexOf(existingItem);
							if (index !== -1) {
								storedCart.splice(index, 1);
							}
						}
					});
					// any remaining items in existing cart should be removed
					if (storedCart.length) {
						toRemove.push(...storedCart);
					}
				}
				if (toAdd.length) {
					this.events.cart.add({
						data: {
							results: toAdd,
							cart: currentCart,
						},
					});
				}
				if (toRemove.length) {
					this.events.cart.remove({
						data: {
							results: toRemove,
							cart: currentCart,
						},
					});
				}
			}
		}
	}

	public getGlobals(): TrackerGlobals {
		return JSON.parse(JSON.stringify(this.globals));
	}

	public retarget(): void {
		this.targeters.forEach((target) => {
			target.retarget();
		});
	}

	track: TrackMethods = {
		error: (data: TrackErrorEvent, siteId?: string): undefined => {
			if (this.doNotTrack?.includes('error') || this.mode === AppMode.development) {
				return;
			}

			if (!data?.stack && !data?.message) {
				// no console log
				return;
			}
			const { stack, message, ...details } = data;
			const { pageUrl } = this.getContext();

			// prevent sending of errors when on localhost or CDN
			if (message?.includes('Profile is currently paused') || pageUrl.includes('//localhost') || pageUrl.includes('//snapui.searchspring.io/')) {
				return;
			}

			this.events.error.snap({
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
				this.events.shopper.login({ data: { id: data.id }, siteId });
			},
		},
		product: {
			view: (data: ProductViewEvent, siteId?: string): undefined => {
				if (this.doNotTrack?.includes('product.view')) {
					return;
				}
				let dataPayload: ProductPageviewSchemaData = {
					result: {
						parentId: data.parentId || data.uid || '',
						uid: data.uid || data.parentId || data.sku || '',
						sku: data.sku,
					},
				};

				if (data.childSku || data.childUid) {
					dataPayload = {
						result: {
							parentId: data.parentId || data.uid || data.childUid || '',
							uid: data.childUid || data.uid || '',
							sku: data.childSku || data.sku,
						},
					};
				}

				this.events.product.pageView({ data: dataPayload, siteId });
			},
			/**
			 * @deprecated tracker.track.product.click() is deprecated and will be removed. Use tracker.events['search' | 'category'].clickThrough() instead
			 */
			click: (): void => {
				console.warn(
					`tracker.track.product.click() is deprecated and is no longer functional. Use tracker.events['search' | 'category'].clickThrough() instead`
				);
				this.events.error.snap({ data: { message: `tracker.track.product.click was called` } });
			},
		},
		cart: {
			view: (): void => {
				console.warn(
					'tracker.cart.view is deprecated and no longer functional. Use tracker.events.cart.add() and tracker.events.cart.remove() instead'
				);
				this.events.error.snap({ data: { message: `tracker.track.cart.view was called` } });
			},
		},
		order: {
			transaction: (data: OrderTransactionData, siteId?: string): undefined => {
				if (this.doNotTrack?.includes('order.transaction')) {
					return;
				}

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
							parentId: item.parentId || item.uid || '',
							uid: item.uid || item.parentId || item.sku || '',
							sku: item.sku,
							qty: Number(item.qty),
							price: Number(item.price),
						};
					}),
				};
				this.events.order.transaction({ data: orderTransactionData, siteId });
			},
		},
	};

	cookies = {
		cart: {
			get: (): string[] => {
				const data = this.storage.cart.get();
				return data.map((item) => this.getProductId(item));
			},
			set: (items: string[]): void => {
				const cartItems = items.map((item) => `${item}`.trim());
				const uniqueCartItems: Product[] = Array.from(new Set(cartItems)).map((uid) => ({ parentId: uid, uid, sku: uid, price: 0, qty: 1 }));
				this.storage.cart.set(uniqueCartItems);
			},
			add: (items: string[]): void => {
				if (items.length) {
					const itemsToAdd: Product[] = items.map((item) => `${item}`.trim()).map((uid) => ({ parentId: uid, uid, sku: uid, price: 0, qty: 1 }));
					this.storage.cart.add(itemsToAdd);
				}
			},
			remove: (items: string[]): void => {
				if (items.length) {
					const itemsToRemove: Product[] = items.map((item) => `${item}`.trim()).map((uid) => ({ parentId: uid, uid, sku: uid, price: 0, qty: 1 }));
					this.storage.cart.remove(itemsToRemove);
				}
			},
			clear: () => {
				this.storage.cart.clear();
			},
		},
		viewed: {
			get: (): string[] => {
				const viewedItems = this.storage.viewed.get();
				return viewedItems.map((item) => this.getProductId(item));
			},
		},
	};
}
