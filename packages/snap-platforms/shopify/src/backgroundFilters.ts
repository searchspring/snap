import type { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';

export type GenericBackgroundFilterPluginConfig = {
	enabled: boolean;
	field: string;
	value: string;
	background?: boolean;
};
export type GenericBackgroundFiltersConfig = {
	tags?: GenericBackgroundFilterPluginConfig[];
	collection?: GenericBackgroundFilterPluginConfig[];
};

export const backgroundFilters = async (cntrlr: AbstractController, config?: GenericBackgroundFiltersConfig): Promise<void> => {
	const backgroundFilters: { field: string; value: string; type: string; background: boolean }[] = [];

	if (cntrlr.context.collection?.handle) {
		const collectionName = cntrlr.context.collection.name.replace(/\&\#39\;/, "'");

		if (cntrlr.context.collection.handle == 'vendors') {
			backgroundFilters.push({
				field: 'vendor',
				value: collectionName,
				type: 'value',
				background: true,
			});
		} else if (cntrlr.context.collection.handle == 'types') {
			backgroundFilters.push({
				field: 'product_type',
				value: collectionName,
				type: 'value',
				background: true,
			});
		} else {
			backgroundFilters.push({
				field: 'collection_handle',
				value: cntrlr.context.collection.handle,
				type: 'value',
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
					field: 'ss_tags',
					value: tag,
					type: 'value',
					background: true,
				});
			});
		}
	}

	const configFilters = [...(config?.collection?.length ? config.collection : []), ...(config?.tags?.length ? config.tags : [])];

	configFilters.forEach((filter) => {
		if (filter.enabled && filter.field && filter.value) {
			backgroundFilters.push({
				field: filter.field,
				value: filter.value,
				type: 'value',
				background: filter.background ?? true,
			});
		}
	});

	cntrlr.on('init', async ({ controller }: { controller: AbstractController }, next: Next) => {
		if (backgroundFilters.length) {
			controller.config = controller.config || {};
			controller.config.globals = controller.config.globals || {};
			(controller.config.globals as ClientGlobals).filters = (controller.config.globals as ClientGlobals).filters || [];
			(controller.config.globals as ClientGlobals).filters = (controller.config.globals as ClientGlobals).filters.concat(backgroundFilters);
		}

		await next();
	});
};
