import { FacetStore as SearchFacetStore } from '../../Search/Stores';
import type { StorageStore } from '../../Storage/StorageStore';
import type { StateStore } from './StateStore';
import type { AutocompleteControllerConfig, SearchControllerConfig, StoreServices } from '../../types';
import type { SearchResponseModelFacet, SearchResponseModelPagination, MetaResponseModel } from '@searchspring/snapi-types';

export class FacetStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(
		config: SearchControllerConfig | AutocompleteControllerConfig | Record<string, never>,
		services: StoreServices,
		storage: StorageStore,
		facetsData: SearchResponseModelFacet[],
		paginationData: SearchResponseModelPagination,
		meta: MetaResponseModel,
		rootState: StateStore
	) {
		// allow for only a singular facet option selection at a time
		const alteredServices = { ...services, urlManager: services.urlManager.remove('filter') };
		const facets = new SearchFacetStore(config, alteredServices, storage, facetsData, paginationData, meta);

		// mutate facet values to add 'preview' function
		facets.forEach((facet) => {
			facet.values?.forEach((value) => {
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
