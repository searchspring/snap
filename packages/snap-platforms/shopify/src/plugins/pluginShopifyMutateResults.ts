import type { Product, SearchStore, Banner } from '@searchspring/snap-store-mobx';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import { AbstractPluginConfig } from '../../../common/src/types';

declare global {
	interface Window {
		Shopify: any;
	}
}

export type PluginShopifyMutateResultsConfig = {
	mutations?: {
		collectionInUrl?: {
			enabled: boolean;
		};
	};
} & AbstractPluginConfig;

export const pluginShopifyMutateResults = (cntrlr: AbstractController, config?: PluginShopifyMutateResultsConfig) => {
	// do nothing if plugin is disabled
	if (config?.enabled === false) return;

	// mutatation collectionInUrl
	const collectionHandle = cntrlr.context.collection?.handle;
	if (config?.mutations?.collectionInUrl?.enabled !== false && collectionHandle) {
		if (!window.Shopify) {
			cntrlr.log.warn('shopify/pluginMutateResults: window.Shopify not found!');
			return;
		}

		cntrlr.on('afterStore', async ({ controller }: { controller: AbstractController }, next: Next) => {
			const { results } = controller.store as SearchStore;

			results.forEach((result: Product | Banner) => {
				const resultHandle = result.attributes.handle;
				if (result.type != 'banner' && resultHandle) {
					const routeShopify = window?.Shopify?.routes?.root || '/';
					const routeCollection = `collections/${collectionHandle}/`;
					result.mappings.core!.url = `${routeShopify}${routeCollection}products/${resultHandle}`;
				}
			});

			await next();
		});
	}
};
