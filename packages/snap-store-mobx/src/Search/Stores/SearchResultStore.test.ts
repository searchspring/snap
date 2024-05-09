import deepmerge from 'deepmerge';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelResultCoreMappings } from '@searchspring/snapi-types';

import { Banner, Product, SearchResultStore, ProductMask, Variants, Variant, VariantSelection, VariantData } from './SearchResultStore';
import { parse } from 'uuid';

const services = {
	urlManager: new UrlManager(new UrlTranslator()),
};

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
		// @ts-ignore
		const results = new SearchResultStore(undefined, undefined, undefined, undefined, undefined, undefined);

		expect(results.length).toBe(0);
	});

	it('returns an empty array when passed an empty array [] of results', () => {
		const results = new SearchResultStore(searchConfig, services, {}, [], undefined, undefined);

		expect(results.length).toBe(0);
	});

	it('returns an array the same length as the results passed in', () => {
		const searchData = mockData.searchMeta();

		const results = new SearchResultStore(searchConfig, services, {}, searchData.results, searchData.pagination, searchData.merchandising);

		expect(results.length).toBe(searchData.results?.length);
	});

	it('has result data that matches what was passed in', () => {
		const searchData = mockData.searchMeta();

		const results = new SearchResultStore(searchConfig, services, {}, searchData.results, searchData.pagination, searchData.merchandising);

		results.forEach((result, index) => {
			// check id
			expect(result.id).toBe(searchData.results && searchData.results[index].id);

			// check core mappings
			Object.keys(result.mappings.core!).forEach((key) => {
				const core = searchData.results && searchData.results[index]?.mappings?.core;
				const value = core && core[key as keyof SearchResponseModelResultCoreMappings];
				expect(result.mappings?.core && result.mappings?.core[key as keyof SearchResponseModelResultCoreMappings]).toBe(value);
			});

			// check attributes
			Object.keys(result.attributes).forEach((key) => {
				const attributes = searchData.results && searchData.results[index] && searchData.results[index].attributes;
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

			const results = new SearchResultStore(
				searchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);

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

			const results = new SearchResultStore(
				searchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);
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

			const results = new SearchResultStore(
				variantSearchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);
			expect(results.length).toBe(searchData.pagination?.pageSize);

			results.forEach((result, index) => {
				const productData = searchData.results && searchData.results[index];
				const variantData = productData?.attributes?.ss_variants;
				expect(variantData).toBeDefined();
				const parsedVariantData = JSON.parse(variantData as unknown as string);

				const variants = (result as Product).variants;

				expect(variants?.data.length).toStrictEqual(parsedVariantData.length);
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

			const results = new SearchResultStore(
				variantSearchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);
			expect(results.length).toBe(searchData.pagination?.pageSize);

			const variantDataToUse = results[2].attributes.ss_variants;
			const parsedVariantDataToUse = JSON.parse(variantDataToUse as unknown as string);

			results.forEach((result, index) => {
				const productData = searchData.results && searchData.results[index];
				const variantData = productData?.attributes?.ss_variants;

				expect(variantData).toBeDefined();
				const parsedVariantData = JSON.parse(variantData as unknown as string);

				const variants = (result as Product).variants;

				expect(variants).toBeDefined();

				expect((result as Product).variants?.data.length).toStrictEqual(parsedVariantData.length);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

				(result as Product).variants?.update(parsedVariantDataToUse);

				expect((result as Product).variants).toBeDefined();

				expect((result as Product).variants?.data.length).toStrictEqual(parsedVariantDataToUse.length);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantDataToUse[0].options).length);
			});
		});

		it('can configured to preselect certain variants', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig = {
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

			const results = new SearchResultStore(
				variantSearchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);
			expect(results.length).toBe(searchData.pagination?.pageSize);

			results.forEach((result, index) => {
				const productData = searchData.results && searchData.results[index];
				const variantData = productData?.attributes?.ss_variants;
				expect(variantData).toBeDefined();
				const parsedVariantData = JSON.parse(variantData as unknown as string);

				const variants = (result as Product).variants;

				expect(variants?.data.length).toStrictEqual(parsedVariantData.length);
				expect(variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

				variants?.selections.forEach((selection) => {
					const field = selection.field;
					const settings =
						variantSearchConfig.settings.variants.options[field as keyof typeof variantSearchConfig.settings.variants.options]?.preSelected;
					if (settings) {
						if (selection.values.filter((val) => settings.indexOf(val.value) > -1).length) {
							expect(settings).toContain(selection.selected?.toLowerCase());
						}
					}
				});
			});
		});

		it('uses the original constructed config when calling variants.update', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig = {
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

			const results = new SearchResultStore(
				variantSearchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);
			expect(results.length).toBe(searchData.pagination?.pageSize);

			const variantDataToUse = results[0].attributes.ss_variants;
			const parsedVariantDataToUse = JSON.parse(variantDataToUse as unknown as string);

			results.forEach((result, index) => {
				const productData = searchData.results && searchData.results[index];
				const variantData = productData?.attributes?.ss_variants;

				expect(variantData).toBeDefined();
				const parsedVariantData = JSON.parse(variantData as unknown as string);

				const variants = (result as Product).variants;

				expect(variants).toBeDefined();

				expect((result as Product).variants?.data.length).toStrictEqual(parsedVariantData.length);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

				(result as Product).variants?.update(parsedVariantDataToUse);

				expect((result as Product).variants).toBeDefined();

				expect((result as Product).variants?.data.length).toStrictEqual(parsedVariantDataToUse.length);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantDataToUse[0].options).length);

				variants?.selections.forEach((selection) => {
					const field = selection.field;
					const settings =
						variantSearchConfig.settings.variants.options[field as keyof typeof variantSearchConfig.settings.variants.options]?.preSelected;
					if (settings) {
						if (selection.values.filter((val) => settings.indexOf(val.value) > -1).length) {
							expect(settings).toContain(selection.selected?.toLowerCase());
						}
					}
				});
			});
		});

		it('can use a different config when calling variants.update', () => {
			const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');

			const variantSearchConfig = {
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

			const results = new SearchResultStore(
				variantSearchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);
			expect(results.length).toBe(searchData.pagination?.pageSize);

			const variantDataToUse = results[0].attributes.ss_variants;
			const parsedVariantDataToUse = JSON.parse(variantDataToUse as unknown as string);

			results.forEach((result, index) => {
				const productData = searchData.results && searchData.results[index];
				const variantData = productData?.attributes?.ss_variants;

				expect(variantData).toBeDefined();
				const parsedVariantData = JSON.parse(variantData as unknown as string);

				const variants = (result as Product).variants;

				expect(variants).toBeDefined();

				expect((result as Product).variants?.data.length).toStrictEqual(parsedVariantData.length);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

				(result as Product).variants?.update(parsedVariantDataToUse);

				expect((result as Product).variants).toBeDefined();
				expect((result as Product).variants?.data.length).toStrictEqual(parsedVariantDataToUse.length);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantDataToUse[0].options).length);

				variants?.selections.forEach((selection) => {
					const field = selection.field;
					const settings =
						variantSearchConfig.settings.variants.options[field as keyof typeof variantSearchConfig.settings.variants.options]?.preSelected;
					if (settings) {
						if (selection.values.filter((val) => settings.indexOf(val.value) > -1).length) {
							expect(settings).toContain(selection.selected?.toLowerCase());
						}
					}
				});
			});

			const newVariantsConfig = {
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

			results.forEach((result, index) => {
				const productData = searchData.results && searchData.results[index];
				const variantData = productData?.attributes?.ss_variants;

				expect(variantData).toBeDefined();
				const parsedVariantData = JSON.parse(variantData as unknown as string);

				const variants = (result as Product).variants;

				expect(variants).toBeDefined();

				expect((result as Product).variants?.data.length).toStrictEqual(parsedVariantDataToUse.length);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantDataToUse[0].options).length);

				(result as Product).variants?.update(parsedVariantData, newVariantsConfig);

				expect((result as Product).variants).toBeDefined();

				expect((result as Product).variants?.data.length).toStrictEqual(parsedVariantData.length);
				expect((result as Product).variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

				variants?.selections.forEach((selection) => {
					const field = selection.field;
					const settings = newVariantsConfig.options[field as keyof typeof newVariantsConfig.options]?.preSelected;
					if (settings) {
						if (selection.values.filter((val) => val.available && settings.indexOf(val.value) > -1).length) {
							expect(settings).toContain(selection.selected?.toLowerCase());
						}
					}
				});
			});
		});

		describe('variant class', () => {
			it('has specific properties', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];

				parsedVariantData.forEach((variantData) => {
					const variant = new Variant(variantData);

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
				const variantData = searchData.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants(parsedVariantData, mask);

				expect(variants).toHaveProperty('active');
				expect(variants).toHaveProperty('data');
				expect(variants).toHaveProperty('selections');
				expect(variants).toHaveProperty('setActive');
				expect(variants).toHaveProperty('makeSelections');
				expect(variants).toHaveProperty('update');

				// only uses "available" variants
				expect(variants?.active).toBe(variants?.data.find((variant) => variant.available));
				expect(variants?.data.length).toStrictEqual(parsedVariantData.length);
				expect(variants?.selections.length).toBe(Object.keys(parsedVariantData[0].options).length);

				// creates a variant for each data entry
				variants.data.forEach((variant, index) => {
					expect(variant).toStrictEqual(new Variant(parsedVariantData[index]));
				});
			});

			it('can set an active variant with `setActive`', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants(parsedVariantData, mask);

				// starts with "available" variant
				expect(variants.active).toBe(variants?.data.find((variant) => variant.available));

				const newActive = variants.data[7];
				variants.setActive(newActive);

				expect(variants.active).toBe(newActive);
			});

			it('can set an active variant with `setActive`', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants(parsedVariantData, mask);

				// starts with "available" variant
				expect(variants.active).toBe(variants?.data.find((variant) => variant.available));

				const newActive = variants.data[7];
				variants.setActive(newActive);

				expect(variants.active).toBe(newActive);
			});

			it('can set an active variant with `setActive`', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants(parsedVariantData, mask);

				// starts with "available" variant
				expect(variants.active).toBe(variants?.data.find((variant) => variant.available));

				const newActive = variants.data[7];
				variants.setActive(newActive);

				expect(variants.active).toBe(newActive);
			});

			it('has selections that it builds and selects from options', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants(parsedVariantData, mask);

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
					expect(selection.selected).toBe(firstAvailableOption?.value);
					expect(selection.previouslySelected).toBe('');
				});
			});

			it('will adjust selections based on availability', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants(parsedVariantData, mask);

				const initialSelectedSelections = variants.selections.map((selection) => selection.selected);
				expect(initialSelectedSelections).toStrictEqual(['Scout', '30', '32']);

				variants.selections[0].select('Desert');
				const newSelectedSelections = variants.selections.map((selection) => selection.selected);
				expect(newSelectedSelections).toStrictEqual(['Desert', '30', '34']);
			});

			it('will use previous selections based on availability', () => {
				const mask = new ProductMask();
				const searchData = mockData.updateConfig({ siteId: 'z7h1jh' }).searchMeta('variants');
				const variantData = searchData.results![0].attributes?.ss_variants as unknown as string;
				const parsedVariantData = JSON.parse(variantData) as VariantData[];
				const variants = new Variants(parsedVariantData, mask);
				const colorSelector = variants.selections[0];
				const sizeSelector = variants.selections[1];

				const initialSelectedSelections = variants.selections.map((selection) => selection.selected);
				expect(initialSelectedSelections).toStrictEqual(['Scout', '30', '32']);

				colorSelector.select('Desert');
				const newSelectedSelections = variants.selections.map((selection) => selection.selected);
				expect(newSelectedSelections).toStrictEqual(['Desert', '30', '34']);

				colorSelector.select('Mirage');
				const newerSelectedSelections = variants.selections.map((selection) => selection.selected);
				expect(newerSelectedSelections).toStrictEqual(['Mirage', '36', '34']);

				sizeSelector.select('30');
				const previouslySelectedSelections = variants.selections.map((selection) => selection.selected);
				expect(previouslySelectedSelections).toStrictEqual(['Desert', '30', '34']);
			});
		});
	});

	describe('with inline banners', () => {
		it('splices inline banners into the results array', () => {
			const searchData = mockData.updateConfig({ siteId: '8uyt2m' }).searchMeta('inlineBanners');

			const results = new SearchResultStore(searchConfig, services, {}, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(searchData.pagination?.pageSize);
			expect((results[1] as Banner).value).toBe(searchData.merchandising?.content?.inline && searchData.merchandising.content.inline[0].value);
		});

		it('splices inline banners into the results array', () => {
			const searchData = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page1');

			const results = new SearchResultStore(searchConfig, services, {}, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(searchData.pagination?.pageSize);
			const inlineData = searchData.merchandising?.content?.inline!;
			expect(results[2].id).toBe(`ss-ib-${inlineData[0].config?.position?.index}`);
			expect((results[2] as Banner).value).toBe(inlineData[0].value);
			expect(results[3].id).toBe(`ss-ib-${inlineData[1].config?.position?.index}`);
			expect((results[3] as Banner).value).toBe(inlineData[1].value);
		});

		it('splices inline banners into the results array', () => {
			const searchData = mockData.updateConfig({ siteId: 'ga9kq2' }).searchMeta('merchandising_page2');

			const results = new SearchResultStore(searchConfig, services, {}, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(1);
			const inlineData = searchData.merchandising?.content?.inline!;
			expect(results[0].id).toBe(`ss-ib-${inlineData[2].config?.position?.index}`);
			expect((results[0] as Banner).value).toBe(inlineData[2].value);
		});

		it('correctly splices four inline banners into the results array with low numbers of results', () => {
			const searchData = mockData.updateConfig({ siteId: '8uyt2m' }).searchMeta('inlineBanners-x4');

			const results = new SearchResultStore(searchConfig, services, {}, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(11);
			const inlineData = searchData.merchandising?.content?.inline!;
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
			const results = new SearchResultStore(searchConfig, services, {}, searchData.results, searchData.pagination, searchData.merchandising);

			expect(results.length).toBe(1);
			expect(results[0].id).toBe(`ss-ib-${searchData.merchandising.content.inline[2].config.position.index}`);
			expect((results[0] as Banner).value).toBe(searchData.merchandising.content.inline[2].value);
		});
	});
	describe('with badges', () => {
		it('has overlay result badges', () => {
			const searchData = mockData.updateConfig({ siteId: '8uyt2m' }).searchMeta();
			const results = new SearchResultStore(
				searchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);

			expect(results.length).toBe(searchData.pagination?.pageSize);

			const indexOfOverlayBadge = 0;
			const result = results[indexOfOverlayBadge] as Product;
			expect(result.badges?.all).toBeDefined();

			const resultBadges = searchData.results![indexOfOverlayBadge].badges!;
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
			const results = new SearchResultStore(
				searchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);

			expect(results.length).toBe(searchData.pagination?.pageSize);

			const indexOfOverlayBadge = 2;
			const result = results[indexOfOverlayBadge] as Product;
			expect(result.badges?.all).toBeDefined();

			const resultBadges = searchData.results![indexOfOverlayBadge].badges!;
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
			const results = new SearchResultStore(
				searchConfig,
				services,
				searchData.meta,
				searchData.results,
				searchData.pagination,
				searchData.merchandising
			);

			const indexOfOverlayBadge = 1;
			const result = results[indexOfOverlayBadge] as Product;
			expect(result.badges?.all).toBeDefined();

			const resultBadges = searchData.results![indexOfOverlayBadge].badges!;
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
	});
});
