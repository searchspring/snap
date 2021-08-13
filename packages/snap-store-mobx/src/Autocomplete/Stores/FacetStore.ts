import { FacetStore as SearchFacetStore } from '../../Search/Stores';

export class FacetStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(config, services, storage, facetsData, paginationData, meta, rootState) {
		// this.services, this.storage, data.facets, this.meta
		const facets = new SearchFacetStore(config, services, storage, facetsData, paginationData, meta);

		// mutate facet values to add 'preview' function
		facets.forEach((facet) => {
			facet.values?.forEach((value) => {
				value.url = services.urlManager.remove('filter').set(`filter.${facet.field}`, [value.value]);

				value.preview = () => {
					facets.map((facet) => {
						facet.filtered = false;
						facet.values?.map((value) => {
							value.filtered = false;
						});
					});

					facet.filtered = true;
					value.filtered = true;
					rootState.locks.facets.lock();
					value.url.go();
				};
			});
		});

		super(...facets);
	}
}
