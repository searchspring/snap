import type { Product } from '@searchspring/snap-store-mobx';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import { BigCommerceAddToCartConfig } from '../addToCart';
import { addToCart as addToCartBigcommerceFunction } from '../addToCart';
import type { AbstractPluginConfig } from '../../../common/src/types';

export type PluginBigCommerceAddToCartConfig = AbstractPluginConfig & BigCommerceAddToCartConfig;

export const pluginBigcommerceAddToCart = (cntrlr: AbstractController, config?: PluginBigCommerceAddToCartConfig) => {
	// do nothing if plugin is disabled
	if (config?.enabled === false) return;

	const addToCartBigcommerceEvent = async ({ products }: { products: Product[] }, next: Next) => {
		await addToCartBigcommerceFunction(products, config);
		await next();
	};

	cntrlr.on('addToCart', addToCartBigcommerceEvent);
};
