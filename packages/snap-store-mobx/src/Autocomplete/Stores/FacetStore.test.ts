import { FacetStore } from './FacetStore';
import { StateStore } from './StateStore';
import { StorageStore } from '../../Storage/StorageStore';

import { SearchData } from '../../__mocks__/SearchData';
import { mockAutocompleteController } from '../../__mocks__/mockControllers';

describe('Facet store', () => {
	it('has a symbol species of Array', () => {
		expect(FacetStore[Symbol.species]).toBe(Array);
	});

	it('uses the search store FacetStore', () => {
		const searchData = new SearchData({ search: 'autocomplete' });
		const storageStore = new StorageStore();
		const rootState = new StateStore();

		const facetStore = new FacetStore(mockAutocompleteController, storageStore, searchData.facets, searchData.meta, rootState);

		expect(facetStore).toHaveLength(searchData.facets.length);
	});

	it('adds a preview function to each facet value', () => {
		const searchData = new SearchData({ search: 'autocomplete' });
		const storageStore = new StorageStore();
		const rootState = new StateStore();

		const facetStore = new FacetStore(mockAutocompleteController, storageStore, searchData.facets, searchData.meta, rootState);

		expect(rootState.locks.terms.locked).toBe(false);

		facetStore.forEach((facet) => {
			facet.values?.forEach((value) => {
				expect(value.preview).toBeDefined();
			});
		});

		const valueFacet = facetStore.filter((facet) => facet.values?.length).pop();

		valueFacet.values[0].url.go = jest.fn();
		valueFacet.values[0].preview();

		expect(valueFacet.values[0].url.go).toHaveBeenCalled();

		expect(rootState.locks.facets.locked).toBe(true);
	});
});
