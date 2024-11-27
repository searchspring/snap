import type { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import type { AbstractPluginConfig, PluginBackgroundFilterGlobal } from '../../../common/src';

export const pluginBackgroundFiltersMagento2 = (cntrlr: AbstractController, config?: AbstractPluginConfig) => {
	if (config?.enabled !== false) {
		// only applies to search controllers
		if (cntrlr.type != 'search') return;

		const backgroundFilters: PluginBackgroundFilterGlobal[] = [];

		if (cntrlr.context?.category?.path) {
			backgroundFilters.push({
				type: 'value',
				field: 'category_hierarchy',
				value: cntrlr.context.category.path.replace(/\&quot\;/g, '"'),
				background: true,
			});

			backgroundFilters.push({
				type: 'value',
				field: 'visibility',
				value: 'Catalog',
				background: true,
			});
		} else {
			backgroundFilters.push({
				type: 'value',
				field: 'visibility',
				value: 'Search',
				background: true,
			});
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
