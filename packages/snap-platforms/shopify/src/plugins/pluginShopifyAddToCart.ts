import type { Product } from '@searchspring/snap-store-mobx';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import { ShopifyAddToCartConfig } from '../addToCart';
import { addToCart as addToCartShopifyFunction } from '../addToCart';
import type { AbstractPluginConfig } from '../../../common/src/types';

export type PluginShopifyAddToCartConfig = AbstractPluginConfig & ShopifyAddToCartConfig;

export const pluginShopifyAddToCart = (cntrlr: AbstractController, config?: PluginShopifyAddToCartConfig) => {
	// do nothing if plugin is disabled
	if (config?.enabled === false) return;

	const addToCartShopifyEvent = async ({ products }: { products: Product[] }, next: Next) => {
		await addToCartShopifyFunction(products, config);
		await next();
	};

	cntrlr.on('addToCart', addToCartShopifyEvent);
};
