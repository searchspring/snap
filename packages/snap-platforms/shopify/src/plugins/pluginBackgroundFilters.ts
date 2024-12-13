import type { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import type { PluginBackgroundFilterGlobal } from '../../../common/src';
import { AbstractPluginConfig } from '../../../common/src/types';

export type ShopifyPluginBackgroundFiltersConfig = AbstractPluginConfig;

export const pluginBackgroundFiltersShopify = (cntrlr: AbstractController, config?: ShopifyPluginBackgroundFiltersConfig) => {
	if (config?.enabled !== false) {
		// only applies to search controllers
		if (cntrlr.type != 'search') return;

		const backgroundFilters: PluginBackgroundFilterGlobal[] = [];

		if (cntrlr.context.collection?.handle) {
			const collectionName = cntrlr.context.collection.name?.replace(/\&\#39\;/, "'");

			if (cntrlr.context.collection.handle == 'vendors') {
				backgroundFilters.push({
					type: 'value',
					field: 'vendor',
					value: collectionName,
					background: true,
				});
			} else if (cntrlr.context.collection.handle == 'types') {
				backgroundFilters.push({
					type: 'value',
					field: 'product_type',
					value: collectionName,
					background: true,
				});
			} else {
				backgroundFilters.push({
					type: 'value',
					field: 'collection_handle',
					value: cntrlr.context.collection.handle,
					background: true,
				});
			}

			if (cntrlr.context.tags) {
				const collectionTags = cntrlr.context.tags
					.toLowerCase()
					.replace(/\&quot\;/g, '"')
					.replace(/-/g, '')
					.replace(/ +/g, '')
					.split('|');
				collectionTags.forEach((tag: string) => {
					backgroundFilters.push({
						type: 'value',
						field: 'ss_tags',
						value: tag,
						background: true,
					});
				});
			}
		}

		if (!backgroundFilters.length) {
			return;
		}

		cntrlr.on('init', async ({ controller }: { controller: AbstractController }, next: Next) => {
			controller.config = controller.config || {};
			controller.config.globals = controller.config.globals || {};
			(controller.config.globals as ClientGlobals).filters = (controller.config.globals as ClientGlobals).filters || [];
			(controller.config.globals as ClientGlobals).filters = (controller.config.globals as ClientGlobals).filters.concat(backgroundFilters);

			await next();
		});
	}
};
