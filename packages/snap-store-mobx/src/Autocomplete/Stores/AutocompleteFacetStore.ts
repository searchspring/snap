import { SearchFacetStore, FacetValue } from '../../Search/Stores';
import type { StorageStore } from '../../Storage/StorageStore';
import type { AutocompleteStateStore } from './AutocompleteStateStore';
import type { AutocompleteStoreConfig, SearchStoreConfig, StoreServices } from '../../types';
import type { SearchResponseModelFacet, SearchResponseModelPagination, MetaResponseModel } from '@searchspring/snapi-types';

export class AutocompleteFacetStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(
		config: SearchStoreConfig | AutocompleteStoreConfig,
		services: StoreServices,
		storage: StorageStore,
		facetsData: SearchResponseModelFacet[],
		paginationData: SearchResponseModelPagination,
		meta: MetaResponseModel,
		rootState: AutocompleteStateStore
	) {
		// allow for only a singular facet option selection at a time
		const alteredServices = { ...services, urlManager: services.urlManager.remove('filter') };
		const facets = new SearchFacetStore(config, alteredServices, storage, facetsData, paginationData, meta);

		// mutate facet values to add 'preview' function
		facets.forEach((facet) => {
			facet.values?.forEach((value: FacetValue) => {
				value.preview = () => {
					facets.map((facet) => {
						facet.filtered = false;
						facet.values?.map((value: FacetValue) => {
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
