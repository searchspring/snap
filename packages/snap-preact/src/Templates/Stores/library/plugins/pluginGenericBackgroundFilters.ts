import { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { BackgroundFilter, BackgroundFilterGlobal, PluginControl } from '@searchspring/snap-platforms/shopify';

export type PluginGenericBackgroundFilterPluginConfig = {
	filters: (BackgroundFilter & PluginControl)[];
};

export const pluginGenericBackgroundFilters = async (
	cntrlr: AbstractController,
	config: PluginGenericBackgroundFilterPluginConfig
): Promise<void> => {
	const backgroundFilters: BackgroundFilterGlobal[] = [];

	let contextFilters: PluginGenericBackgroundFilterPluginConfig['filters'] = [];

	if (typeof cntrlr.context?.backgroundFilters === 'object') {
		contextFilters.push(cntrlr.context.backgroundFilters); // support single object entry
	} else if (Array.isArray(cntrlr.context?.backgroundFilters)) {
		contextFilters = contextFilters.concat(cntrlr.context.backgroundFilters);
	}

	const configFilters = [...(config?.filters?.length ? config.filters : [])];

	const filters: PluginGenericBackgroundFilterPluginConfig['filters'] = contextFilters.concat(configFilters);
	filters.forEach((filter) => {
		if (
			filter.field &&
			filter.value &&
			filter.type &&
			((filter.type === 'value' && (typeof filter.value === 'string' || typeof filter.value === 'number')) ||
				(filter.type === 'range' && typeof filter.value === 'object'))
		) {
			if (Array.isArray(filter.controllerTypes) && !filter.controllerTypes.includes(cntrlr.type)) {
				return;
			}

			if (
				Array.isArray(filter.controllerIds) &&
				(!filter.controllerIds.includes(cntrlr.id) || !filter.controllerIds.some((id) => cntrlr.id.match(id)))
			) {
				return;
			}

			backgroundFilters.push({
				type: filter.type,
				field: filter.field,
				value: filter.value,
				background: true,
			} as BackgroundFilterGlobal);
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
