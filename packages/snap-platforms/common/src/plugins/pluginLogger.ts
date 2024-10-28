import type { AbstractController } from '@searchspring/snap-controller';

export const pluginLogger = (cntrlr: AbstractController) => {
	cntrlr.on('afterStore', async ({ controller }: { controller: AbstractController }, next) => {
		controller.log.debug('store', controller.store.toJSON());

		await next();
	});
};
