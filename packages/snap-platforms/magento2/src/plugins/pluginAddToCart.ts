import type { Product } from '@searchspring/snap-store-mobx';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import { Magento2AddToCartConfig } from '../addToCart';
import { addToCart as addToCartFunction } from '../addToCart';
import type { AbstractPluginConfig } from '../../../common/src/types';

export type Magento2AddToCartPluginConfig = Magento2AddToCartConfig & AbstractPluginConfig;

export const magento2PluginAddToCart = (cntrlr: AbstractController, config?: Magento2AddToCartPluginConfig) => {
	const addToCart = async ({ products }: { products: Product[] }, next: Next) => {
		await addToCartFunction(products, config);
		await next();
	};

	if (config?.enabled !== false) {
		cntrlr.on('addToCart', addToCart);
	}
};
