import { AutocompleteStoreConfigSettings, SearchStoreConfigSettings } from '@searchspring/snap-store-mobx';
import {
	SnapTemplate,
	mapBreakpoints,
	createSearchTargeters,
	createAutocompleteTargeters,
	createRecommendationComponentMapping,
	createSnapConfig,
	DEFAULT_FEATURES,
	DEFAULT_AUTOCOMPLETE_CONTROLLER_SETTINGS,
} from './SnapTemplate';
import { componentMap } from './components';
import { themeMap } from './themes';
import { RecommendationInstantiatorConfigSettings } from '../Instantiators/RecommendationInstantiator';

import type { RecommendationComponentObject } from '../Instantiators/RecommendationInstantiator';
import type { SnapTemplateConfig } from './SnapTemplate';

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

describe('Snap Preact Layouts', () => {
	describe('componentMap object', () => {
		it('has propreties representing each core product offering supported', () => {
			expect(componentMap).toHaveProperty('search');
			expect(componentMap).toHaveProperty('autocomplete');
			expect(componentMap).toHaveProperty('recommendation');
		});

		it('has a sub-mapping of available templates that can be used for each core product type', () => {
			expect(componentMap.search).toHaveProperty('Search');
			expect(componentMap.autocomplete).toHaveProperty('Autocomplete');
			expect(componentMap.recommendation).toHaveProperty('Recommendation');
		});

		it('returns a component from the promise within the sub-mapping for search', async () => {
			// this will need to be adjusted after adding more components
			expect(Object.keys(componentMap.search).length).toBe(1);
			expect(componentMap.search).toHaveProperty('Search');

			for (const componentName of Object.keys(componentMap.search)) {
				const componentImportFn = componentMap.search[componentName as keyof typeof componentMap.search];
				const component = await componentImportFn();
				expect(component).toBeDefined();
			}
		});

		it('returns a component from the promise within the sub-mapping for autocomplete', async () => {
			// this will need to be adjusted after adding more components
			expect(Object.keys(componentMap.autocomplete).length).toBe(1);
			expect(componentMap.autocomplete).toHaveProperty('Autocomplete');

			for (const componentName of Object.keys(componentMap.autocomplete)) {
				const componentImportFn = componentMap.autocomplete[componentName as keyof typeof componentMap.autocomplete];
				const component = await componentImportFn();
				expect(component).toBeDefined();
			}
		});

		it('returns a component from the promise within the sub-mapping for recommendation', async () => {
			// this will need to be adjusted after adding more components
			expect(Object.keys(componentMap.recommendation).length).toBe(1);
			expect(componentMap.recommendation).toHaveProperty('Recommendation');

			for (const componentName of Object.keys(componentMap.recommendation)) {
				const componentImportFn = componentMap.recommendation[componentName as keyof typeof componentMap.recommendation];
				const component = await componentImportFn();
				expect(component).toBeDefined();
			}
		});
	});

	describe('themeMap object', () => {
		it('has propreties representing each theme supported', () => {
			// this will need to be adjusted after adding themes
			expect(Object.keys(themeMap).length).toBe(1);
			expect(themeMap).toHaveProperty('pike');
		});

		it('returns a theme from the promise within the mapping', async () => {
			for (const themeName of Object.keys(themeMap)) {
				const themeImportFn = themeMap[themeName as keyof typeof themeMap];
				const theme = await themeImportFn();
				expect(theme).toBeDefined();
			}
		});
	});

	describe('mapBreakpoints function', () => {
		it('converts an array of breakpoint numbers and controller settings to an object keyed by the number', () => {
			const breakpoints = [480, 720, 1200];
			const bp0: SearchStoreConfigSettings = { redirects: { singleResult: false } };
			const bp1: SearchStoreConfigSettings = { redirects: { merchandising: false } };
			const bp2: SearchStoreConfigSettings = { infinite: { backfill: 10 } };
			const settings = [bp0, bp1, bp2];

			const mappedBps = mapBreakpoints(breakpoints, settings);

			const mappedBpsKeys = Object.keys(mappedBps);
			expect(mappedBpsKeys.length).toBe(breakpoints.length);
			mappedBpsKeys.forEach((key, index) => expect(key).toEqual(breakpoints[index].toString()));
		});

		it('creates the mapping properties based on the breakpoints array', () => {
			const breakpoints = [900];
			const bp0: AutocompleteStoreConfigSettings = { initializeFromUrl: false };
			const bp1: AutocompleteStoreConfigSettings = { syncInputs: true, initializeFromUrl: false };
			const bp2: AutocompleteStoreConfigSettings = { trending: { limit: 3 }, initializeFromUrl: false };
			const settings = [bp0, bp1, bp2];

			const mappedBps = mapBreakpoints(breakpoints, settings);

			const mappedBpsKeys = Object.keys(mappedBps);
			expect(mappedBpsKeys.length).toBe(breakpoints.length);
			mappedBpsKeys.forEach((key, index) => expect(key).toEqual(breakpoints[index].toString()));
			mappedBpsKeys.forEach((key, index) => expect(mappedBps[key]).toEqual(settings[index]));
		});

		it('sets breakpoint settings to empty object when settigns at array index are not provided', () => {
			const breakpoints = [480, 720, 1200, 1600];
			const bp0: RecommendationInstantiatorConfigSettings = { branch: 'production' };
			const bp1: RecommendationInstantiatorConfigSettings = { branch: 'production', realtime: false };
			const bp2: RecommendationInstantiatorConfigSettings = { branch: 'production', batched: false };

			// settings is missing a fourth entry
			const settings = [bp0, bp1, bp2];

			const mappedBps = mapBreakpoints(breakpoints, settings);

			const mappedBpsKeys = Object.keys(mappedBps);
			expect(mappedBpsKeys.length).toBe(breakpoints.length);
			mappedBpsKeys.forEach((key, index) => expect(key).toEqual(breakpoints[index].toString()));
			mappedBpsKeys.forEach((key, index) => {
				if (index < 3) {
					expect(mappedBps[key]).toEqual(settings[index]);
				} else {
					// fourth entry is missing so should be empty object
					expect(mappedBps[key]).toEqual({});
				}
			});
		});
	});

	describe('createSearchTargeters function', () => {
		it('creates extended domTarget objects from a Snap Template search configuration', async () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: { currency: 'usd', language: 'en', theme: { name: 'pike' } },
				search: {
					templates: [
						{
							selector: '#searchspring-layout',
							template: 'Search',
						},
					],
				},
			};

			const targeters = createSearchTargeters(snapTemplateConfig);

			expect(targeters.length).toBe(snapTemplateConfig.search?.templates.length);
			for (const [index, targeter] of targeters.entries()) {
				expect(targeter).toHaveProperty('selector');
				expect(targeter).toHaveProperty('component');
				expect(targeter).toHaveProperty('hideTarget');

				expect(targeter).toHaveProperty('theme');
				expect(targeter.theme).toHaveProperty('name');

				// component is a function that returns a component
				const targeterComponentFn = snapTemplateConfig.search?.templates[index].template;
				expect(targeterComponentFn).toBeDefined();
				if (targeterComponentFn) {
					expect(targeter.component).toBe(componentMap.search[targeterComponentFn]);
					const component = await targeterComponentFn;
					expect(component).toBeDefined();
				}

				expect(targeter.theme).toStrictEqual({
					import: themeMap[snapTemplateConfig.config.theme.name],
					...snapTemplateConfig.config.theme,
				});
			}
		});

		it('will use the resultLayout if provided', async () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: { currency: 'usd', language: 'en', theme: { name: 'pike' } },
				search: {
					templates: [
						{
							selector: '#searchspring-layout',
							template: 'Search',
							resultLayout: [],
						},
					],
				},
			};

			const targeters = createSearchTargeters(snapTemplateConfig);

			expect(targeters.length).toBe(snapTemplateConfig.search?.templates.length);
			for (const [index, targeter] of targeters.entries()) {
				expect(targeter.props?.resultLayout).toBe(snapTemplateConfig.search?.templates[index].resultLayout);
			}
		});

		it('will use the template theme over the global theme if provided', async () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: {
					currency: 'usd',
					language: 'en',
					theme: {
						name: 'pike',
						variables: {
							breakpoints: [400, 800, 1200, 1600],
						},
					},
				},
				search: {
					templates: [
						{
							selector: '#searchspring-layout',
							template: 'Search',
							theme: {
								name: 'pike',
								variables: {
									breakpoints: [240, 360, 540, 600],
								},
								overrides: {
									components: {
										facetGridOptions: {
											gapSize: '10px',
										},
									},
								},
							},
						},
					],
				},
			};

			const targeters = createSearchTargeters(snapTemplateConfig);

			expect(targeters.length).toBe(snapTemplateConfig.search?.templates.length);
			for (const [index, targeter] of targeters.entries()) {
				const theme = snapTemplateConfig.search?.templates[index].theme;
				expect(theme).toBeDefined();
				if (theme) {
					expect(targeter.theme).toStrictEqual({
						import: themeMap[theme.name],
						...theme,
					});
				}
			}
		});
	});

	describe('createAutocompleteTargeters function', () => {
		it('creates extended domTarget objects from a Snap Template autocomplete configuration', async () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: { currency: 'usd', language: 'en', theme: { name: 'pike' } },
				autocomplete: {
					inputSelector: 'input.searchspring-ac',
					templates: [
						{
							selector: '#searchspring-ac',
							template: 'Autocomplete',
						},
					],
				},
			};

			const targeters = createAutocompleteTargeters(snapTemplateConfig);

			expect(targeters.length).toBe(snapTemplateConfig.autocomplete?.templates.length);
			for (const [index, targeter] of targeters.entries()) {
				expect(targeter).toHaveProperty('selector');
				expect(targeter).toHaveProperty('theme');
				expect(targeter).toHaveProperty('component');
				expect(targeter).toHaveProperty('hideTarget');

				// component is a function that returns a component
				const targeterComponentFn = snapTemplateConfig.autocomplete?.templates[index].template;
				expect(targeterComponentFn).toBeDefined();
				if (targeterComponentFn) {
					expect(targeter.component).toBe(componentMap.autocomplete[targeterComponentFn]);
					const component = await targeterComponentFn;
					expect(component).toBeDefined();
				}
			}
		});

		it('will use the resultLayout if provided', async () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: { currency: 'usd', language: 'en', theme: { name: 'pike' } },
				autocomplete: {
					inputSelector: 'input.searchspring-ac',
					templates: [
						{
							selector: '#searchspring-ac',
							template: 'Autocomplete',
							resultLayout: [],
						},
					],
				},
			};

			const targeters = createAutocompleteTargeters(snapTemplateConfig);

			expect(targeters.length).toBe(snapTemplateConfig.autocomplete?.templates.length);
			for (const [index, targeter] of targeters.entries()) {
				expect(targeter.props?.resultLayout).toBe(snapTemplateConfig.autocomplete?.templates[index].resultLayout);
			}
		});

		it('will use the template theme over the global theme if provided', async () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: {
					currency: 'usd',
					language: 'en',
					theme: {
						name: 'pike',
						variables: {
							breakpoints: [400, 800, 1200, 1600],
						},
					},
				},
				autocomplete: {
					inputSelector: 'input.searchspring-ac',
					templates: [
						{
							selector: '#searchspring-ac',
							template: 'Autocomplete',
							theme: {
								name: 'pike',
								variables: {
									breakpoints: [240, 360, 540, 600],
								},
								overrides: {
									components: {
										autocomplete: {
											hideHistory: true,
										},
									},
								},
							},
						},
					],
				},
			};

			const targeters = createAutocompleteTargeters(snapTemplateConfig);

			expect(targeters.length).toBe(snapTemplateConfig.autocomplete?.templates.length);
			for (const [index, targeter] of targeters.entries()) {
				const theme = snapTemplateConfig.autocomplete?.templates[index].theme;
				expect(theme).toBeDefined();
				if (theme) {
					expect(targeter.theme).toStrictEqual({
						import: themeMap[theme.name],
						...theme,
					});
				}
			}
		});
	});

	describe('createRecommendationComponentMapping function', () => {
		it('creates a recommendation component mapping from a Snap Template recommendation configuration', async () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: { currency: 'usd', language: 'en', theme: { name: 'pike' } },
				recommendation: {
					settings: {
						branch: 'production',
					},
					templates: [
						{
							component: 'Recs',
							template: 'Recommendation',
						},
					],
				},
			};

			const recommendationComponentMapping = createRecommendationComponentMapping(snapTemplateConfig);
			for (const template of snapTemplateConfig.recommendation?.templates || []) {
				expect(recommendationComponentMapping).toHaveProperty(template.component);
				const mapping = recommendationComponentMapping[template.component];
				expect(mapping).toStrictEqual({
					component: componentMap.recommendation[template.template],
					theme: { name: snapTemplateConfig.config.theme.name, import: themeMap[snapTemplateConfig.config.theme.name] },
				});
			}
		});

		it('will use the resultLayout if provided', async () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: { currency: 'usd', language: 'en', theme: { name: 'pike' } },
				recommendation: {
					settings: {
						branch: 'production',
					},
					templates: [
						{
							component: 'Recs',
							template: 'Recommendation',
							resultLayout: [],
						},
					],
				},
			};

			const recommendationComponentMapping = createRecommendationComponentMapping(snapTemplateConfig);
			for (const [index, template] of (snapTemplateConfig.recommendation?.templates || []).entries()) {
				expect(recommendationComponentMapping).toHaveProperty(template.component);
				const mapping = recommendationComponentMapping[template.component];
				expect(mapping.props?.resultLayout).toBe(snapTemplateConfig.recommendation?.templates[index].resultLayout);
			}
		});

		it('will use the template theme over the global theme if provided', async () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: {
					currency: 'usd',
					language: 'en',
					theme: {
						name: 'pike',
						variables: {
							breakpoints: [400, 800, 1200, 1600],
						},
					},
				},
				recommendation: {
					settings: {
						branch: 'production',
					},
					templates: [
						{
							component: 'Recs',
							template: 'Recommendation',
							theme: {
								name: 'pike',
								variables: {
									breakpoints: [240, 360, 540, 600],
								},
								overrides: {
									components: {
										recommendation: {
											pagination: true,
										},
									},
								},
							},
						},
					],
				},
			};

			const recommendationComponentMapping = createRecommendationComponentMapping(snapTemplateConfig);
			for (const [index, template] of (snapTemplateConfig.recommendation?.templates || []).entries()) {
				const mapping = recommendationComponentMapping[template.component];
				const theme = snapTemplateConfig.recommendation?.templates[index].theme;
				expect(theme).toBeDefined();
				if (theme) {
					expect(mapping.theme).toStrictEqual({
						import: themeMap[theme.name],
						...theme,
					});
				}
			}
		});
	});

	describe('createSnapConfig function', () => {
		it('transforms a minimal SnapTemplate config into a minimal Snap config', () => {
			const snapTemplateConfig: SnapTemplateConfig = { config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } } };
			const snapConfig = createSnapConfig(snapTemplateConfig);

			expect(snapConfig).toStrictEqual({
				features: DEFAULT_FEATURES,
				client: { globals: { siteId: snapTemplateConfig.config.siteId } },
				instantiators: {},
				controllers: {},
			});
		});

		it('supports passing in custom set of features', () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } },
				features: {
					integratedSpellCorrection: { enabled: false },
				},
			};
			const snapConfig = createSnapConfig(snapTemplateConfig);

			expect(snapConfig.features).toStrictEqual(snapTemplateConfig.features);
		});

		it('supports passing in a custom URL configuration', () => {
			const snapTemplateConfig: SnapTemplateConfig = {
				config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } },
				url: {
					parameters: {
						core: {
							query: { name: 'q' },
						},
					},
				},
			};
			const snapConfig = createSnapConfig(snapTemplateConfig);

			expect(snapConfig.url).toStrictEqual(snapTemplateConfig.url);
		});

		describe('search controller', () => {
			it('will setup a minimal search controller with targeters', () => {
				const snapTemplateConfig: SnapTemplateConfig = {
					config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } },
					search: {
						templates: [
							{
								selector: '#searchspring-template',
								template: 'Search',
							},
						],
					},
				};
				const snapConfig = createSnapConfig(snapTemplateConfig);

				expect(snapConfig.controllers?.search).toStrictEqual([
					{
						config: {
							id: 'search',
							plugins: [],
							settings: {},
						},
						targeters: snapTemplateConfig.search?.templates.map((template) => ({
							component: componentMap.search[template.template],
							hideTarget: true,
							selector: template.selector,
							theme: {
								name: snapTemplateConfig.config.theme.name,
								import: themeMap[snapTemplateConfig.config.theme.name],
							},
						})),
					},
				]);
			});

			it('will setup a search controller with specific settings when one is provided', () => {
				const snapTemplateConfig: SnapTemplateConfig = {
					config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } },
					search: {
						templates: [
							{
								selector: '#searchspring-template',
								template: 'Search',
							},
						],
						settings: {
							facets: {
								trim: false,
							},
						},
					},
				};
				const snapConfig = createSnapConfig(snapTemplateConfig);

				expect(snapConfig.controllers?.search).toStrictEqual([
					{
						config: {
							id: 'search',
							plugins: [],
							settings: snapTemplateConfig.search?.settings,
						},
						targeters: snapTemplateConfig.search?.templates.map((template) => ({
							component: componentMap.search[template.template],
							hideTarget: true,
							selector: template.selector,
							theme: {
								name: snapTemplateConfig.config.theme.name,
								import: themeMap[snapTemplateConfig.config.theme.name],
							},
						})),
					},
				]);
			});

			it('will use initial browser width breakpoint settings when provided', () => {
				const snapTemplateConfig: SnapTemplateConfig = {
					config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike', variables: { breakpoints: [0, 540, 768, 1200] } } },
					search: {
						templates: [
							{
								selector: '#searchspring-template',
								template: 'Search',
							},
						],
						settings: {
							facets: {
								trim: false,
							},
							restorePosition: {
								enabled: false,
							},
						},
						breakpointSettings: [
							{
								facets: {
									trim: true,
									pinFiltered: true,
								},
							},
							{
								facets: {
									trim: true,
									pinFiltered: false,
								},
							},
							{
								facets: {
									trim: true,
									storeRange: false,
								},
							},
							{
								facets: {
									trim: true,
									autoOpenActive: false,
								},
							},
						],
					},
				};

				// loop through bps and set window.innerWidth to determine which breakpoint settings should be used
				snapTemplateConfig.config.theme.variables?.breakpoints.forEach((bp, index) => {
					window.innerWidth = bp + 1;
					const snapConfig = createSnapConfig(snapTemplateConfig);

					expect(snapTemplateConfig.search!.breakpointSettings![index]).toBeDefined;
					expect(snapConfig.controllers?.search).toStrictEqual([
						{
							config: {
								id: 'search',
								plugins: [],
								settings: { ...snapTemplateConfig.search!.settings, ...snapTemplateConfig.search!.breakpointSettings![index] },
							},
							targeters: snapTemplateConfig.search?.templates.map((template) => ({
								component: componentMap.search[template.template],
								hideTarget: true,
								selector: template.selector,
								theme: {
									name: snapTemplateConfig.config.theme.name,
									variables: snapTemplateConfig.config.theme.variables,
									import: themeMap[snapTemplateConfig.config.theme.name],
								},
							})),
						},
					]);
				});
			});
		});

		describe('autocomplete controller', () => {
			it('will setup a minimal autocomplete controller with targeters', () => {
				const snapTemplateConfig: SnapTemplateConfig = {
					config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } },
					autocomplete: {
						inputSelector: 'input.searchspring-ac',
						templates: [
							{
								selector: 'input.searchspring-ac',
								template: 'Autocomplete',
							},
						],
					},
				};
				const snapConfig = createSnapConfig(snapTemplateConfig);

				expect(snapConfig.controllers?.autocomplete).toStrictEqual([
					{
						config: {
							id: 'autocomplete',
							plugins: [],
							selector: snapTemplateConfig.autocomplete?.inputSelector,
							settings: DEFAULT_AUTOCOMPLETE_CONTROLLER_SETTINGS,
						},
						targeters: snapTemplateConfig.autocomplete?.templates.map((template) => ({
							component: componentMap.autocomplete[template.template],
							hideTarget: true,
							selector: template.selector,
							theme: {
								name: snapTemplateConfig.config.theme.name,
								import: themeMap[snapTemplateConfig.config.theme.name],
							},
						})),
					},
				]);
			});

			it('will setup a autocomplete controller with specific settings when one is provided', () => {
				const snapTemplateConfig: SnapTemplateConfig = {
					config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } },
					autocomplete: {
						inputSelector: 'input.searchspring-ac',
						templates: [
							{
								selector: 'input.searchspring-ac',
								template: 'Autocomplete',
							},
						],
						settings: {
							syncInputs: false,
						},
					},
				};
				const snapConfig = createSnapConfig(snapTemplateConfig);

				expect(snapConfig.controllers?.autocomplete).toStrictEqual([
					{
						config: {
							id: 'autocomplete',
							plugins: [],
							selector: snapTemplateConfig.autocomplete?.inputSelector,
							settings: { ...DEFAULT_AUTOCOMPLETE_CONTROLLER_SETTINGS, ...snapTemplateConfig.autocomplete?.settings },
						},
						targeters: snapTemplateConfig.autocomplete?.templates.map((template) => ({
							component: componentMap.autocomplete[template.template],
							hideTarget: true,
							selector: template.selector,
							theme: {
								name: snapTemplateConfig.config.theme.name,
								import: themeMap[snapTemplateConfig.config.theme.name],
							},
						})),
					},
				]);
			});

			it('will use initial browser width breakpoint settings when provided', () => {
				const snapTemplateConfig: SnapTemplateConfig = {
					config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike', variables: { breakpoints: [0, 540, 768, 1200] } } },
					autocomplete: {
						inputSelector: 'input.searchspring-ac',
						templates: [
							{
								selector: 'input.searchspring-ac',
								template: 'Autocomplete',
							},
						],
						settings: {
							facets: {
								trim: false,
							},
							syncInputs: false,
						},
						breakpointSettings: [
							{
								facets: {
									trim: true,
									pinFiltered: true,
								},
							},
							{
								facets: {
									trim: true,
									pinFiltered: false,
								},
							},
							{
								facets: {
									trim: true,
									storeRange: false,
								},
							},
							{
								facets: {
									trim: true,
									autoOpenActive: false,
								},
							},
						],
					},
				};

				// loop through bps and set window.innerWidth to determine which breakpoint settings should be used
				snapTemplateConfig.config.theme.variables?.breakpoints.forEach((bp, index) => {
					window.innerWidth = bp + 1;
					const snapConfig = createSnapConfig(snapTemplateConfig);

					expect(snapTemplateConfig.autocomplete!.breakpointSettings![index]).toBeDefined;
					expect(snapConfig.controllers?.autocomplete).toStrictEqual([
						{
							config: {
								id: 'autocomplete',
								plugins: [],
								selector: snapTemplateConfig.autocomplete?.inputSelector,
								settings: {
									...DEFAULT_AUTOCOMPLETE_CONTROLLER_SETTINGS,
									...snapTemplateConfig.autocomplete!.settings,
									...snapTemplateConfig.autocomplete!.breakpointSettings![index],
								},
							},
							targeters: snapTemplateConfig.autocomplete?.templates.map((template) => ({
								component: componentMap.autocomplete[template.template],
								hideTarget: true,
								selector: template.selector,
								theme: {
									name: snapTemplateConfig.config.theme.name,
									variables: snapTemplateConfig.config.theme.variables,
									import: themeMap[snapTemplateConfig.config.theme.name],
								},
							})),
						},
					]);
				});
			});
		});

		describe('recommendation instantiator', () => {
			it('will setup a minimal recommendation instantiator configuration with targeters', () => {
				const snapTemplateConfig: SnapTemplateConfig = {
					config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } },
					recommendation: {
						settings: {
							branch: 'production',
						},
						templates: [
							{
								component: 'Recs',
								template: 'Recommendation',
							},
						],
					},
				};
				const snapConfig = createSnapConfig(snapTemplateConfig);

				expect(snapConfig.instantiators?.recommendation).toStrictEqual({
					config: snapTemplateConfig.recommendation?.settings,
					components: snapTemplateConfig.recommendation?.templates.reduce((mapping, template) => {
						const themeName = template.theme?.name || snapTemplateConfig.config.theme.name;
						const themeImport = themeMap[themeName];

						mapping[template.component as keyof typeof mapping] = {
							component: componentMap.recommendation[template.template],
							theme: {
								name: themeName,
								import: themeImport,
							},
						};
						return mapping;
					}, {} as { [name: string]: RecommendationComponentObject }),
				});
			});

			it('will setup a recommendation instantiator configuration with specific settings when provided', () => {
				const snapTemplateConfig: SnapTemplateConfig = {
					config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } },
					recommendation: {
						settings: {
							branch: 'production',
							limit: 10,
							realtime: true,
							batched: false,
						},
						templates: [
							{
								component: 'Recs',
								template: 'Recommendation',
							},
						],
					},
				};
				const snapConfig = createSnapConfig(snapTemplateConfig);

				expect(snapConfig.instantiators?.recommendation).toStrictEqual({
					config: snapTemplateConfig.recommendation?.settings,
					components: snapTemplateConfig.recommendation?.templates.reduce((mapping, template) => {
						const themeName = template.theme?.name || snapTemplateConfig.config.theme.name;
						const themeImport = themeMap[themeName];

						mapping[template.component as keyof typeof mapping] = {
							component: componentMap.recommendation[template.template],
							theme: {
								name: themeName,
								import: themeImport,
							},
						};
						return mapping;
					}, {} as { [name: string]: RecommendationComponentObject }),
				});
			});

			it('will use initial browser width breakpoint settings when provided', () => {
				const snapTemplateConfig: SnapTemplateConfig = {
					config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike', variables: { breakpoints: [0, 540, 768, 1200] } } },
					recommendation: {
						templates: [
							{
								component: 'Recs',
								template: 'Recommendation',
							},
						],
						settings: {
							branch: 'production',
						},
						breakpointSettings: [
							{
								branch: 'bp0',
								limit: 3,
								batched: false,
							},
							{
								branch: 'bp1',
								limit: 6,
								realtime: true,
							},
							{
								branch: 'bp2',
								limit: 9,
								batched: true,
							},
							{
								branch: 'bp3',
								limit: 12,
								realtime: false,
							},
						],
					},
				};

				// loop through bps and set window.innerWidth to determine which breakpoint settings should be used
				snapTemplateConfig.config.theme.variables?.breakpoints.forEach((bp, index) => {
					window.innerWidth = bp + 1;
					const snapConfig = createSnapConfig(snapTemplateConfig);

					expect(snapTemplateConfig.recommendation!.breakpointSettings![index]).toBeDefined;
					expect(snapConfig.instantiators?.recommendation).toStrictEqual({
						config: {
							...snapTemplateConfig.recommendation!.settings,
							...snapTemplateConfig.recommendation!.breakpointSettings![index],
						},
						components: snapTemplateConfig.recommendation?.templates.reduce((mapping, template) => {
							const themeName = template.theme?.name || snapTemplateConfig.config.theme.name;
							const themeVariables = template.theme?.variables || snapTemplateConfig.config.theme.variables;
							const themeImport = themeMap[themeName];

							mapping[template.component as keyof typeof mapping] = {
								component: componentMap.recommendation[template.template],
								theme: {
									name: themeName,
									variables: themeVariables,
									import: themeImport,
								},
							};
							return mapping;
						}, {} as { [name: string]: RecommendationComponentObject }),
					});
				});
			});
		});
	});

	describe('SnapTemplate class', () => {
		it('creates a minimal Snap object by transforming a SnapTemplate config into a Snap config and passing that to the Snap constructor', () => {
			// script tag needed to prevent console error
			document.body.innerHTML = `<script id="searchspring-context" siteId="8uyt2m"></script>`;

			const snapTemplateConfig: SnapTemplateConfig = { config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } } };
			const snapObj = new SnapTemplate(snapTemplateConfig);
			expect(snapObj).toBeDefined();
			expect(snapObj).toHaveProperty('config');
			// @ts-ignore - verifying private member
			expect(snapObj.config.features).toStrictEqual(DEFAULT_FEATURES);
			// @ts-ignore - verifying private member
			expect(snapObj.config.client?.globals.siteId).toStrictEqual(snapTemplateConfig.config.siteId);
			// @ts-ignore - verifying private member
			expect(snapObj.config.controllers).toStrictEqual({});
		});

		it('creates a full Snap object by transforming a SnapTemplate config into a Snap config and passing that to the Snap constructor', async () => {
			// script tag needed to prevent console error
			document.body.innerHTML = `<script id="searchspring-context" siteId="8uyt2m"></script><input type="text" class="searchspring-ac"/>`;

			const snapTemplateConfig: SnapTemplateConfig = {
				config: { siteId: '123abc', currency: 'usd', language: 'en', theme: { name: 'pike' } },
				url: {
					parameters: {
						core: {
							query: { name: 'search' },
						},
					},
				},
				search: {
					templates: [
						{
							selector: '#searchspring-template',
							template: 'Search',
						},
					],
					settings: {
						facets: {
							trim: false,
						},
					},
				},
				autocomplete: {
					inputSelector: 'input.searchspring-ac',
					templates: [
						{
							selector: 'input.searchspring-ac',
							template: 'Autocomplete',
						},
					],
					settings: {
						syncInputs: false,
					},
				},
				recommendation: {
					settings: {
						branch: 'production',
						limit: 10,
						realtime: true,
						batched: false,
					},
					templates: [
						{
							component: 'Recs',
							template: 'Recommendation',
						},
					],
				},
			};
			const snapObj = new SnapTemplate(snapTemplateConfig);

			// need to give the async createAutocompleteController a bit to find a target and create
			await wait();

			expect(snapObj).toBeDefined();
			expect(snapObj).toHaveProperty('controllers');
			expect(snapObj.controllers).toHaveProperty('search');
			expect(snapObj.controllers).toHaveProperty('autocomplete');
			expect(snapObj).toHaveProperty('config');
			// @ts-ignore - verifying private member
			expect(snapObj.config.features).toStrictEqual(DEFAULT_FEATURES);
			// @ts-ignore - verifying private member
			expect(snapObj.config.client?.globals.siteId).toStrictEqual(snapTemplateConfig.config.siteId);
		});
	});
});
