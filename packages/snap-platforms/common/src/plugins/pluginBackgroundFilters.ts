import type { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { PluginBackgroundFilter, PluginBackgroundFilterGlobal, PluginControl } from '../types';

export type CommonPluginBackgroundFilterConfig = {
	filters: (PluginBackgroundFilter & PluginControl)[];
};

export const pluginBackgroundFilters = (cntrlr: AbstractController, config: CommonPluginBackgroundFilterConfig) => {
	const backgroundFilters: PluginBackgroundFilterGlobal[] = [];

	let contextBackgroundFilters: CommonPluginBackgroundFilterConfig['filters'] = [];

	if (Array.isArray(cntrlr.context?.backgroundFilters)) {
		contextBackgroundFilters = contextBackgroundFilters.concat(cntrlr.context.backgroundFilters);
	} else if (cntrlr.context?.backgroundFilters) {
		cntrlr.log.warn('context supplied backgroundFilters must be an array!');
	}

	const configBackgroundFilters = [...(config?.filters?.length ? config.filters : [])];

	const combinedBackgroundFilters: CommonPluginBackgroundFilterConfig['filters'] = contextBackgroundFilters.concat(configBackgroundFilters);
	combinedBackgroundFilters.forEach((filter) => {
		if (
			filter.field &&
			filter.value &&
			filter.type &&
			((filter.type === 'value' && (typeof filter.value === 'string' || typeof filter.value === 'number')) ||
				(filter.type === 'range' && typeof filter.value === 'object'))
		) {
			if (Array.isArray(filter.controllerTypes) && !(filter.controllerTypes as string[]).includes(cntrlr.type)) {
				return;
			}

			if (
				Array.isArray(filter.controllerIds) &&
				!filter.controllerIds.includes(cntrlr.id) &&
				!filter.controllerIds.some((id) => id instanceof RegExp && cntrlr.id.match(id))
			) {
				return;
			}

			backgroundFilters.push({
				type: filter.type,
				field: filter.field,
				value: filter.value,
				background: true,
			} as PluginBackgroundFilterGlobal);
		} else {
			cntrlr.log.error('Invalid filter in backgroundFilters', filter);
		}
	});

	cntrlr.on('init', async ({ controller }: { controller: AbstractController }, next) => {
		if (backgroundFilters.length) {
			controller.config = controller.config || {};
			controller.config.globals = controller.config.globals || {};
			(controller.config.globals as ClientGlobals).filters = (controller.config.globals as ClientGlobals).filters || [];
			(controller.config.globals as ClientGlobals).filters = (controller.config.globals as ClientGlobals).filters.concat(backgroundFilters);
		}

		await next();
	});
};
