export function afterStore(controller) {
	controller.on('init', async ({ controller }, next) => {
		controller.log.debug('initialization...');
		await next();
	});
	controller.on('afterStore', async ({ controller: { store } }, next) => {
		mutateFacets(store.facets);
		// mutateResults(store.results);

		await next();
	});

	// log the store
	controller.on('afterStore', async ({ controller }, next) => {
		controller.log.debug('store', controller.store.toJSON());
		await next();
	});

	controller.on('afterStore', scrollToTop);
}

function mutateFacets(facets) {
	for (let facet of facets) {
		let limit = 12;
		if (facet.display == 'palette' || facet.display == 'grid') {
			limit = 16;
		}

		facet.overflow?.setLimit(limit);
	}
}

function mutateResults(results) {
	for (let result of results) {
		result.mappings.core.name += '++';
	}
}

export async function scrollToTop(search, next) {
	window.scroll({ top: 0, left: 0, behavior: 'smooth' });
	await next();
}
