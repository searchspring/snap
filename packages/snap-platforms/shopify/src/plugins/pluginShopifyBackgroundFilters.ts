import type { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import type { PluginBackgroundFilterGlobal } from '../../../common/src/types';
import { AbstractPluginConfig } from '../../../common/src/types';

export type PluginShopifyBackgroundFiltersConfig = AbstractPluginConfig & {
	fieldNames?: {
		collection?: string;
		tags?: string;
		vendor?: string;
		type?: string;
	};
};

export const pluginShopifyBackgroundFilters = (cntrlr: AbstractController, config?: PluginShopifyBackgroundFiltersConfig) => {
	// do nothing if plugin is disabled
	if (config?.enabled === false) return;

	// only applies to search controllers
	if (cntrlr.type != 'search') return;

	const backgroundFilters: PluginBackgroundFilterGlobal[] = [];

	if (cntrlr.context.collection?.handle) {
		const collectionName = cntrlr.context.collection.name?.replace(/\&\#39\;/, "'");

		if (cntrlr.context.collection.handle == 'vendors') {
			backgroundFilters.push({
				type: 'value',
				field: config?.fieldNames?.vendor || 'vendor',
				value: collectionName,
				background: true,
			});
		} else if (cntrlr.context.collection.handle == 'types') {
			backgroundFilters.push({
				type: 'value',
				field: config?.fieldNames?.type || 'product_type',
				value: collectionName,
				background: true,
			});
		} else {
			backgroundFilters.push({
				type: 'value',
				field: config?.fieldNames?.collection || 'collection_handle',
				value: cntrlr.context.collection.handle,
				background: true,
			});
		}

		if (cntrlr.context.tags && Array.isArray(cntrlr.context.tags)) {
			cntrlr.context.tags.forEach((tag: string) => {
				backgroundFilters.push({
					type: 'value',
					field: config?.fieldNames?.tags || 'tags',
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
};
