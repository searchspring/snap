import type { Product, SearchStore, Banner } from '@searchspring/snap-store-mobx';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';

declare global {
	interface Window {
		Shopify: any;
	}
}

export type ShopifyPluginMutateResultsConfig = {
	collectionInUrl?: {
		enabled: boolean;
	};
};

export const pluginMutateResults = (cntrlr: AbstractController, config: ShopifyPluginMutateResultsConfig) => {
	if (config?.collectionInUrl?.enabled && cntrlr.context.collection?.handle) {
		if (!window.Shopify) {
			cntrlr.log.warn('shopify/plugins/mutateResults: window.Shopify not found');
			return;
		}

		const collectionName = cntrlr.context.collection.name.replace(/\&\#39\;/, "'");
		const page = {
			id: cntrlr.context.collection.handle,
			title: collectionName,
			type: 'collection',
		};

		const updateUrlFn = (handle: string): string | undefined => {
			if (handle) {
				const routeShopify = window?.Shopify?.routes?.root || '/';
				const routeCollection = page.type == 'collection' ? `collections/${page.id}/` : ``;
				return `${routeShopify}${routeCollection}products/${handle}`;
			}
		};

		if (cntrlr.type == 'search') {
			cntrlr.on('afterStore', async ({ controller }: { controller: AbstractController }, next: Next) => {
				const { results } = controller.store as SearchStore;

				if (page.type == 'collection' && results && results.length !== 0) {
					results.forEach((result: Product | Banner) => {
						if (result.type != 'banner') {
							const updatedUrl = updateUrlFn(result.attributes.handle as string);
							if (updatedUrl && updatedUrl !== result.mappings.core?.url) {
								result.mappings.core!.url = updatedUrl;
							}
						}
					});
				}

				await next();
			});
		}
	}
};
