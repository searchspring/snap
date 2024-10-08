import type { AbstractController } from '@searchspring/snap-controller';

export type StoreLoggerConfig = {
	enabled: boolean;
};
export const storeLogger = async (cntrlr: AbstractController, config: StoreLoggerConfig): Promise<void> => {
	cntrlr.on('afterStore', async ({ controller }: { controller: AbstractController }, next) => {
		if (config.enabled) {
			controller.log.debug('store', controller.store.toJSON());
		}
		await next();
	});
};
