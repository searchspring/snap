import type { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import type { AbstractPluginConfig, PluginBackgroundFilterGlobal } from '../../../common/src/types';

export type PluginBigcommerceBackgroundFiltersConfig = AbstractPluginConfig & {
	fieldNames?: {
		brand?: string;
		category?: string;
	};
};

export const pluginBigcommerceBackgroundFilters = (cntrlr: AbstractController, config?: PluginBigcommerceBackgroundFiltersConfig) => {
	// do nothing if plugin is disabled
	if (config?.enabled === false) return;

	// only applies to search controllers
	if (cntrlr.type != 'search') return;

	const backgroundFilters: PluginBackgroundFilterGlobal[] = [];

	if (cntrlr.context?.category?.path) {
		const categoryPath = replaceCharacters(cntrlr.context.category.path);
		backgroundFilters.push({
			type: 'value',
			field: config?.fieldNames?.category || 'categories_hierarchy',
			value: categoryPath,
			background: true,
		});
	} else if (cntrlr.context?.brand?.name) {
		const brandName = replaceCharacters(cntrlr.context.brand.name);
		backgroundFilters.push({
			type: 'value',
			field: config?.fieldNames?.brand || 'brand',
			value: brandName,
			background: true,
		});
	}

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

function replaceCharacters(value: string): string {
	if (value) {
		return value
			.replace(/\&amp\;/g, '&')
			.replace(/\&lt\;/g, '<')
			.replace(/\&gt\;/g, '>')
			.replace(/\&quot\;/g, '"')
			.replace(/\&#039\;/g, "'")
			.replace(/\&#x27\;/g, "'")
			.trim();
	} else {
		return '';
	}
}
