import { configure } from 'mobx';

import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';

import { SearchFacetStore, ValueFacet, FacetRangeValue, FacetValue, FacetHierarchyValue, RangeFacet } from './SearchFacetStore';
import { StorageStore } from '../../Storage/StorageStore';

import type {
	SearchResponseModel,
	SearchResponseModelFacetRange,
	MetaResponseModel,
	MetaResponseModelFacet,
	MetaResponseModelFacetDefaults,
	MetaResponseModelFacetSlider,
	SearchResponseModelFacetRangeBuckets,
} from '@searchspring/snapi-types';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

const mockData = new MockData();

const searchConfig = {
	id: 'search',
};

// disable strict-mode
configure({
	enforceActions: 'never',
});

describe('Facet Store', () => {
	let searchData: SearchResponseModel & {
		meta: MetaResponseModel &
			// MetaResponseModelFacet &
			MetaResponseModelFacetDefaults;
		// MetaResponseModelFacetGrid &
		// MetaResponseModelFacetHierarchy &
		// MetaResponseModelFacetList &
		// MetaResponseModelFacetPalette &
		// MetaResponseModelFacetSlider
	};

	let storageStore: StorageStore;
	beforeEach(() => {
		expect.hasAssertions();

		searchData = mockData.resetConfig().searchMeta();

		storageStore = new StorageStore();
	});

	it('has a symbol species of Array', () => {
		expect(SearchFacetStore[Symbol.species]).toBe(Array);
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		// @ts-ignore
		const facets = new SearchFacetStore(undefined, undefined, undefined, undefined, undefined, undefined);

		expect(facets.length).toBe(0);
	});

	it('returns an empty array when passed an empty array [] of facets', () => {
		// @ts-ignore
		const facets = new SearchFacetStore(searchConfig, services, storageStore, [], undefined, undefined);

		expect(facets instanceof Array).toBe(true);
		expect(facets.length).toBe(0);
	});

	it('returns an array the same length as the facets passed in', () => {
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);

		expect(facets.length).toBe(searchData.facets?.length);
	});

	it('adds a reference to services to each facet', () => {
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);

		for (const facet of facets) {
			expect(facet.services).toStrictEqual(services);
		}
	});

	it('it merges the proper facet meta', () => {
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);

		facets.forEach((facet) => {
			const searchDataFacet =
				searchData.meta.facets && (searchData.meta.facets[facet.field] as MetaResponseModelFacet & MetaResponseModelFacetDefaults);
			expect(facet.display).toBe(searchData.meta.facets && searchDataFacet?.display);
			expect(facet.label).toBe(searchData.meta.facets && searchDataFacet?.label);
			expect(facet.collapsed).toBe(searchData.meta.facets && searchDataFacet?.collapsed);
		});
	});

	it('will have facet data that matches what was passed in', () => {
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);

		facets.forEach((facet, index) => {
			const searchDataFacet = searchData.facets && searchData.facets[index];
			expect(facet.field).toBe(searchDataFacet?.field);
			expect(facet.filtered).toStrictEqual(searchDataFacet?.filtered);
			expect(facet.type).toStrictEqual(searchDataFacet?.type);
		});
	});

	it('it toggles the collapsed state', () => {
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);

		const collapsed = facets[0].collapsed;
		expect(collapsed).toEqual(false);
		facets[0].toggleCollapse();
		expect(facets[0].collapsed).toEqual(true);
	});

	it('it clears the selected options', () => {
		searchData = mockData.searchMeta('filtered');

		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);

		expect(facets[0].clear.url.constructor.name).toStrictEqual(services.urlManager.constructor.name);
		expect(facets[0].clear.url.href).not.toMatch(facets[0].field);
	});

	it('has overflow has values we expect', () => {
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);
		const valueFacet = facets.filter((facet) => facet.values).pop();

		expect(valueFacet.overflow.enabled).toBeDefined();
		expect(valueFacet.overflow.limited).toBeDefined();
		expect(valueFacet.overflow.limit).toBeDefined();
		expect(valueFacet.overflow.limit).toEqual(0);
		expect(valueFacet.overflow.setLimit).toBeDefined();
		expect(valueFacet.overflow.remaining).toBeUndefined();
		expect(valueFacet.overflow.toggle).toBeDefined();
		expect(valueFacet.overflow.calculate).toBeDefined();
	});

	it('has storage for overflow and restores the limit', () => {
		storageStore = new StorageStore();
		let facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);
		let facet = facets.filter((facet) => facet.values && facet.values.length > 2).pop();

		const limit = 2;
		expect(facet.overflow.enabled).toBe(false);
		facet.overflow.setLimit(limit);
		expect(facet.refinedValues.length).toBe(limit);
		expect(facet.overflow.enabled).toBe(true);
		expect(facet.overflow.limited).toBe(true);

		facet.overflow.toggle();

		expect(facet.overflow.limited).toBe(false);

		facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);
		expect(facet.overflow.limited).toBe(false);

		facet = facets.filter((facet) => facet.values && facet.values.length > 2).pop();
		facet.overflow.setLimit(limit);

		expect(facet.overflow.limited).toBe(false);
		expect(facet.overflow.enabled).toBe(true);
	});

	it('has overflow and the toggle function works as expected', () => {
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);
		const valueFacets = facets.filter((facet) => facet.values && facet.values.length > 3);

		valueFacets.forEach((facet) => {
			const limit = 2;
			facet.overflow.setLimit(limit);
			expect(facet.refinedValues.length).toBe(limit);
			expect(facet.overflow.limited).toBe(true);

			facet.overflow.toggle();
			expect(facet.refinedValues.length).toBe(facet.values.length);
			expect(facet.overflow.limited).toBe(false);
		});
	});

	it('has overflow and the toggle function can take a toggle value as parameter', () => {
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);
		const valueFacets = facets.filter((facet) => facet.values && facet.values.length > 3);

		valueFacets.forEach((facet) => {
			const limit = 2;
			facet.overflow.setLimit(limit);
			expect(facet.refinedValues.length).toBe(limit);
			expect(facet.overflow.limited).toBe(true);

			facet.overflow.toggle(true);
			expect(facet.overflow.limited).toBe(true);
			expect(facet.refinedValues.length).toBe(limit);

			facet.overflow.toggle(false);
			expect(facet.overflow.limited).toBe(false);
			expect(facet.refinedValues.length).toBe(facet.values.length);
		});
	});

	it('has overflow and works with the search input', () => {
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);
		const colorFacet = facets.filter((facet) => facet.field == 'color_family').pop();

		const limit = 5;
		colorFacet.overflow.setLimit(limit);
		expect(colorFacet.refinedValues.length).toBe(limit);
		expect(colorFacet.overflow.limited).toBe(true);

		// adding search filter on values for 'blue' and 'black'.
		colorFacet.search.input = 'bl';

		expect(colorFacet.refinedValues.length).toBe(2);
		expect(colorFacet.overflow.limited).toBe(true);
		expect(colorFacet.overflow.enabled).toBe(false);

		colorFacet.overflow.toggle();
		expect(colorFacet.refinedValues.length).toBe(2);
		expect(colorFacet.overflow.limited).toBe(false);
		expect(colorFacet.overflow.enabled).toBe(false);
	});

	it('uses range facet when needed', () => {
		searchData = mockData.searchMeta('range');

		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);
		const rangeFacet = facets.filter((facet) => facet.type == 'range').pop();

		expect(rangeFacet.type).toBe('range');
	});

	it('uses range values (range-buckets) when needed', () => {
		searchData = mockData.updateConfig({ meta: 'priceBuckets' }).searchMeta('priceBuckets');
		const facets = new SearchFacetStore(
			searchConfig,
			services,
			storageStore,
			searchData.facets,
			searchData.pagination,
			searchData.meta,
			searchData.merchandising || {}
		);
		const rangeFacet: ValueFacet = facets.filter((facet) => facet.type == 'range-buckets').pop();

		(rangeFacet?.values as Array<FacetRangeValue>).forEach((value) => {
			expect(value?.low).toBeDefined();
			expect(value?.high).toBeDefined();
		});
	});

	describe('Settings', () => {
		describe('Trim Facets', () => {
			it('can be set to trim no facets', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							trim: false,
						},
					},
				};

				const searchData = mockData.searchMeta('settings.trim');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				expect(facets.length).toBe(4);
			});

			it('can be set to trim all facets', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							trim: true,
						},
					},
				};

				const searchData = mockData.searchMeta('settings.trim');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				expect(facets.length).not.toBe(searchData.facets?.length);
				expect(facets.length).toBe(1);
			});

			it('can be set to NOT trim a specific facet', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							trim: true,
							fields: {
								color_family: {
									trim: false,
								},
							},
						},
					},
				};

				const searchData = mockData.searchMeta('settings.trim');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				expect(facets.length).toBe(2);
			});

			it('can be set to trim a specific facet', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							trim: false,
							fields: {
								color_family: {
									trim: true,
								},
							},
						},
					},
				};

				const searchData = mockData.searchMeta('settings.trim');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				expect(facets.length).toBe(3);
			});
		});

		describe('Pin Filtered Facets', () => {
			it('can be set to pin all selected facet values to the top of the values array', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							pinFiltered: true,
						},
					},
				};

				const searchData = mockData.searchMeta('settings.pinFiltered');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				expect(facets.length).toBe(2);
				facets.forEach((facet) => {
					facet.values.forEach((value: FacetValue, index: number) => {
						if (index == 0) {
							expect(value).toHaveProperty('filtered', true);
						}
					});
				});
			});

			it('can be set to NOT pin all selected facet values to the top of the values array', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							pinFiltered: false,
						},
					},
				};

				const searchData = mockData.searchMeta('settings.pinFiltered');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				expect(facets.length).toBe(2);
				facets.forEach((facet) => {
					expect(facet.values[2]).toHaveProperty('filtered', true);
				});
			});

			it('can be set to NOT pin all selected facet values to the top of the values array for a specific facet', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							pinFiltered: true,
							fields: {
								size: {
									pinFiltered: false,
								},
							},
						},
					},
				};

				const searchData = mockData.searchMeta('settings.pinFiltered');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				expect(facets.length).toBe(2);
				facets.forEach((facet) => {
					if (facet.field == 'size') {
						expect(facet.values[2]).toHaveProperty('filtered', true);
					} else {
						expect(facet.values[0]).toHaveProperty('filtered', true);
					}
				});
			});

			it('can be set to pin all selected facet values to the top of the values array for a specific facet', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							pinFiltered: false,
							fields: {
								size: {
									pinFiltered: true,
								},
							},
						},
					},
				};

				const searchData = mockData.searchMeta('settings.pinFiltered');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				expect(facets.length).toBe(2);
				facets.forEach((facet) => {
					if (facet.field == 'size') {
						expect(facet.values[0]).toHaveProperty('filtered', true);
					} else {
						expect(facet.values[2]).toHaveProperty('filtered', true);
					}
				});
			});
		});

		describe('Store Range', () => {
			it('can be set to store range facet boundaries', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							storeRange: true,
						},
					},
				};

				const searchData = mockData.searchMeta('settings.storeRange');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				expect(facets.length).toBe(1);

				const searchDataFacet = searchData.facets && (searchData.facets[0] as SearchResponseModelFacetRange);
				expect(facets[0].range.low).toBe(searchDataFacet?.range?.low);
				expect(facets[0].range.high).toBe(searchDataFacet?.range?.high);
				expect(facets[0].active.low).toBe(searchDataFacet?.range?.low);
				expect(facets[0].active.high).toBe(searchDataFacet?.range?.high);

				// load up filtered data to verify the range remains from initial search ('settings.storeRange')

				const filteredSearchData = mockData.searchMeta('settings.storeRange.filtered');

				const updatedFacets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					filteredSearchData.facets,
					filteredSearchData.pagination,
					filteredSearchData.meta,
					filteredSearchData.merchandising || {}
				);

				const updatedSearchDataFacet = filteredSearchData.facets && (filteredSearchData.facets[0] as SearchResponseModelFacetRange);
				expect(updatedFacets.length).toBe(1);
				expect(updatedFacets[0].range.low).toBe(searchDataFacet?.range?.low);
				expect(updatedFacets[0].range.high).toBe(searchDataFacet?.range?.high);
				expect(updatedFacets[0].active.low).toBe(updatedSearchDataFacet?.range?.low);
				expect(updatedFacets[0].active.high).toBe(updatedSearchDataFacet?.range?.high);
			});

			it('can be set to NOT store range facet boundaries', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							storeRange: false,
						},
					},
				};

				const searchData = mockData.searchMeta('settings.storeRange');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);

				const searchDataFacet = searchData.facets && (searchData.facets[0] as SearchResponseModelFacetRange);
				expect(facets.length).toBe(1);
				expect(facets[0].range.low).toBe(searchDataFacet?.range?.low);
				expect(facets[0].range.high).toBe(searchDataFacet?.range?.high);
				expect(facets[0].active.low).toBe(searchDataFacet?.range?.low);
				expect(facets[0].active.high).toBe(searchDataFacet?.range?.high);

				// load up filtered data to verify the range remains from initial search ('settings.storeRange')

				const filteredSearchData = mockData.searchMeta('settings.storeRange.filtered');

				const updatedFacets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					filteredSearchData.facets,
					filteredSearchData.pagination,
					filteredSearchData.meta,
					filteredSearchData.merchandising || {}
				);

				const filteredSearchDataFacet = filteredSearchData.facets && (filteredSearchData.facets[0] as SearchResponseModelFacetRange);
				expect(updatedFacets.length).toBe(1);
				expect(updatedFacets[0].range.low).toBe(filteredSearchDataFacet?.range?.low);
				expect(updatedFacets[0].range.high).toBe(filteredSearchDataFacet?.range?.high);
				expect(updatedFacets[0].active.low).toBe(filteredSearchDataFacet?.range?.low);
				expect(updatedFacets[0].active.high).toBe(filteredSearchDataFacet?.range?.high);
			});

			it('can be set to store range facet boundaries per facet', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							storeRange: false,
							fields: {
								price: {
									storeRange: true,
								},
							},
						},
					},
				};

				const searchData = mockData.searchMeta('settings.storeRange');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);

				const searchDataFacet = searchData.facets && (searchData.facets[0] as SearchResponseModelFacetRange);
				expect(facets.length).toBe(1);
				expect(facets[0].range.low).toBe(searchDataFacet?.range?.low);
				expect(facets[0].range.high).toBe(searchDataFacet?.range?.high);
				expect(facets[0].active.low).toBe(searchDataFacet?.range?.low);
				expect(facets[0].active.high).toBe(searchDataFacet?.range?.high);

				// load up filtered data to verify the range remains from initial search ('settings.storeRange')

				const filteredSearchData = mockData.searchMeta('settings.storeRange.filtered');

				const updatedFacets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					filteredSearchData.facets,
					filteredSearchData.pagination,
					filteredSearchData.meta,
					filteredSearchData.merchandising || {}
				);

				const filteredSearchDataFacet = filteredSearchData.facets && (filteredSearchData.facets[0] as SearchResponseModelFacetRange);
				expect(updatedFacets.length).toBe(1);
				expect(updatedFacets[0].range.low).toBe(searchDataFacet?.range?.low);
				expect(updatedFacets[0].range.high).toBe(searchDataFacet?.range?.high);
				expect(updatedFacets[0].active.low).toBe(filteredSearchDataFacet?.range?.low);
				expect(updatedFacets[0].active.high).toBe(filteredSearchDataFacet?.range?.high);
			});

			it('can be set to NOT store range facet boundaries per facet', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							storeRange: true,
							fields: {
								price: {
									storeRange: false,
								},
							},
						},
					},
				};

				const searchData = mockData.searchMeta('settings.storeRange');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);

				const searchDataFacet = searchData.facets && (searchData.facets[0] as SearchResponseModelFacetRange);
				expect(facets.length).toBe(1);
				expect(facets[0].range.low).toBe(searchDataFacet?.range?.low);
				expect(facets[0].range.high).toBe(searchDataFacet?.range?.high);
				expect(facets[0].active.low).toBe(searchDataFacet?.range?.low);
				expect(facets[0].active.high).toBe(searchDataFacet?.range?.high);

				// load up filtered data to verify the range remains from initial search ('settings.storeRange')

				const filteredSearchData = mockData.searchMeta('settings.storeRange.filtered');

				const updatedFacets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					filteredSearchData.facets,
					filteredSearchData.pagination,
					filteredSearchData.meta,
					filteredSearchData.merchandising || {}
				);

				const filteredSearchDataFacet = filteredSearchData.facets && (filteredSearchData.facets[0] as SearchResponseModelFacetRange);
				expect(updatedFacets.length).toBe(1);
				expect(updatedFacets[0].range.low).toBe(filteredSearchDataFacet?.range?.low);
				expect(updatedFacets[0].range.high).toBe(filteredSearchDataFacet?.range?.high);
				expect(updatedFacets[0].active.low).toBe(filteredSearchDataFacet?.range?.low);
				expect(updatedFacets[0].active.high).toBe(filteredSearchDataFacet?.range?.high);
			});
		});

		describe('Auto Open Active Facets', () => {
			it('can be set to automatically open normally closed facets when they are active', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							autoOpenActive: true,
						},
					},
				};

				const searchData = mockData.searchMeta('settings.autoOpenActive');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);

				const materialFacet = facets.filter((facet) => facet.field == 'material').pop();
				expect(materialFacet).toHaveProperty('collapsed', false);
			});

			it('can be set to NOT automatically open normally closed facets when they are active', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							autoOpenActive: false,
						},
					},
				};

				const searchData = mockData.searchMeta('settings.autoOpenActive');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);

				const materialFacet = facets.filter((facet) => facet.field == 'material').pop();
				expect(materialFacet).toHaveProperty('collapsed', true);
			});

			it('can be set to NOT automatically open normally closed facets when they are active for a specific facet', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							autoOpenActive: true,
							fields: {
								material: {
									autoOpenActive: false,
								},
							},
						},
					},
				};

				const searchData = mockData.searchMeta('settings.autoOpenActive');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);

				const materialFacet = facets.filter((facet) => facet.field == 'material').pop();
				expect(materialFacet).toHaveProperty('collapsed', true);

				const saleFacet = facets.filter((facet) => facet.field == 'on_sale').pop();
				expect(saleFacet).toHaveProperty('collapsed', false);
			});

			it('can be set to automatically open normally closed facets when they are active for a specific facet', () => {
				const settingsConfig = {
					...searchConfig,
					settings: {
						facets: {
							autoOpenActive: false,
							fields: {
								material: {
									autoOpenActive: true,
								},
							},
						},
					},
				};

				const searchData = mockData.searchMeta('settings.autoOpenActive');

				const facets = new SearchFacetStore(
					settingsConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);

				const materialFacet = facets.filter((facet) => facet.field == 'material').pop();
				expect(materialFacet).toHaveProperty('collapsed', false);

				const saleFacet = facets.filter((facet) => facet.field == 'on_sale').pop();
				expect(saleFacet).toHaveProperty('collapsed', true);
			});
		});
	});

	describe('ValueFacet', () => {
		it('has the correct facet properties', () => {
			const facets = new SearchFacetStore(
				searchConfig,
				services,
				storageStore,
				searchData.facets,
				searchData.pagination,
				searchData.meta,
				searchData.merchandising || {}
			);

			facets.forEach((facet) => {
				expect(facet.multiple).toBe((searchData?.meta?.facets && (searchData?.meta?.facets[facet.field] as ValueFacet))?.multiple);
			});
		});

		describe('value', () => {
			it('stores the correct facet values', () => {
				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);

				facets.forEach((facet, index) => {
					if (facet.type == 'value') {
						expect(facet.values.length).toBe((searchData.facets && (searchData.facets[index] as ValueFacet))?.values.length);
					}
				});
			});

			it('has a removal URL for filter value when it is filtered/active', () => {
				searchData = mockData.searchMeta('filtered');

				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				const filteredValueFacet = facets.filter((facet) => facet.type == 'value' && facet.filtered).pop();

				const filteredValues = filteredValueFacet.values.filter((value: FacetValue) => value.filtered);

				filteredValues.forEach((filteredValue: FacetValue) => {
					expect(filteredValue.url.href).not.toMatch(filteredValueFacet.field);
				});
			});

			it('has a URL for filter value when it is not filtered/active', () => {
				searchData = mockData.searchMeta();

				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				const filteredValueFacet = facets.filter((facet) => facet.type == 'value').pop();

				const filteredValues = filteredValueFacet.values.filter((value: FacetValue) => !value.filtered);

				filteredValues.forEach((filteredValue: FacetValue) => {
					expect(filteredValue.url.href).toMatch(filteredValueFacet.field);
					expect(filteredValue.url.href).toMatch(filteredValue.value);
				});
			});

			it('uses FacetHierarchyValue when the hierarchy display type is used', () => {
				searchData = mockData.searchMeta('filteredHierarchy');

				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				const hierarchyFacet = facets.filter((facet) => facet.display == 'hierarchy').pop();

				hierarchyFacet.values.forEach((value: FacetHierarchyValue) => {
					expect(value.url).toBeDefined();
					expect(value.level).toBeGreaterThanOrEqual(0);
				});
			});

			it.skip('supports multi select facets', () => {
				searchData = mockData.searchMeta('filtered');

				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				const multiSelectFacet = facets.filter((facet) => facet.filtered && facet.type == 'value' && facet.multiple != 'single')[0];

				const selectedFacetValue = multiSelectFacet.values.filter((value: FacetValue) => value.filtered)[0];
				expect(selectedFacetValue.value).toBeDefined();

				const unselectedFacetValue = multiSelectFacet.values.filter((value: FacetValue) => !value.filtered)[0];

				expect(unselectedFacetValue.url.href).toMatch(unselectedFacetValue.value);
				expect(unselectedFacetValue.url.href).toMatch(selectedFacetValue.value);
			});

			it('supports single select facets', () => {
				searchData = mockData.searchMeta('filtered');

				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				const singleSelectFacet = facets.filter((facet) => facet.multiple == 'single' && facet.filtered).pop();

				const selectedFacetValue = singleSelectFacet.values.filter((value: FacetValue) => value.filtered).pop();
				expect(selectedFacetValue.value).toBeDefined();

				const unselectedFacetValue = singleSelectFacet.values.filter((value: FacetValue) => !value.filtered).pop();

				expect(unselectedFacetValue.url.href).not.toMatch(selectedFacetValue.value);
			});
		});

		describe('range-buckets', () => {
			it('stores the correct facet values', () => {
				searchData = mockData.updateConfig({ meta: 'priceBuckets' }).searchMeta('priceBuckets');
				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);

				facets.forEach((facet, index) => {
					if (facet.type == 'range-buckets') {
						expect(facet.values.length).toBe(
							(searchData?.facets && (searchData.facets[index] as SearchResponseModelFacetRangeBuckets))?.values?.length
						);
						facet.values.forEach((value: FacetRangeValue) => {
							expect(value).toHaveProperty('low');
							expect(value).toHaveProperty('high');
						});
					}
				});
			});

			it('has a URL for filter value when it is filtered/active', () => {
				searchData = mockData.updateConfig({ meta: 'priceBuckets' }).searchMeta('filteredRangeBucket');

				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				const filteredRangeBucketFacet: ValueFacet = facets.filter((facet) => facet.type == 'range-buckets').pop();

				const filteredValues = filteredRangeBucketFacet.values.filter((value) => value?.filtered);

				filteredValues.forEach((filteredValue) => {
					// removing the filter (URL should not have the value)
					expect(filteredValue?.url.href).not.toMatch(filteredRangeBucketFacet.field);
				});
			});

			it('has a removal URL for filter value when it is not filtered/active', () => {
				searchData = mockData.updateConfig({ meta: 'priceBuckets' }).searchMeta('filteredRangeBucket');

				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				const filteredRangeBucketFacet = facets.filter((facet) => facet.type == 'range-buckets' && facet.filtered).pop();
				const filteredValues = filteredRangeBucketFacet.values.filter((value: FacetRangeValue) => !value?.filtered);
				filteredValues.forEach((filteredValue: FacetRangeValue) => {
					expect(filteredValue.url.href).toMatch(`filter:${filteredRangeBucketFacet.field}:${filteredValue.low}:${filteredValue.high}`);
				});
			});

			it('has a removal URL for filter value when it is filtered/active with single select', () => {
				searchData = mockData.updateConfig({ meta: 'priceBucketsPriceSingle' }).searchMeta('filteredRangeBucket');

				const facets = new SearchFacetStore(
					searchConfig,
					services,
					storageStore,
					searchData.facets,
					searchData.pagination,
					searchData.meta,
					searchData.merchandising || {}
				);
				const filteredRangeBucketFacet: ValueFacet = facets
					.filter((facet) => facet.type == 'range-buckets' && facet.multiple == 'single' && facet.filtered)
					.pop();

				const selectedFacetValue = filteredRangeBucketFacet.values.filter((value) => value?.filtered).pop();
				expect(selectedFacetValue).toHaveProperty('low');
				expect(selectedFacetValue).toHaveProperty('high');

				const unselectedFacetValue = filteredRangeBucketFacet.values.filter((value) => !value?.filtered).pop() as FacetRangeValue;

				// to find a match only once
				expect(unselectedFacetValue?.url.href).toMatch(
					`filter:${filteredRangeBucketFacet.field}:${unselectedFacetValue?.low}:${unselectedFacetValue?.high}`
				);
			});
		});
	});

	describe('RangeFacet', () => {
		it('it merges the proper facet meta', () => {
			searchData = mockData.searchMeta('range');

			const facets = new SearchFacetStore(
				searchConfig,
				services,
				storageStore,
				searchData.facets,
				searchData.pagination,
				searchData.meta,
				searchData.merchandising || {}
			);
			const rangeFacets: RangeFacet[] = facets.filter((facet) => facet.type == 'range');

			rangeFacets.forEach((facet) => {
				const searchDataFacet = searchData.meta.facets && (searchData.meta.facets[facet.field] as MetaResponseModelFacetSlider);
				expect(facet.formatValue).toBe(searchDataFacet?.formatValue);
				expect(facet.formatSeparator).toBe(searchDataFacet?.formatSeparator);
			});
		});

		it('it has the correct facet properties', () => {
			searchData = mockData.searchMeta('range');

			const facets = new SearchFacetStore(
				searchConfig,
				services,
				storageStore,
				searchData.facets,
				searchData.pagination,
				searchData.meta,
				searchData.merchandising || {}
			);

			facets.forEach((facet: RangeFacet, index: number) => {
				if (facet.type == 'range') {
					const searchDataFacet = searchData.facets && (searchData.facets[index] as SearchResponseModelFacetRange);
					expect(facet.step).toBe(searchDataFacet?.step);
					expect(facet.range).toStrictEqual(searchDataFacet?.range);
					expect(facet.active).toStrictEqual(searchDataFacet?.active);
				}
			});
		});
	});
});
