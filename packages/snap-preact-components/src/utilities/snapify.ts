import { h, render } from 'preact';
/* searchspring imports */
import { createSearchController, createAutocompleteController, createRecommendationsController } from '@searchspring/snap-preact';
import type {
	SearchController,
	AutocompleteController,
	RecommendationController,
	SearchControllerConfig,
	AutocompleteControllerConfig,
	RecommendationControllerConfig,
} from '@searchspring/snap-controller';

const controllers = {};
const client = {
	globals: { siteId: '8uyt2m' },
};
export class Snapify {
	static recommendation(config: RecommendationControllerConfig): RecommendationController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr: RecommendationController = (controllers[id] = createRecommendationsController({ client, controller: config }));

		cntrlr.on('afterStore', async ({ controller }: { controller: RecommendationController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}
	static autocomplete(config: AutocompleteControllerConfig): AutocompleteController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr: AutocompleteController = (controllers[id] = createAutocompleteController({ client, controller: config }));

		cntrlr.on('afterStore', async ({ controller }: { controller: AutocompleteController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}

	static search(config: SearchControllerConfig): SearchController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr: SearchController = (controllers[id] = createSearchController({ client, controller: config }));

		cntrlr.on('afterStore', async ({ controller }: { controller: SearchController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}
}
