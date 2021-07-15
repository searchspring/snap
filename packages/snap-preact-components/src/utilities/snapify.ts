/* searchspring imports */
import { Snap } from '@searchspring/snap-preact';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';

const controllers = {};
const snap = new Snap({
	client: {
		globals: { siteId: '8uyt2m' },
	},
	controllers: {},
});
export class Snapify {
	static recommendation(config): RecommendationController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr = (controllers[id] = snap.createController('recommendation', { id, tag: config.tag }));

		cntrlr.on('afterStore', async ({ controller }: { controller: RecommendationController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr as RecommendationController;
	}
	static autocomplete(config): AutocompleteController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr = (controllers[id] = snap.createController('autocomplete', { id, selector: config.selector }));

		cntrlr.on('afterStore', async ({ controller }: { controller: AutocompleteController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr as AutocompleteController;
	}

	static search(config): SearchController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr = (controllers[id] = snap.createController('search', { id }));

		cntrlr.on('afterStore', async ({ controller }: { controller: SearchController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr as SearchController;
	}
}
