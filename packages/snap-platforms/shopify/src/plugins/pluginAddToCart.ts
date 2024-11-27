import type { Product } from '@searchspring/snap-store-mobx';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import { ShopifyAddToCartConfig } from '../addToCart';
import { addToCart as addToCartFunction } from '../addToCart';
import type { AbstractPluginConfig } from '../../../common/src/types';

export type ShopifyAddToCartPluginConfig = ShopifyAddToCartConfig &
	AbstractPluginConfig & {
		functionOverride?: (products: Product[]) => void;
	};

export const pluginAddToCart = (cntrlr: AbstractController, config?: ShopifyAddToCartPluginConfig) => {
	const addToCart = async ({ products }: { products: Product[] }, next: Next) => {
		if (config?.functionOverride) {
			config.functionOverride(products);
		} else {
			await addToCartFunction(products, config);
			await next();
		}
	};

	if (config?.enabled !== false) {
		cntrlr.on('addToCart', addToCart);
	}
};
