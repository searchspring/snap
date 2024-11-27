import type { AbstractController } from '@searchspring/snap-controller';
import { AbstractPluginConfig } from '../types';

export const pluginLogger = (cntrlr: AbstractController, config?: AbstractPluginConfig) => {
	if (config?.enabled !== false) {
		cntrlr.on('afterStore', async ({ controller }: { controller: AbstractController }, next) => {
			controller.log.debug('store', controller.store.toJSON());

			await next();
		});
	}
};
