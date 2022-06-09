import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { FacetStore } from './FacetStore';
import { StateStore } from './StateStore';
import { StorageStore } from '../../Storage/StorageStore';
import { Value } from '../../Search/Stores';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

const mockData = new MockData();

const autocompleteConfig = {
	id: 'autocomplete',
	selector: '',
	settings: {
		initializeFromUrl: false,
		syncInputs: false,
	},
};

describe('Facet store', () => {
	it('has a symbol species of Array', () => {
		expect(FacetStore[Symbol.species]).toBe(Array);
	});

	it('uses the search store FacetStore', () => {
		const searchData = mockData.autocompleteMeta('ac.facetStore.test');
		const storageStore = new StorageStore();
		const rootState = new StateStore(services);
		const facetStore = new FacetStore(
			autocompleteConfig,
			services,
			storageStore,
			searchData.facets!,
			searchData.pagination!,
			searchData.meta,
			rootState
		);

		expect(facetStore).toHaveLength(searchData.facets?.length!);
	});

	it('adds a preview function to each facet value', () => {
		const searchData = mockData.autocompleteMeta('ac.facetStore.test');
		const storageStore = new StorageStore();
		const rootState = new StateStore(services);

		const facetStore = new FacetStore(
			autocompleteConfig,
			services,
			storageStore,
			searchData.facets!,
			searchData.pagination!,
			searchData.meta,
			rootState
		);

		expect(rootState.locks.terms.locked).toBe(false);

		facetStore.forEach((facet) => {
			facet.values?.forEach((value: Value) => {
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
