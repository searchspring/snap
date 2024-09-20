import deepmerge from 'deepmerge';
import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelResultCoreMappings } from '@searchspring/snapi-types';

import { Banner, Product, SearchResultStore, ProductMask, Variants, Variant, VariantSelection, VariantData } from './SearchResultStore';
import { StoreConfigs, VariantConfig } from '../../types';

const mockData = new MockData();

const searchConfig = {
	id: 'search',
};

describe('SearchResultStore', () => {
	beforeEach(() => {
		expect.hasAssertions();
	});

	it('has a symbol species of Array', () => {
		expect(SearchResultStore[Symbol.species]).toBe(Array);
	});

	it('returns an empty array when nothing is passed to the constructor', () => {
		// @ts-ignore - empty constructor
		const results = new SearchResultStore();

		expect(results.length).toBe(0);
	});

	it('returns an empty array when passed an empty array [] of results', () => {
		const searchData = mockData.searchMeta();
		searchData.search.results = [];
		const results = new SearchResultStore({
			config: searchConfig,
			state: {
				loaded: false,
			},
			data: {
				search: searchData.search,
				meta: {},
			},
		});

		expect(results.length).toBe(0);
	});

	it('returns an array the same length as the results passed in', () => {
		const searchData = mockData.searchMeta();

		const results = new SearchResultStore({
			config: searchConfig,
			state: {
				loaded: false,
			},
			data: {
				search: searchData.search,
				meta: {},
			},
		});

		expect(results.length).toBe(searchData.search.results?.length);
	});

	it('has result data that matches what was passed in', () => {
		const searchData = mockData.searchMeta();

		const results = new SearchResultStore({
			config: searchConfig,
			state: {
				loaded: false,
			},
			data: {
				search: searchData.search,
				meta: {},
			},
		});

		results.forEach((result, index) => {
			// check id
			expect(result.id).toBe(searchData.search.results && searchData.search.results[index].id);

			// check core mappings
			Object.keys(result.mappings.core!).forEach((key) => {
				const core = searchData.search.results && searchData.search.results[index]?.mappings?.core;
				const value = core && core[key as keyof SearchResponseModelResultCoreMappings];
				expect(result.mappings?.core && result.mappings?.core[key as keyof SearchResponseModelResultCoreMappings]).toBe(value);
			});

			// check attributes
			Object.keys(result.attributes).forEach((key) => {
				const attributes = searchData.search.results && searchData.search.results[index] && searchData.search.results[index].attributes;
				const value = attributes && attributes[key];
				expect(result.attributes[key]).toStrictEqual(value);
			});
		});
	});

	describe('mask with display property', () => {
		describe('mask class', () => {
			it('can be set with data', () => {
				const mask = new ProductMask();
				expect(mask.data).toStrictEqual({});

				const dataToSet = { mappings: { core: { name: 'new name', price: 1.0 } }, attributes: { special: 'thing' } };
				mask.set(dataToSet);
				expect(mask.data).toStrictEqual(dataToSet);
			});

			it('can be set with data and then reset', () => {
				const mask = new ProductMask();
				expect(mask.data).toStrictEqual({});

				const dataToSet = { mappings: { core: { name: 'data to reset', price: 0 } }, attributes: { special: 'thing', more: 'stuff' } };
				mask.set(dataToSet);
				expect(mask.data).toStrictEqual(dataToSet);

				mask.reset();
				expect(mask.data).toStrictEqual({});
			});

			it('can be merged with data', () => {
				const mask = new ProductMask();
				expect(mask.data).toStrictEqual({});

				const dataToMerge = { mappings: { core: { name: 'initial name', price: 0 } }, attributes: { initial: 'thing' } };
				mask.merge(dataToMerge);
				expect(mask.data).toStrictEqual(dataToMerge);

				const moreDataToMerge = {
					mappings: { core: { name: 'merged name', price: 7, msrp: 10 } },
					attributes: { additional: 'things', with: 'stuff' },
				};
				mask.merge(moreDataToMerge);
				expect(mask.data).toStrictEqual(deepmerge(dataToMerge, moreDataToMerge));
			});

			it('can be merged with data and then reset', () => {
				const mask = new ProductMask();
				expect(mask.data).toStrictEqual({});

				const dataToMerge = { mappings: { core: { name: 'data to reset', price: 0 } } };
				mask.merge(dataToMerge);
				expect(mask.data).toStrictEqual(dataToMerge);

				mask.reset();
				expect(mask.data).toStrictEqual({});
			});
		});

		it('has a mask property and also a display property that "masks"" the core fields and attributes', () => {
			const searchData = mockData.searchMeta();

			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			results.forEach((result, index) => {
				// check display properties
				expect(Object.keys((result as Product).display).length).toBe(3);
				expect((result as Product).display).toHaveProperty('id');
				expect((result as Product).display).toHaveProperty('mappings');
				expect((result as Product).display).toHaveProperty('attributes');

				const mask = (result as Product).mask;
				expect(mask).toHaveProperty('merge');
				expect(mask).toHaveProperty('set');
				expect(mask).toHaveProperty('reset');
				expect(mask).toHaveProperty('data');
				expect(mask.data).toStrictEqual({});

				// check core mappings
				Object.keys(result.mappings.core!).forEach((key) => {
					const core = result.mappings?.core;
					const displayCore = (result as Product).display.mappings?.core;

					const coreValue = core && core[key as keyof SearchResponseModelResultCoreMappings];
					const displayCoreValue = displayCore && displayCore[key as keyof SearchResponseModelResultCoreMappings];

					expect(displayCoreValue).toStrictEqual(coreValue);
				});

				// check attributes
				Object.keys(result.attributes).forEach((key) => {
					const attributes = result.attributes;
					const displayAttributes = (result as Product).display.attributes;

					const attributesValue = attributes && attributes[key];
					const displayAttributesValue = displayAttributes && displayAttributes[key];

					expect(displayAttributesValue).toStrictEqual(attributesValue);
				});
			});
		});

		it('can use the mask with the display property', () => {
			const searchData = mockData.searchMeta();

			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});
			const firstProduct = results[0] as Product;

			const maskData = { mappings: { core: { name: 'new name', price: 1.0 } }, attributes: { special: 'thing' } };
			firstProduct.mask.set(maskData);

			expect(firstProduct.display.mappings.core?.name).toBe(maskData.mappings.core.name);
			expect(firstProduct.display.mappings.core?.price).toBe(maskData.mappings.core.price);
			expect(firstProduct.display.attributes.special).toBe(maskData.attributes.special);
		});
	});

	describe('with variants', () => {
		it('can be configured to construct variants from specified JSON field', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});
			expect(results.length).toBe(searchData.search.results?.length);

			results.forEach((result, index) => {
				const productData = searchData.search.results && searchData.search.results[index];
				const variantData = productData?.attributes?.ss_variants;
				expect(variantData).toBeDefined();
				const parsedVariantData = JSON.parse(variantData as unknown as string);

				const variants = (result as Product).variants;

				expect(variants?.data.length).toStrictEqual(parsedVariantData.filter((variant: any) => variant.attributes.available !== false).length);
				expect(variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);
			});
		});

		it('can use variants.update', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});
			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const variantDataToUse = results[2].attributes.ss_variants;
			const parsedVariantDataToUse = JSON.parse(variantDataToUse as unknown as string);

			results.forEach((result, index) => {
				const productData = searchData.search.results && searchData.search.results[index];
				const variantData = productData?.attributes?.ss_variants;

				expect(variantData).toBeDefined();
				const parsedVariantData = JSON.parse(variantData as unknown as string);

				const variants = (result as Product).variants;

				expect(variants).toBeDefined();

				expect((result as Product).variants?.data.length).toStrictEqual(
					parsedVariantData.filter((variant: any) => variant.attributes.available !== false).length
				);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

				(result as Product).variants?.update(parsedVariantDataToUse);

				expect((result as Product).variants).toBeDefined();

				expect((result as Product).variants?.data.length).toStrictEqual(
					parsedVariantDataToUse.filter((variant: any) => variant.attributes.available !== false).length
				);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantDataToUse[0].options).length);
			});
		});

		it('can be configured to preselect certain variants', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						options: {
							color: {
								preSelected: ['mirage', 'khaki', 'desert'],
							},
							size: {
								preSelected: ['32'],
							},
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});
			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const resultForTest = results[0] as Product;
			expect(resultForTest).toBeDefined();

			const colorSelection = resultForTest.variants?.selections.find((selection) => selection.field == 'color');
			const sizeSelection = resultForTest.variants?.selections.find((selection) => selection.field == 'size');
			expect(sizeSelection).toBeDefined();
			expect(colorSelection).toBeDefined();

			const colorSettings =
				variantSearchConfig.settings?.variants?.options && variantSearchConfig.settings?.variants?.options[colorSelection?.field!].preSelected;
			const sizeSettings =
				variantSearchConfig.settings?.variants?.options && variantSearchConfig.settings?.variants?.options[sizeSelection?.field!].preSelected;

			expect(colorSettings).toContain(colorSelection?.selected?.value?.toLocaleLowerCase());
			expect(sizeSettings).toContain(sizeSelection?.selected?.value?.toLocaleLowerCase());
		});

		it('uses the original constructed config when calling variants.update', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						options: {
							color: {
								preSelected: ['mirage', 'khaki', 'desert'],
							},
							size: {
								preSelected: ['32'],
							},
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});
			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const variantDataToUse = results[0].attributes.ss_variants as string;
			const parsedVariantDataToUse = JSON.parse(variantDataToUse);

			const resultForTest = results[0] as Product;

			const productData = searchData.search.results && searchData.search.results[0];
			const variantData = productData?.attributes?.ss_variants;

			expect(variantData).toBeDefined();

			const parsedVariantData = JSON.parse(variantData as unknown as string);

			const variants = (resultForTest as Product).variants;

			expect(variants).toBeDefined();

			expect((resultForTest as Product).variants?.data.length).toStrictEqual(
				parsedVariantData.filter((variant: any) => variant.attributes.available !== false).length
			);
			expect((resultForTest as Product).variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

			(resultForTest as Product).variants?.update(parsedVariantDataToUse);

			expect((resultForTest as Product).variants).toBeDefined();

			expect((resultForTest as Product).variants?.data.length).toStrictEqual(
				parsedVariantData.filter((variant: any) => variant.attributes.available !== false).length
			);
			expect((resultForTest as Product).variants?.selections.length).toBe(Object.keys(parsedVariantDataToUse[0].options).length);

			expect(resultForTest).toBeDefined();

			const colorSelection = resultForTest.variants?.selections.find((selection) => selection.field == 'color');
			const sizeSelection = resultForTest.variants?.selections.find((selection) => selection.field == 'size');
			expect(sizeSelection).toBeDefined();
			expect(colorSelection).toBeDefined();

			const colorSettings =
				variantSearchConfig.settings?.variants?.options && variantSearchConfig.settings?.variants?.options[colorSelection?.field!].preSelected;
			const sizeSettings =
				variantSearchConfig.settings?.variants?.options && variantSearchConfig.settings?.variants?.options[sizeSelection?.field!].preSelected;

			expect(colorSettings).toContain(colorSelection?.selected?.value?.toLocaleLowerCase());
			expect(sizeSettings).toContain(sizeSelection?.selected?.value?.toLocaleLowerCase());
		});

		it('can use a different config when calling variants.update', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						options: {
							color: {
								preSelected: ['mirage', 'khaki', 'desert'],
							},
							size: {
								preSelected: ['32'],
							},
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});
			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const variantDataToUse = results[0].attributes.ss_variants as string;
			const parsedVariantDataToUse = JSON.parse(variantDataToUse);

			const resultForTest = results[0] as Product;

			const productData = searchData.search.results && searchData.search.results[0];
			const variantData = productData?.attributes?.ss_variants;

			expect(variantData).toBeDefined();

			const parsedVariantData = JSON.parse(variantData as unknown as string);

			const variants = (resultForTest as Product).variants;

			expect(variants).toBeDefined();

			expect((resultForTest as Product).variants?.data.length).toStrictEqual(
				parsedVariantData.filter((variant: any) => variant.attributes.available !== false).length
			);
			expect((resultForTest as Product).variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

			(resultForTest as Product).variants?.update(parsedVariantDataToUse);

			expect((resultForTest as Product).variants).toBeDefined();

			expect((resultForTest as Product).variants?.data.length).toStrictEqual(
				parsedVariantDataToUse.filter((variant: any) => variant.attributes.available !== false).length
			);
			expect((resultForTest as Product).variants?.selections.length).toBe(Object.keys(parsedVariantDataToUse[0].options).length);

			expect(resultForTest).toBeDefined();

			const colorSelection = resultForTest.variants?.selections.find((selection) => selection.field == 'color');
			const sizeSelection = resultForTest.variants?.selections.find((selection) => selection.field == 'size');
			expect(sizeSelection).toBeDefined();
			expect(colorSelection).toBeDefined();

			const colorSettings =
				variantSearchConfig.settings?.variants?.options && variantSearchConfig.settings?.variants?.options[colorSelection?.field!].preSelected;
			const sizeSettings =
				variantSearchConfig.settings?.variants?.options && variantSearchConfig.settings?.variants?.options[sizeSelection?.field!].preSelected;

			expect(colorSettings).toContain(colorSelection?.selected?.value?.toLocaleLowerCase());
			expect(sizeSettings).toContain(sizeSelection?.selected?.value?.toLocaleLowerCase());

			//now lets make a new config with different settings and run update with it

			const newVariantsConfig: VariantConfig = {
				field: 'ss_variants',
				options: {
					color: {
						preSelected: ['scout'],
					},
					inseam: {
						preSelected: ['34'],
					},
				},
			};

			expect(variantData).toBeDefined();

			expect(variants).toBeDefined();

			expect((resultForTest as Product).variants?.data.length).toStrictEqual(
				parsedVariantData.filter((variant: any) => variant.attributes.available !== false).length
			);
			expect((resultForTest as Product).variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

			(resultForTest as Product).variants?.update(parsedVariantDataToUse, newVariantsConfig);

			expect((resultForTest as Product).variants).toBeDefined();

			expect((resultForTest as Product).variants?.data.length).toStrictEqual(
				parsedVariantDataToUse.filter((variant: any) => variant.attributes.available !== false).length
			);
			expect((resultForTest as Product).variants?.selections.length).toBe(Object.keys(parsedVariantDataToUse[0].options).length);

			expect(resultForTest).toBeDefined();

			const newcolorSelection = resultForTest.variants?.selections.find((selection) => selection.field == 'color');
			const newinseamSelection = resultForTest.variants?.selections.find((selection) => selection.field == 'inseam');

			expect(newinseamSelection).toBeDefined();
			expect(newcolorSelection).toBeDefined();

			const newcolorSettings = newVariantsConfig.options && newVariantsConfig.options[newcolorSelection?.field!]?.preSelected;
			const newinseamSettings = newVariantsConfig.options && newVariantsConfig.options[newinseamSelection?.field!]?.preSelected;

			expect(newcolorSettings).toContain(newcolorSelection?.selected?.value?.toLocaleLowerCase());
			expect(newinseamSettings).toContain(newinseamSelection?.selected?.value?.toLocaleLowerCase());
		});

		it('grabs selections from dom on load when using realtime', () => {
			const field = 'color';
			const value = 'Mirage';

			//add pdp variant option elems to the dom
			let colorOptionElem = document.createElement('div');
			colorOptionElem.setAttribute('ss-variant-option', `${field}:${value}`);
			colorOptionElem.setAttribute('ss-variant-option-selected', 'true');
			document.body.appendChild(colorOptionElem);

			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						realtime: {
							enabled: true,
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const resultForTest = results[0] as Product;
			expect(resultForTest).toBeDefined();

			const selection = resultForTest.variants?.selections.find((selection) => selection.field == field);
			expect(selection).toBeDefined();
			expect(selection?.selected?.value).toBe(value);

			document.body.removeChild(colorOptionElem);
		});

		it('updates selections from dom elem onclicks realtime', () => {
			const field = 'color';
			const value = 'Mirage';

			//add pdp variant option elems to the dom
			let colorOptionElem = document.createElement('div');
			colorOptionElem.setAttribute('ss-variant-option', `${field}:${value}`);
			document.body.appendChild(colorOptionElem);

			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						realtime: {
							enabled: true,
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const resultForTest = results[0] as Product;
			expect(resultForTest).toBeDefined();

			let selection = resultForTest.variants?.selections.find((selection) => selection.field == field);

			expect(selection).toBeDefined();
			expect(selection?.selected?.value).not.toBe(value);

			colorOptionElem.click();

			selection = resultForTest.variants?.selections.find((selection) => selection.field == field);

			expect(selection).toBeDefined();
			expect(selection?.selected?.value).toBe(value);

			document.body.removeChild(colorOptionElem);
		});

		it('can use filter first when grabbing selections from dom on load', () => {
			const field = 'color';
			const value = 'Mirage';

			//add pdp variant option elems to the dom
			let colorOptionElem = document.createElement('div');
			colorOptionElem.setAttribute('ss-variant-option', `${field}:${value}`);
			colorOptionElem.setAttribute('ss-variant-option-selected', 'true');
			document.body.appendChild(colorOptionElem);

			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						realtime: {
							enabled: true,
							filters: ['first'],
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const resultForTest = results[0] as Product;
			expect(resultForTest).toBeDefined();

			let selection = resultForTest.variants?.selections.find((selection) => selection.field == field);

			expect(selection?.selected?.value).toBe(value);

			const secondResultForTest = results[1] as Product;
			expect(secondResultForTest).toBeDefined();

			selection = secondResultForTest.variants?.selections.find((selection) => selection.field == field);
			expect(selection?.values.some((val) => val.value == value)).toBeTruthy();

			expect(selection?.selected?.value).not.toBe(value);

			document.body.removeChild(colorOptionElem);
		});

		it('can use filter first while updating selections from dom elem onclicks realtime', () => {
			const field = 'color';
			const value = 'Mirage';

			//add pdp variant option elems to the dom
			let colorOptionElem = document.createElement('div');
			colorOptionElem.setAttribute('ss-variant-option', `${field}:${value}`);
			document.body.appendChild(colorOptionElem);

			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						realtime: {
							enabled: true,
							filters: ['first'],
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const resultForTest = results[0] as Product;
			expect(resultForTest).toBeDefined();

			const secondResultForTest = results[1] as Product;
			expect(secondResultForTest).toBeDefined();

			let selection = resultForTest.variants?.selections.find((selection) => selection.field == field);
			const selection2 = secondResultForTest.variants?.selections.find((selection) => selection.field == field);

			expect(selection?.selected?.value).not.toBe(value);

			colorOptionElem.click();

			expect(selection?.selected?.value).toBe(value);

			expect(selection2?.values.some((val) => val.value == value)).toBeTruthy();
			expect(selection2?.selected?.value).not.toBe(value);

			document.body.removeChild(colorOptionElem);
		});

		it('can use filter unaltered while updating selections from dom elem onclicks realtime', () => {
			const field = 'color';
			const value = 'Mirage';

			//add pdp variant option elems to the dom
			let colorOptionElem = document.createElement('div');
			colorOptionElem.setAttribute('ss-variant-option', `${field}:${value}`);
			document.body.appendChild(colorOptionElem);

			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						realtime: {
							enabled: true,
							filters: ['unaltered'],
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const resultForTest = results[0] as Product;
			expect(resultForTest).toBeDefined();

			const secondResultForTest = results[1] as Product;
			expect(secondResultForTest).toBeDefined();

			let selection = resultForTest.variants?.selections.find((selection) => selection.field == field);
			const selection2 = secondResultForTest.variants?.selections.find((selection) => selection.field == field);

			expect(selection?.selected?.value).not.toBe(value);
			expect(selection2?.selected?.value).not.toBe(value);

			selection?.select('Desert');

			colorOptionElem.click();

			expect(selection?.selected?.value).toBe('Desert');

			expect(selection2?.values.some((val) => val.value == value)).toBeTruthy();
			expect(selection2?.selected?.value).toBe(value);

			document.body.removeChild(colorOptionElem);
		});

		it('can use the "thumbnailBackgroundImages" option to set the backgroundImageUrl for each variant to the variant thumbnailImageUrl', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						options: {
							color: {
								thumbnailBackgroundImages: true,
							},
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});
			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const resultForTest = results[0] as Product;
			expect(resultForTest).toBeDefined();

			const selection = resultForTest.variants?.selections.find((selection) => selection.field == 'color');
			expect(selection).toBeDefined();

			selection?.values.forEach((value) => {
				console.log(value);
				expect(value.backgroundImageUrl).toEqual(value.thumbnailImageUrl);
			});
		});

		it('can use variantMappings', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig: StoreConfigs = {
				...searchConfig,
				settings: {
					variants: {
						field: 'ss_variants',
						options: {
							color: {
								label: 'myColor',
								thumbnailBackgroundImages: true,
								mappings: {
									['mirage']: {
										label: 'notMirage',
										background: 'mirage',
										backgroundImageUrl: 'mirage',
									},
								},
							},
						},
					},
				},
			};

			const results = new SearchResultStore({
				config: variantSearchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});
			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const resultForTest = results[0] as Product;
			expect(resultForTest).toBeDefined();

			const selection = resultForTest.variants?.selections.find((selection) => selection.field == 'color');
			expect(selection).toBeDefined();

			const settings = variantSearchConfig.settings?.variants?.options && variantSearchConfig.settings?.variants?.options[selection?.field!];
			expect(selection?.label).toEqual(settings?.label);
			const selectionValueWithMappings = selection?.values.find((val) => val.value.toLowerCase() == 'mirage')!;

			const mappedLabel = settings?.mappings && settings.mappings[selectionValueWithMappings?.value.toLowerCase()]?.label;
			const mappedBackground = settings?.mappings && settings.mappings[selectionValueWithMappings?.value.toLowerCase()]?.background;
			const mappedBackgroundImageUrl = settings?.mappings && settings.mappings[selectionValueWithMappings?.value.toLowerCase()]?.backgroundImageUrl;

			expect(selectionValueWithMappings?.label).toEqual(mappedLabel);
			expect(selectionValueWithMappings?.background).toEqual(mappedBackground);
			expect(selectionValueWithMappings?.backgroundImageUrl).toEqual(mappedBackgroundImageUrl);
		});

		describe('variant class', () => {
			it('has specific properties', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.search.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];

				parsedVariantData.forEach((variantData) => {
					const variant = new Variant({ data: { variant: variantData } });

					expect(variant).toHaveProperty('attributes');
					expect(variant).toHaveProperty('available');
					expect(variant).toHaveProperty('custom');
					expect(variant).toHaveProperty('mappings');
					expect(variant).toHaveProperty('options');
					expect(variant).toHaveProperty('type');

					expect(variant.attributes).toStrictEqual(variantData.attributes);
					expect(variant.available).toStrictEqual(variantData.attributes.available);
					expect(variant.custom).toStrictEqual({});
					expect(variant.mappings).toStrictEqual(variantData.mappings);
					expect(variant.options).toStrictEqual(variantData.options);
					expect(variant.type).toBe('variant');
				});
			});
		});

		describe('variants class', () => {
			it('requires variants data and a mask to construct', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.search.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants({
					data: {
						mask,
						variants: parsedVariantData,
					},
				});

				expect(variants).toHaveProperty('active');
				expect(variants).toHaveProperty('data');
				expect(variants).toHaveProperty('selections');
				expect(variants).toHaveProperty('setActive');
				expect(variants).toHaveProperty('makeSelections');
				expect(variants).toHaveProperty('update');

				const filteredParsedVariantsData = parsedVariantData.filter((variant: any) => variant.attributes.available !== false);

				// only uses "available" variants
				expect(variants?.active).toBe(variants?.data.find((variant) => variant.available));
				expect(variants?.data.length).toStrictEqual(filteredParsedVariantsData.length);
				expect(variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

				// creates a variant for each available data entry
				variants.data.forEach((variant, index) => {
					expect(variant).toStrictEqual(new Variant({ data: { variant: filteredParsedVariantsData[index] } }));
				});
			});

			it('can set an active variant with `setActive`', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.search.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants({
					data: {
						mask,
						variants: parsedVariantData,
					},
				});

				// starts with "available" variant
				expect(variants.active).toBe(variants?.data.find((variant) => variant.available));

				const newActive = variants.data[7];
				variants.setActive(newActive);

				expect(variants.active).toBe(newActive);
			});

			it('can set an active variant with `setActive`', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.search.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants({
					data: {
						mask,
						variants: parsedVariantData,
					},
				});

				// starts with "available" variant
				expect(variants.active).toBe(variants?.data.find((variant) => variant.available));

				const newActive = variants.data[7];
				variants.setActive(newActive);

				expect(variants.active).toBe(newActive);
			});

			it('can set an active variant with `setActive`', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.search.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants({
					data: {
						mask,
						variants: parsedVariantData,
					},
				});

				// starts with "available" variant
				expect(variants.active).toBe(variants?.data.find((variant) => variant.available));

				const newActive = variants.data[7];
				variants.setActive(newActive);

				expect(variants.active).toBe(newActive);
			});

			it('has selections that it builds and selects from options', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.search.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants({
					data: {
						mask,
						variants: parsedVariantData,
					},
				});

				variants.selections.forEach((selection, index) => {
					const dataOptionName = Object.keys(parsedVariantData[0].options)[index];
					const firstAvailableOption = selection.values.find((value) => value.available);

					expect(selection).toHaveProperty('field');
					expect(selection).toHaveProperty('label');
					expect(selection).toHaveProperty('previouslySelected');
					expect(selection).toHaveProperty('selected');
					expect(selection).toHaveProperty('values');
					expect(selection).toHaveProperty('refineValues');
					expect(selection).toHaveProperty('reset');
					expect(selection).toHaveProperty('select');

					expect(selection.field).toBe(dataOptionName);
					expect(selection.label).toBe(dataOptionName);
					expect(selection.selected?.value).toBe(firstAvailableOption?.value);
					expect(selection.previouslySelected).toBe(undefined);
				});
			});

			it('will adjust selections based on availability', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.search.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants({
					data: {
						mask,
						variants: parsedVariantData,
					},
				});

				const initialSelectedSelections = variants.selections.map((selection) => selection.selected?.value);
				expect(initialSelectedSelections).toStrictEqual(['Scout', '30', '32']);

				variants.selections[0].select('Desert');
				const newSelectedSelections = variants.selections.map((selection) => selection.selected?.value);
				expect(newSelectedSelections).toStrictEqual(['Desert', '30', '34']);
			});

			it('will use previous selections based on availability', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.search.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants({
					data: {
						mask,
						variants: parsedVariantData,
					},
				});
				const colorSelector = variants.selections[0];
				const sizeSelector = variants.selections[1];

				const initialSelectedSelections = variants.selections.map((selection) => selection.selected?.value);
				expect(initialSelectedSelections).toStrictEqual(['Scout', '30', '32']);

				colorSelector.select('Desert');
				const newSelectedSelections = variants.selections.map((selection) => selection.selected?.value);
				expect(newSelectedSelections).toStrictEqual(['Desert', '30', '34']);

				colorSelector.select('Mirage');
				const newerSelectedSelections = variants.selections.map((selection) => selection.selected?.value);
				expect(newerSelectedSelections).toStrictEqual(['Mirage', '36', '34']);

				sizeSelector.select('30');
				const previouslySelectedSelections = variants.selections.map((selection) => selection.selected?.value);
				expect(previouslySelectedSelections).toStrictEqual(['Desert', '30', '34']);
			});
		});
	});

	describe('with inline banners', () => {
		it('splices inline banners into the results array', () => {
			const searchData = mockData.updateConfig({ siteId: '8uyt2m' }).searchMeta('inlineBanners');

			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: {},
				},
			});

			expect(results.length).toBe(searchData.search.pagination?.pageSize);
			expect((results[1] as Banner).value).toBe(
				searchData.search.merchandising?.content?.inline && searchData.search.merchandising.content.inline[0].value
			);
		});

		it('splices inline banners into the results array', () => {
			const searchData = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page1');

			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: {},
				},
			});

			expect(results.length).toBe(searchData.search.pagination?.pageSize);
			const inlineData = searchData.search.merchandising?.content?.inline!;
			expect(results[2].id).toBe(`ss-ib-${inlineData[0].config?.position?.index}`);
			expect((results[2] as Banner).value).toBe(inlineData[0].value);
			expect(results[3].id).toBe(`ss-ib-${inlineData[1].config?.position?.index}`);
			expect((results[3] as Banner).value).toBe(inlineData[1].value);
		});

		it('splices inline banners into the results array', () => {
			const searchData = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page2');

			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: {},
				},
			});

			expect(results.length).toBe(1);
			const inlineData = searchData.search.merchandising?.content?.inline!;
			expect(results[0].id).toBe(`ss-ib-${inlineData[2].config?.position?.index}`);
			expect((results[0] as Banner).value).toBe(inlineData[2].value);
		});

		it('correctly splices four inline banners into the results array with low numbers of results', () => {
			const searchData = mockData.updateConfig({ siteId: '8uyt2m' }).searchMeta('inlineBanners-x4');

			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: {},
				},
			});

			expect(results.length).toBe(11);
			const inlineData = searchData.search.merchandising?.content?.inline!;
			expect(results[0].id).toBe(`ss-ib-${inlineData[0].config?.position?.index}`);
			expect((results[0] as Banner).value).toBe(inlineData[0].value);

			expect(results[4].id).toBe(`ss-ib-${inlineData[1].config?.position?.index}`);
			expect((results[4] as Banner).value).toBe(inlineData[1].value);

			expect(results[7].id).toBe(`ss-ib-${inlineData[2].config?.position?.index}`);
			expect((results[7] as Banner).value).toBe(inlineData[2].value);

			expect(results[8].id).toBe(`ss-ib-${inlineData[3].config?.position?.index}`);
			expect((results[8] as Banner).value).toBe(inlineData[3].value);
		});

		it('splices inline banners that are beyond the response index to the end of the results array', () => {
			const searchData = {
				results: [],
				pagination: {
					page: 4,
					totalResults: 4,
					pageSize: 30,
				},
				merchandising: {
					content: {
						inline: [
							{
								value: 'engine',
								config: {
									position: {
										index: 0,
									},
								},
							},
							{
								value: 'car',
								config: {
									position: {
										index: 1,
									},
								},
							},
							{
								value: 'caboose!!!',
								config: {
									position: {
										index: 33333,
									},
								},
							},
						],
					},
				},
			};
			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData,
					meta: {},
				},
			});

			expect(results.length).toBe(1);
			expect(results[0].id).toBe(`ss-ib-${searchData.merchandising.content.inline[2].config.position.index}`);
			expect((results[0] as Banner).value).toBe(searchData.merchandising.content.inline[2].value);
		});
	});
	describe('with badges', () => {
		it('has overlay result badges', () => {
			const searchData = mockData.updateConfig({ siteId: '8uyt2m' }).searchMeta();
			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const indexOfOverlayBadge = 0;
			const result = results[indexOfOverlayBadge] as Product;
			expect(result.badges?.all).toBeDefined();

			const resultBadges = searchData.search.results![indexOfOverlayBadge].badges!;
			expect(resultBadges).toBeDefined();
			expect(result.badges.all.length).toStrictEqual(resultBadges?.length);

			expect(result.badges.all[0]).toHaveProperty('tag');
			expect(result.badges.all[0]).toHaveProperty('location');
			expect(result.badges.all[0]).toHaveProperty('component');
			expect(result.badges.all[0]).toHaveProperty('priority');
			expect(result.badges.all[0]).toHaveProperty('enabled');
			expect(result.badges.all[0]).toHaveProperty('parameters');

			const badgeMeta = searchData.meta?.badges?.tags?.[resultBadges[0].tag]!;
			expect(badgeMeta).toBeDefined();

			expect(result.badges.all[0]).toStrictEqual({
				tag: resultBadges[0].tag,
				value: resultBadges[0].value,
				location: badgeMeta.location,
				component: badgeMeta.component,
				priority: badgeMeta.priority,
				enabled: badgeMeta.enabled,
				parameters: badgeMeta.parameters,
			});

			expect(result.badges.atLocation(['left', 'right'])).toStrictEqual([result.badges.all[0]]);
		});

		it('has callout result badges', () => {
			const searchData = mockData.updateConfig({ siteId: '8uyt2m' }).searchMeta();
			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			expect(results.length).toBe(searchData.search.pagination?.pageSize);

			const indexOfOverlayBadge = 2;
			const result = results[indexOfOverlayBadge] as Product;
			expect(result.badges?.all).toBeDefined();

			const resultBadges = searchData.search.results![indexOfOverlayBadge].badges!;
			expect(resultBadges).toBeDefined();
			expect(result.badges.all.length).toStrictEqual(resultBadges?.length);

			expect(result.badges.all[0]).toHaveProperty('tag');
			expect(result.badges.all[0]).toHaveProperty('location');
			expect(result.badges.all[0]).toHaveProperty('component');
			expect(result.badges.all[0]).toHaveProperty('priority');
			expect(result.badges.all[0]).toHaveProperty('enabled');
			expect(result.badges.all[0]).toHaveProperty('parameters');

			const badgeMeta = searchData.meta?.badges?.tags?.[resultBadges[0].tag]!;
			expect(badgeMeta).toBeDefined();

			expect(result.badges.all[0]).toStrictEqual({
				tag: resultBadges[0].tag,
				value: resultBadges[0].value,
				location: badgeMeta.location,
				component: badgeMeta.component,
				priority: badgeMeta.priority,
				enabled: badgeMeta.enabled,
				parameters: badgeMeta.parameters,
			});

			expect(result.badges.locations.callout).toStrictEqual({
				[badgeMeta.location.split('/')[1]]: [result.badges.all[0]],
			});
		});

		it('has sorted badges based on priority', () => {
			const searchData = mockData.updateConfig({ siteId: '8uyt2m' }).searchMeta();
			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			const indexOfOverlayBadge = 1;
			const result = results[indexOfOverlayBadge] as Product;
			expect(result.badges?.all).toBeDefined();

			const resultBadges = searchData.search.results![indexOfOverlayBadge].badges!;
			expect(resultBadges).toBeDefined();
			expect(result.badges.all.length).toStrictEqual(resultBadges?.length);

			const badgeMeta = searchData.meta?.badges?.tags!;
			expect(badgeMeta).toBeDefined();

			// raw result badges should have two badges, first one with priority 2, second one with priority 1
			expect(badgeMeta[resultBadges[0].tag].priority).toBeGreaterThan(badgeMeta[resultBadges[1].tag].priority);

			// result badges should be sorted by priority in the store
			expect(result.badges.all[0].priority).toBeLessThan(result.badges.all[1].priority);

			// mock data should have two overlay badges with the same same location
			expect(result.badges.all[0].location).toBe(result.badges.all[1].location);
			expect(result.badges.all[0].priority).not.toBe(result.badges.all[1].priority);

			// result.overlay should only return 1 badge per location based on priority
			expect(result.badges.atLocation(['left', 'right'])).toStrictEqual(result.badges.all);
		});

		it('has helper method atLocation and tags getter', () => {
			const searchData = mockData.updateConfig({ siteId: '8uyt2m' }).searchMeta();
			const results = new SearchResultStore({
				config: searchConfig,
				state: {
					loaded: false,
				},
				data: {
					search: searchData.search,
					meta: searchData.meta,
				},
			});

			const result = results[0] as Product;
			expect(result.badges.all.length).toBe(1);

			const badge = result.badges.all[0];
			expect(result.badges.atLocation(badge.location)).toStrictEqual(result.badges.all);
			expect(result.badges.tags).toStrictEqual({
				[badge.tag]: badge,
			});
		});
	});
});
