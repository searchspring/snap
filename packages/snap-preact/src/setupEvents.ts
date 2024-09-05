import { AbstractController } from '@searchspring/snap-controller';
import { EventManager, Next } from '@searchspring/snap-event-manager';
import { Product, SearchStore } from '@searchspring/snap-store-mobx';

type ControllerSelectVariantOptionsData = {
	options: Record<string, string[]>;
	controllerIds: (string | RegExp)[];
};
type ControllerRecommendationUpdateData = {
	controllerIds?: (string | RegExp)[];
};

export const setupEvents = () => {
	const eventManager = new EventManager();

	eventManager.on('controller/selectVariantOptions', async (data: ControllerSelectVariantOptionsData, next: Next) => {
		const { options, controllerIds } = data;

		//filter through all controllers for matches with profileIds
		const controllers = matchControllers(controllerIds);

		//then run set makeSelections on each result in that controller result store with the passed variant data
		controllers.map((controller) => {
			if ((controller.store as SearchStore)?.results) {
				(controller.store as SearchStore)?.results.forEach((result) => {
					//no banner types
					if (result.type == 'product') {
						(result as Product).variants?.makeSelections(options);
					}
				});
			}
		});

		await next();
	});

	eventManager.on('controller/recommendation/update', async (data: ControllerRecommendationUpdateData, next: Next) => {
		const { controllerIds } = data || {};

		//filter through all recommendation controllers for matches with profileIds and realtime config
		const controllers = matchControllers(controllerIds).filter((controller) => {
			return Boolean(controller.type === 'recommendation' && controller.config?.realtime);
		});

		controllers.map((controller) => {
			controller.search();
		});

		await next();
	});

	return eventManager;
};

const matchControllers = (matchIds: (string | RegExp)[] | undefined): AbstractController[] => {
	return Object.keys(window.searchspring.controller || {}).reduce((arr, id) => {
		const controller = window.searchspring.controller[id] as AbstractController;

		if (!matchIds) {
			arr.push(controller);
			return arr;
		}

		if (Array.isArray(matchIds)) {
			matchIds.forEach((idToFind) => {
				if (idToFind instanceof RegExp) {
					if (id.match(idToFind)?.length) {
						arr.push(controller);
						return arr;
					}
				} else if (id == idToFind) {
					arr.push(controller);
					return arr;
				}
			});
		}

		if (typeof matchIds == 'string' && matchIds === id) {
			arr.push(controller);
			return arr;
		}

		return arr;
	}, [] as AbstractController[]);
};
