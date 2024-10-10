import type { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';

///// Duplicated typing TODO: move to shared location /////
export type ValueBackgroundFilter = {
	type: 'value';
	field: string;
	value: string | number;
};
export type RangeBackgroundFilter = {
	type: 'range';
	field: string;
	value: { low: number; high: number };
};
export type BackgroundFilter = ValueBackgroundFilter | RangeBackgroundFilter;
export type BackgroundFilterGlobal = BackgroundFilter & { background: true };
export type PluginControl = {
	controllerIds?: (string | RegExp)[];
	controllerTypes?: ('search' | 'autocomplete' | 'recommendation' | string)[];
};
///// /////////////////////////////////////////////// /////

export const pluginBackgroundFilters = async (cntrlr: AbstractController): Promise<void> => {
	const backgroundFilters: BackgroundFilterGlobal[] = [];

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
