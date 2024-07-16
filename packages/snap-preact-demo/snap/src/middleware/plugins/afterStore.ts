export function afterStore(controller: AbstractController) {
	controller.on('init', async ({}, next) => {
		controller.log.debug('initialization...');
		await next();
	});
	controller.on('afterStore', async ({ controller: { store } }, next) => {
		mutateFacets(store.facets);

		await next();
	});

	// log the store
	controller.on('afterStore', async ({ controller }, next) => {
		controller.log.debug('store', controller.store.toJSON());
		await next();
	});

	controller.on('restorePosition', restorePosition);
}

function mutateFacets(facets: SearchFacetsStore) {
	for (const facet of facets) {
		let limit = 12;
		if (facet.display == 'palette' || facet.display == 'grid') {
			limit = 16;
		}

		facet.overflow?.setLimit(limit);
	}
}

async function restorePosition({ controller, element }, next: Next) {
	// scroll to top only if we are not going to be scrolling to stored element
	if (!element) {
		// prevent scroll to top when using infinite
		if (!(controller.config.settings.infinite && controller.store.pagination.page != 1)) {
			setTimeout(() => {
				window.scroll({ top: 0, left: 0, behavior: 'smooth' });
			});
		}
	}

	await next();
}
