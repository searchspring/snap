import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { AutocompleteStore } from './AutocompleteStore';
import { AutocompleteResponseModel, MetaResponseModel, MetaResponseModelFacetDefaults } from '@searchspring/snapi-types';

const services = {
	urlManager: new UrlManager(new UrlTranslator()).detach(),
};

const mockData = new MockData({ meta: 'ac.meta' });

const autocompleteConfig = {
	id: 'autocomplete',
	selector: '',
	settings: {
		initializeFromUrl: false,
		syncInputs: false,
		history: {
			limit: 5,
		},
	},
};

describe('Autocomplete Store', () => {
	let searchData: AutocompleteResponseModel & {
		meta: MetaResponseModel & MetaResponseModelFacetDefaults;
	};

	beforeEach(() => {
		searchData = mockData.autocompleteMeta();
	});

	it('links the controller and controller urlManager to state', () => {
		const autocompleteStore = new AutocompleteStore(autocompleteConfig, services);

		expect(autocompleteStore.state.url).toStrictEqual(services.urlManager);
	});

	it('returns correct initial state', () => {
		const autocompleteStore = new AutocompleteStore(autocompleteConfig, services);

		expect(autocompleteStore.loading).toBe(false);

		expect(autocompleteStore.meta).toBeDefined();

		expect(autocompleteStore.terms).toBeDefined();
		expect(autocompleteStore.terms).toStrictEqual([]);

		expect(autocompleteStore.merchandising).toBeDefined();
		expect(autocompleteStore.merchandising).toEqual({ redirect: '', content: {}, campaigns: [] });

		expect(autocompleteStore.search).toBeDefined();
		expect(autocompleteStore.search?.query).toBeUndefined();

		expect(autocompleteStore.facets).toBeDefined();
		expect(autocompleteStore.facets).toHaveLength(0);

		expect(autocompleteStore.filters).toBeDefined();
		expect(autocompleteStore.filters).toHaveLength(0);

		expect(autocompleteStore.results).toBeDefined();
		expect(autocompleteStore.results).toHaveLength(0);

		expect(autocompleteStore.pagination).toBeDefined();
		expect(autocompleteStore.pagination?.totalResults).toBeUndefined();

		expect(autocompleteStore.sorting).toBeDefined();
		expect(autocompleteStore.sorting?.options).toHaveLength(0);

		expect(autocompleteStore.history).toBeDefined();
		expect(autocompleteStore.history).toHaveLength(0);

		expect(autocompleteStore.initHistory).toBeDefined();
		expect(autocompleteStore.resetHistory).toBeDefined();
	});

	it('update function updates all of the stores', () => {
		const autocompleteStore = new AutocompleteStore(autocompleteConfig, services);

		autocompleteStore.update(searchData);

		expect(autocompleteStore.meta).toBeDefined();

		expect(autocompleteStore.search).toBeDefined();
		expect(autocompleteStore.search?.query).toBeDefined();
		expect(autocompleteStore.search?.query?.string).toEqual(searchData.autocomplete?.query);
		expect(autocompleteStore.search?.originalQuery).toBeUndefined();

		expect(autocompleteStore.merchandising).toBeDefined();
		expect(autocompleteStore.merchandising).toEqual(searchData.merchandising);

		expect(autocompleteStore.facets).toHaveLength(searchData?.facets?.length!);

		expect(autocompleteStore.filters).toHaveLength(0);

		expect(autocompleteStore.results).toHaveLength(searchData?.results?.length!);

		expect(autocompleteStore.pagination?.totalResults).toBe(searchData.pagination?.totalResults);

		expect(autocompleteStore.sorting?.options).toHaveLength(searchData.meta.sortOptions?.length!);

		expect(autocompleteStore.history).toHaveLength(0);
	});

	it('reset functions are defined', () => {
		const autocompleteStore = new AutocompleteStore(autocompleteConfig, services);

		autocompleteStore.update(searchData);

		expect(autocompleteStore.reset).toBeDefined();
		expect(autocompleteStore.resetTrending).toBeDefined();
		expect(autocompleteStore.resetHistory).toBeDefined();
		expect(autocompleteStore.resetTerms).toBeDefined();
		expect(autocompleteStore.resetSuggestions).toBeDefined();
	});

	it('reset function calls sub-reset functions', () => {
		const autocompleteStore = new AutocompleteStore(autocompleteConfig, services);

		autocompleteStore.update(searchData);

		const resetTrendingSpy = jest.spyOn(autocompleteStore, 'resetTrending');
		const resetHistorySpy = jest.spyOn(autocompleteStore, 'resetHistory');
		const resetSuggestionsSpy = jest.spyOn(autocompleteStore, 'resetSuggestions');

		autocompleteStore.reset();

		expect(resetTrendingSpy).toHaveBeenCalled();
		expect(resetHistorySpy).toHaveBeenCalled();
		expect(resetSuggestionsSpy).toHaveBeenCalled();

		resetTrendingSpy.mockClear();
		resetHistorySpy.mockClear();
		resetSuggestionsSpy.mockClear();
	});

	it('reset functions actually reset data', () => {
		const mockStorage: {
			[key: string]: string;
		} = {};

		global.Storage.prototype.setItem = jest.fn((key, value) => {
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
		const historyData = ['dress', 'sleep', 'shirt', 'sandal', 'shoes'];

		global.localStorage.setItem(`ss-history`, JSON.stringify({ history: JSON.stringify(historyData) }));
		const autocompleteStore = new AutocompleteStore(autocompleteConfig, services);

		autocompleteStore.update(searchData);
		autocompleteStore.updateTrendingTerms(mockData.trending());

		expect(autocompleteStore.terms.length).toBeGreaterThan(0);
		expect(autocompleteStore.history.length).toBe(historyData.length);
		expect(autocompleteStore.trending.length).toBeGreaterThan(0);

		//can reset trending
		autocompleteStore.trending[0].preview();
		expect(autocompleteStore.trending[0].active).toBeTruthy();
		autocompleteStore.resetTrending();
		expect(autocompleteStore.trending[0].active).toBeFalsy();

		//can reset suggestions
		autocompleteStore.terms[0].preview();
		expect(autocompleteStore.terms[0].active).toBeTruthy();
		autocompleteStore.resetSuggestions();
		expect(autocompleteStore.terms[0].active).toBeFalsy();

		//can reset history
		autocompleteStore.history[0].preview();
		expect(autocompleteStore.history[0].active).toBeTruthy();
		autocompleteStore.resetHistory();
		expect(autocompleteStore.history[0].active).toBeFalsy();
	});
});
