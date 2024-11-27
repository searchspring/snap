import type { Product } from '@searchspring/snap-store-mobx';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import type { AbstractPluginConfig } from '../../../common/src/types';

export type CommonAddToCartPluginConfig = AbstractPluginConfig & {
	function: (products: Product[]) => void;
};

export const pluginAddToCart = (cntrlr: AbstractController, config?: CommonAddToCartPluginConfig) => {
	const addToCart = async ({ products }: { products: Product[] }, next: Next) => {
		await config?.function(products);
		await next();
	};

	if (config?.enabled !== false) {
		cntrlr.on('addToCart', addToCart);
	}
};
