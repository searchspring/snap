import type { AbstractController } from '@searchspring/snap-controller';
import { AbstractPluginConfig } from '../types';

export type PluginLoggerConfig = AbstractPluginConfig;

export const pluginLogger = (cntrlr: AbstractController, config?: PluginLoggerConfig) => {
	// do nothing if plugin is disabled
	if (config?.enabled === false) return;

	cntrlr.on('afterStore', async ({ controller }: { controller: AbstractController }, next) => {
		controller.log.debug('store', controller.store.toJSON());

		await next();
	});
};
