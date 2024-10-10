import type { AbstractController } from '@searchspring/snap-controller';

export type PluginControl = {
	controllerIds?: (string | RegExp)[];
	controllerTypes?: ('search' | 'autocomplete' | 'recommendation' | string)[];
};
export type PluginStoreLoggerConfig = PluginControl & {
	enabled: boolean;
};

export const pluginStoreLogger = async (cntrlr: AbstractController, config: PluginStoreLoggerConfig): Promise<void> => {
	if (!config?.enabled) {
		return;
	}

	if (Array.isArray(config.controllerTypes) && !config.controllerTypes.includes(cntrlr.type)) {
		return;
	}

	if (Array.isArray(config.controllerIds) && (!config.controllerIds.includes(cntrlr.id) || !config.controllerIds.some((id) => cntrlr.id.match(id)))) {
		return;
	}

	cntrlr.on('afterStore', async ({ controller }: { controller: AbstractController }, next) => {
		controller.log.debug('store', controller.store.toJSON());

		await next();
	});
};
