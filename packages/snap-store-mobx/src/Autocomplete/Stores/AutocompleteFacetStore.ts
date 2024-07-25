import { SearchFacetStore, FacetValue } from '../../Search/Stores';
import type { AutocompleteData, StoreParameters } from '../../types';

export class AutocompleteFacetStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(params: StoreParameters<AutocompleteData>) {
		const { services, state } = params;

		// allow for only a singular facet option selection at a time

		const facets = new SearchFacetStore({
			...params,
			services: {
				...services,
				urlManager: services.urlManager.remove('filter'),
			},
		});

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
					state?.autocomplete.locks.facets.lock();
					value.url.go();
				};
			});
		});

		super(...facets);
	}
}
