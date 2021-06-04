import deepmerge from 'deepmerge';

import { BeaconType, BeaconCategory } from '@searchspring/snap-tracker';

import { AbstractController } from '../Abstract/AbstractController';
import type { SearchControllerConfig, BeforeSearchObj, AfterSearchObj, ControllerServices, NextEvent } from '../types';
import { getSearchParams } from '../utils/getParams';

const defaultConfig: SearchControllerConfig = {
	id: 'search',
	globals: {},
	settings: {
		redirects: {
			merchandising: true,
			singleResult: true,
		},
		facets: {
			trim: true,
		},
	},
};

export class SearchController extends AbstractController {
	config: SearchControllerConfig;

	constructor(config: SearchControllerConfig, { client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices) {
		super(config, { client, store, urlManager, eventManager, profiler, logger, tracker });

		// deep merge config with defaults
		this.config = deepmerge(defaultConfig, this.config);

		// add 'beforeSearch' middleware
		this.eventManager.on('beforeSearch', async (search: BeforeSearchObj, next: NextEvent): Promise<void | boolean> => {
			search.controller.store.loading = true;

			await next();
		});

		// add 'afterSearch' middleware
		this.eventManager.on('afterSearch', async (search: AfterSearchObj, next: NextEvent): Promise<void | boolean> => {
			await next();

			const config = search.controller.config;
			const redirectURL = search?.response?.merchandising?.redirect;

			if (redirectURL && config?.settings?.redirects?.merchandising) {
				window.location.replace(redirectURL);
				return false;
			}

			if (
				config?.settings?.redirects?.singleResult &&
				search?.response.search.query &&
				search?.response?.pagination?.totalResults === 1 &&
				!search?.response?.filters?.length
			) {
				window.location.replace(search?.response.results[0].mappings.core.url);
				return false;
			}
			search.controller.store.loading = false;
		});

		const commonContext = {
			context: {
				website: {
					trackingCode: this.client.globals.siteId,
				},
			},
		};
		this.tracker.track = {
			...this.tracker?.track,
			product: {
				click: async (data) => {
					if (!data?.intellisuggestData || !data?.intellisuggestSignature) {
						console.error(
							`product.click event: object parameter requires a valid intellisuggestData and intellisuggestSignature. \nExample: product.click([{ intellisuggestData: "eJwrTs4tNM9jYCjKTM8oYXDWdQ3TDTfUDbIwMDVjMARCYwMQSi_KTAEA9IQKWA", intellisuggestSignature: "9e46f9fd3253c267fefc298704e39084a6f8b8e47abefdee57277996b77d8e70" }])`
						);
						return;
					}
					const payload = {
						...commonContext,
						type: BeaconType.CLICK,
						category: BeaconCategory.INTERACTION,
						event: {
							intellisuggestData: data.intellisuggestData,
							intellisuggestSignature: data.intellisuggestSignature,
							href: data?.href ? `${data.href}` : undefined,
						},
					};
					await this.eventManager.fire('beforeBeaconEvent', {
						controller: this,
						payload: payload,
						params: data,
					});
					const event = this.tracker.event(payload);
					await this.eventManager.fire('afterBeaconEvent', {
						controller: this,
						payload: payload,
						params: data,
						event: event,
					});
					return event;
				},
				view: async (data) => {
					if (!data?.sku && !data?.childSku) {
						console.error(
							'product.view event: requires a valid sku and/or childSku. \nExample: product.view({ sku: "product123", childSku: "product123_a" })'
						);
						return;
					}
					const payload = {
						...commonContext,
						type: BeaconType.PRODUCT,
						category: BeaconCategory.PAGEVIEW,
						event: {
							sku: data?.sku ? `${data.sku}` : undefined,
							childSku: data?.childSku ? `${data.childSku}` : undefined,
						},
					};
					await this.eventManager.fire('beforeBeaconEvent', {
						controller: this,
						payload: payload,
						params: data,
					});
					const event = this.tracker.event(payload);
					await this.eventManager.fire('afterBeaconEvent', {
						controller: this,
						payload: payload,
						params: data,
						event: event,
					});
					return event;
				},
			},
			personalization: {
				login: async (shopperId) => {
					const payload = {
						...commonContext,
						type: BeaconType.LOGIN,
						category: BeaconCategory.PERSONALIZATION,
						event: {},
					};
					await this.eventManager.fire('beforeBeaconEvent', {
						controller: this,
						payload: payload,
						params: shopperId,
					});
					const event = await this.tracker.track.shopperLogin(shopperId);
					await this.eventManager.fire('afterBeaconEvent', {
						controller: this,
						payload: payload,
						params: shopperId,
						event: event,
					});
					return event;
				},
			},
			cart: {
				view: async (data) => {
					if (!Array.isArray(data) || !data.length) {
						console.error(
							'cart.view event: parameter must be an array of cart items. \nExample: cart.view([{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }])'
						);
						return;
					}
					const eventPayload = data.map((item, index) => {
						if (!item?.qty || !item?.price || (!item?.sku && !item?.childSku)) {
							console.error(
								`cart.view event: item ${item} at index ${index} requires a valid qty, price, and (sku and/or childSku.) \nExample: cart.view([{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }])`
							);
							return;
						}
						return {
							sku: item?.sku ? `${item?.sku}` : undefined,
							childSku: item?.childSku ? `${item.childSku}` : undefined,
							qty: `${item.qty}`,
							price: `${item.price}`,
						};
					});
					const payload = {
						...commonContext,
						type: BeaconType.CART,
						category: BeaconCategory.CARTVIEW,
						event: eventPayload,
					};
					await this.eventManager.fire('beforeBeaconEvent', {
						controller: this,
						payload: payload,
						params: data,
					});
					const event = this.tracker.event(payload);
					await this.eventManager.fire('afterBeaconEvent', {
						controller: this,
						payload: payload,
						params: data,
						event: event,
					});
					return event;
				},
			},
			order: {
				transaction: async (data) => {
					if (!data?.items || !Array.isArray(data.items) || !data.items.length) {
						console.error(
							'order.transaction event: object parameter must contain `items` array of cart items. \nExample: order.transaction({ items: [{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }], orderId: "1001", total: "9.99", city: "Los Angeles", state: "CA", country: "US"})'
						);
						return;
					}
					const items = data.items.map((item, index) => {
						if (!item?.qty || !item?.price || (!item?.sku && !item?.childSku)) {
							console.error(
								`order.transaction event: object parameter \`items\`: item ${item} at index ${index} requires a valid qty, price, and (sku and/or childSku.) \nExample: order.view([{ sku: "product123", childSku: "product123_a", qty: "1", price: "9.99" }])`
							);
							return;
						}
						return {
							sku: item?.sku ? `${item.sku}` : undefined,
							childSku: item?.childSku ? `${item.childSku}` : undefined,
							qty: `${item.qty}`,
							price: `${item.price}`,
						};
					});
					const eventPayload = {
						items,
						orderId: data?.orderId ? `${data.orderId}` : undefined,
						total: data?.total ? `${data.total}` : undefined,
						city: data?.city ? `${data.city}` : undefined,
						state: data?.state ? `${data.state}` : undefined,
						country: data?.country ? `${data.country}` : undefined,
					};
					const payload = {
						...commonContext,
						type: BeaconType.ORDER,
						category: BeaconCategory.ORDERVIEW,
						event: eventPayload,
					};
					await this.eventManager.fire('beforeBeaconEvent', {
						controller: this,
						payload: payload,
						params: data,
					});
					const event = this.tracker.event(payload);
					await this.eventManager.fire('afterBeaconEvent', {
						controller: this,
						payload: payload,
						params: data,
						event: event,
					});
					return event;
				},
			},
		};
		this.tracker.init();
	}

	get params(): Record<string, any> {
		const params: Record<string, any> = deepmerge({ ...getSearchParams(this.urlManager.state) }, this.config.globals);

		// redirect setting
		if (!this.config.settings?.redirects?.merchandising) {
			params.search = params.search || {};
			params.search.redirectResponse = 'full';
		}

		return params;
	}

	search = async (): Promise<SearchController> => {
		// TODO: call this.init() if it has never been called

		const params = this.params;

		try {
			try {
				await this.eventManager.fire('beforeSearch', {
					controller: this,
					request: params,
				});
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'beforeSearch' middleware cancelled`);
					return this;
				} else {
					this.log.error(`error in 'beforeSearch' middleware`);
					throw err;
				}
			}

			const searchProfile = this.profiler.create({ type: 'event', name: 'search', context: params }).start();

			// TODO (notsureif)
			// provide a means to access the actual request parameters (params + globals)
			// 				* add params(params) function to client that spits back the JSON request (takes params param) - incorporates globals + params param

			const response = await this.client.search(params);
			if (!response.meta) {
				/**
				 * MockSnapClient will overwrite the client search() method and use
				 * SearchData to return mock data which already contains meta data
				 */
				response.meta = this.client.meta;
			}

			// modify response
			// TODO: move to store
			if (this.config.settings.facets.trim) {
				response.facets = response.facets.filter((facet) => {
					if (!facet.filtered && facet.values?.length == 1) {
						return facet.values[0].count != response.pagination.totalResults;
					} else if (facet.values?.length == 0) {
						return false;
					} else if (facet.type == 'range' && facet.range.low == facet.range.high) {
						return false;
					}

					return true;
				});
			}

			searchProfile.stop();
			this.log.profile(searchProfile);

			const afterSearchProfile = this.profiler.create({ type: 'event', name: 'afterSearch', context: params }).start();

			try {
				await this.eventManager.fire('afterSearch', {
					controller: this,
					request: params,
					response,
				});
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterSearch' middleware cancelled`);
					afterSearchProfile.stop();
					return this;
				} else {
					this.log.error(`error in 'afterSearch' middleware`);
					throw err;
				}
			}

			afterSearchProfile.stop();
			this.log.profile(afterSearchProfile);

			// update the store
			// console.log("this.store:", this.store)
			this.store.update(response);

			const afterStoreProfile = this.profiler.create({ type: 'event', name: 'afterStore', context: params }).start();

			try {
				await this.eventManager.fire('afterStore', {
					controller: this,
					request: params,
					response,
				});
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'afterStore' middleware cancelled`);
					afterStoreProfile.stop();
					return this;
				} else {
					this.log.error(`error in 'afterStore' middleware`);
					throw err;
				}
			}

			afterStoreProfile.stop();
			this.log.profile(afterStoreProfile);
		} catch (err) {
			if (err) {
				console.error(err);
			}
		}

		return this;
	};
}
