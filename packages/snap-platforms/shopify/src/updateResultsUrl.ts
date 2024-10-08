import type { Product, SearchStore, Banner } from '@searchspring/snap-store-mobx';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';

declare global {
	interface Window {
		Shopify: any;
	}
}

export type UpdateResultsUrlConfig = {
	enabled: boolean;
};

export const updateResultsUrl = async (cntrlr: AbstractController, config: UpdateResultsUrlConfig): Promise<void> => {
	if (!window.Shopify) {
		cntrlr.log.error('Error: window.Shopify not found');
		return;
	}
	if (!config.enabled || !cntrlr.context.collection?.handle) {
		return;
	}

	const collectionName = cntrlr.context.collection.name.replace(/\&\#39\;/, "'");
	const page = {
		id: cntrlr.context.collection.handle,
		title: collectionName,
		type: 'collection',
	};

	const updateUrlFn = (handle: string): string | undefined => {
		if (cntrlr.type == 'search') {
			const hasRoute =
				typeof window.Shopify == 'object' && typeof window.Shopify.routes == 'object' && typeof window.Shopify.routes.root == 'string' ? true : false;
			const routeShopify = hasRoute ? window.Shopify.routes.root : '/';
			const routeCollection = page.type == 'collection' ? `collections/${page.id}/` : ``;
			return `${routeShopify}${routeCollection}products/${handle}`;
		}
	};

	cntrlr.on('afterStore', async ({ controller }: { controller: AbstractController }, next: Next) => {
		const { results } = controller.store as SearchStore;

		if (page.type == 'collection' && results && results.length !== 0) {
			results.forEach((result: Product | Banner) => {
				if (result.type != 'banner') {
					const updatedUrl = updateUrlFn(result.attributes.handle as string);
					if (updatedUrl) {
						result.mappings.core!.url = updatedUrl;
					}
				}
			});
		}

		await next();
	});
};
