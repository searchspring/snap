import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { AutocompleteFacetStore } from './AutocompleteFacetStore';
import { AutocompleteStateStore } from './AutocompleteStateStore';
import { StorageStore } from '../../Storage/StorageStore';
import { FacetValue } from '../../Search/Stores';

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
		expect(AutocompleteFacetStore[Symbol.species]).toBe(Array);
	});

	it('uses the search store FacetStore', () => {
		const searchData = mockData.autocompleteMeta('ac.facetStore.test');
		const storageStore = new StorageStore();
		const rootState = new AutocompleteStateStore(services);
		const facetStore = new AutocompleteFacetStore(
			autocompleteConfig,
			services,
			storageStore,
			searchData.facets!,
			searchData.pagination!,
			searchData.meta,
			rootState,
			searchData.merchandising || {}
		);

		expect(facetStore).toHaveLength(searchData.facets?.length!);
	});

	it('adds a preview function to each facet value', () => {
		const searchData = mockData.autocompleteMeta('ac.facetStore.test');
		const storageStore = new StorageStore();
		const rootState = new AutocompleteStateStore(services);

		const facetStore = new AutocompleteFacetStore(
			autocompleteConfig,
			services,
			storageStore,
			searchData.facets!,
			searchData.pagination!,
			searchData.meta,
			rootState,
			searchData.merchandising || {}
		);

		expect(rootState.locks.terms.locked).toBe(false);

		facetStore.forEach((facet) => {
			facet.values?.forEach((value: FacetValue) => {
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
