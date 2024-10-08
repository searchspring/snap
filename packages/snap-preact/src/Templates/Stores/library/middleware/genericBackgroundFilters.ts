import { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';

export type GenericBackgroundFilterPluginConfig = {
	enabled: boolean;
	field: string;
	value: string;
	background?: boolean;
}[];

export const genericBackgroundFilters = async (cntrlr: AbstractController, config?: GenericBackgroundFilterPluginConfig): Promise<void> => {
	const backgroundFilters: { field: string; value: string; type: string; background: boolean }[] = [];

	let contextFilters: GenericBackgroundFilterPluginConfig = [];

	if (typeof cntrlr.context?.backgroundFilters === 'object') {
		contextFilters.push(cntrlr.context.backgroundFilters);
	} else if (Array.isArray(cntrlr.context?.backgroundFilters)) {
		contextFilters = contextFilters.concat(cntrlr.context.backgroundFilters);
	}

	const configFilters = [...(config?.length ? config : [])];

	const filters: GenericBackgroundFilterPluginConfig = contextFilters.concat(configFilters);
	filters.forEach((filter) => {
		if (filter.enabled && filter.field && filter.value) {
			backgroundFilters.push({
				field: filter.field,
				value: filter.value,
				type: 'value',
				background: filter.background ?? true,
			});
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
