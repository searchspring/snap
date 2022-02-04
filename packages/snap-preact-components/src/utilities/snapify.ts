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
import { Client } from '@searchspring/snap-client';

const controllers = {};
const clientConfig = {
	globals: { siteId: '8uyt2m' },
};
const client = new Client(clientConfig.globals, {});
export class Snapify {
	static recommendation(config: RecommendationControllerConfig): RecommendationController {
		const id = config.id;
		if (controllers[id]) {
			return controllers[id];
		}

		const cntrlr: RecommendationController = (controllers[id] = createRecommendationsController(
			{ client: clientConfig, controller: config },
			client
		));

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

		const cntrlr: AutocompleteController = (controllers[id] = createAutocompleteController({ client: clientConfig, controller: config }, client));

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

		const cntrlr: SearchController = (controllers[id] = createSearchController({ client: clientConfig, controller: config }, client));

		cntrlr.on('afterStore', async ({ controller }: { controller: SearchController }, next) => {
			controller.log.debug('controller', controller);
			controller.log.debug('store', controller.store.toJSON());
			await next();
		});

		cntrlr.init();

		return cntrlr;
	}
}
