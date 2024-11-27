import type { ClientGlobals } from '@searchspring/snap-client';
import type { AbstractController } from '@searchspring/snap-controller';
import type { Next } from '@searchspring/snap-event-manager';
import type { AbstractPluginConfig, PluginBackgroundFilterGlobal } from '../../../common/src';

export const pluginBackgroundFiltersBigcommerce = (cntrlr: AbstractController, config?: AbstractPluginConfig) => {
	if (config?.enabled !== false) {
		// only applies to search controllers
		if (cntrlr.type != 'search') return;

		const backgroundFilters: PluginBackgroundFilterGlobal[] = [];

		if (cntrlr.context?.category?.path) {
			const categoryPath = replaceCharacters(cntrlr.context.category.path);
			backgroundFilters.push({
				type: 'value',
				field: 'categories_hierarchy',
				value: categoryPath,
				background: true,
			});
		} else if (cntrlr.context?.brand) {
			const brandName = replaceCharacters(cntrlr.context.brand);
			backgroundFilters.push({
				type: 'value',
				field: 'brand',
				value: brandName,
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
	}
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
