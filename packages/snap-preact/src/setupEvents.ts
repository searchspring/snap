import { AbstractController } from '@searchspring/snap-controller';
import { EventManager, Next } from '@searchspring/snap-event-manager';
import { Product, SearchStore } from '@searchspring/snap-store-mobx';

export const setupEvents = () => {
	const eventManager = new EventManager();

	type controllerSelectVariantOptionsData = {
		options: Record<string, string[]>;
		controllerIds: (string | RegExp)[];
	};

	eventManager.on('controller/selectVariantOptions', async (data: controllerSelectVariantOptionsData, next: Next) => {
		const { options, controllerIds } = data;

		//filter through all controllers for matches with profileIds
		const controllerListToUse: AbstractController[] = [];
		Object.keys(window.searchspring.controller).forEach((controller) => {
			const current = window.searchspring.controller[controller];
			if (controllerIds && Array.isArray(controllerIds)) {
				//only push if controller/profile matches?
				controllerIds.forEach((id) => {
					if (id instanceof RegExp) {
						if (controller.match(id)?.length) {
							controllerListToUse.push(current);
						}
					} else if (controller == id) {
						controllerListToUse.push(current);
					}
				});
			} else {
				controllerListToUse.push(current);
			}
		});

		//then run set makeSelections on each result in that controller result store with the passed variant data
		controllerListToUse.map((controller) => {
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

	return eventManager;
};
