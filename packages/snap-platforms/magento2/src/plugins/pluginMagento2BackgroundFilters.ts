import type { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import type { AbstractPluginConfig, PluginBackgroundFilterGlobal } from '../../../common/src/types';

export type PluginMagento2BackgroundFiltersConfig = AbstractPluginConfig & {
	fieldNames?: {
		category?: string;
		visibility?: string;
	};
};

export const pluginMagento2BackgroundFilters = (cntrlr: AbstractController, config?: PluginMagento2BackgroundFiltersConfig) => {
	// do nothing if plugin is disabled
	if (config?.enabled === false) return;

	// only applies to search controllers
	if (!['search', 'autocomplete'].includes(cntrlr.type)) return;

	const backgroundFilters: PluginBackgroundFilterGlobal[] = [];
	const visibilityFilter: PluginBackgroundFilterGlobal = {
		type: 'value',
		field: config?.fieldNames?.visibility || 'visibility',
		value: 'Search',
		background: true,
	};

	// only apply background filters for category to search controllers
	if (cntrlr.type == 'search') {
		if (cntrlr.context?.category?.path) {
			backgroundFilters.push({
				type: 'value',
				field: config?.fieldNames?.category || 'category_hierarchy',
				value: cntrlr.context.category.path.replace(/\&quot\;/g, '"'),
				background: true,
			});

			visibilityFilter.value = 'Catalog';
		}
	}

	backgroundFilters.push(visibilityFilter);

	// don't do anything if there are no background filters found
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
