import type { Product } from '@searchspring/snap-store-mobx';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import { Magento2AddToCartConfig } from '../addToCart';
import { addToCart as addToCartMagento2Function } from '../addToCart';
import type { AbstractPluginConfig } from '../../../common/src/types';

export type PluginMagento2AddToCartConfig = AbstractPluginConfig & Magento2AddToCartConfig;

export const pluginMagento2AddToCart = (cntrlr: AbstractController, config?: PluginMagento2AddToCartConfig) => {
	// do nothing if plugin is disabled
	if (config?.enabled === false) return;

	const addToCartMagento2Event = async ({ products }: { products: Product[] }, next: Next) => {
		await addToCartMagento2Function(products, config);
		await next();
	};

	cntrlr.on('addToCart', addToCartMagento2Event);
};
