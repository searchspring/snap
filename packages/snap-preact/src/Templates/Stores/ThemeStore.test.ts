import { configure as configureMobx } from 'mobx';
import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/preact';

import { ThemeStore, ThemeStoreThemeConfig, mergeThemeLayers } from './ThemeStore';
import { StorageStore } from '@searchspring/snap-store-mobx';
import type { TemplatesStoreDependencies, TemplateThemeTypes, TemplatesStoreSettings } from './TemplateStore';
import type { Theme, ThemeVariables, ThemePartial } from '../../../components/src/providers/theme';

// configure MobX
configureMobx({ enforceActions: 'never' });

const testThemeVariables: ThemeVariables = {
	breakpoints: [0, 420, 720, 1440],
	colors: {
		primary: 'test.color.primary',
		secondary: 'test.color.secondary',
		accent: 'test.color.accent',
		active: {
			foreground: 'test.color.active.foreground',
			background: 'test.color.active.background',
			accent: 'test.color.active.accent',
		},
		hover: {
			foreground: 'test.color.hover.foreground',
			background: 'test.color.hover.background',
			accent: 'test.color.hover.accent',
		},
	},
};

const testTheme: Theme = {
	name: 'test',
	variables: testThemeVariables,
	components: {
		results: {
			columns: 5,
		},
	},
	layoutOptions: [
		{
			label: 'list',
			value: 'list',
			default: true,
			overrides: {
				components: {
					results: {
						layout: 'list',
					},
				},
			},
		},
		{
			label: 'grid',
			value: 'grid',
			overrides: {
				components: {
					results: {
						layout: 'grid',
					},
				},
			},
		},
	],
	responsive: [
		{
			components: {
				results: {
					columns: 1,
				},
			},
		},
		{
			components: {
				results: {
					columns: 2,
				},
			},
		},
		{
			components: {
				results: {
					columns: 3,
				},
			},
		},
		{
			components: {
				results: {
					columns: 4,
				},
			},
		},
	],
};

describe('ThemeStore', () => {
	let dependencies: TemplatesStoreDependencies;
	let settings: TemplatesStoreSettings;

	beforeEach(() => {
		dependencies = {
			storage: new StorageStore(),
		};

		settings = {
			editMode: false,
		};

		document.body.innerHTML = `<html><head></head><body></body></html>`;
	});

	it('has expected defaults and can invoke methods', () => {
		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: {
				name: 'empty',
				variables: testThemeVariables,
				responsive: [{}, {}, {}, {}],
				components: {},
			},
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });
		expect(store).toBeDefined();
		expect(store.name).toBe(config.name);
		expect(store.type).toBe(config.type);

		expect(store.layout).toBeDefined();
		// @ts-ignore - private property
		expect(store.layout.name).toBe(config.name);
		// @ts-ignore - private property
		expect(store.layout.type).toBe(config.type);
		// @ts-ignore - private property
		expect(store.layout.storage).toBe(dependencies.storage);
		expect(store.layout.selected).toBeUndefined();

		// @ts-ignore - private property
		expect(store.dependencies).toBe(dependencies);
		// @ts-ignore - private property
		expect(store.base).toStrictEqual(config.base);
		// @ts-ignore - private property
		expect(store.overrides).toStrictEqual(config.overrides);
		expect(store.variables).toStrictEqual(config.variables);
		expect(store.currency).toStrictEqual(config.currency);
		expect(store.language).toStrictEqual(config.language);
		expect(store.stored).toStrictEqual({});
		expect(store.innerWidth).toBe(config.innerWidth);

		expect(store.theme).toStrictEqual({
			...config.base,
			name: config.name,
		});

		store.setInnerWidth(100);
		expect(store.innerWidth).toBe(100);

		const currency = { components: { price: { symbol: '€' } } };
		store.setCurrency(currency);
		expect(store.currency).toStrictEqual(currency);

		const language = { components: { filterSummary: { title: 'Filter Summary Title' } } };
		store.setLanguage(language);
		expect(store.language).toStrictEqual(language);

		const overrideObj = { path: ['custom'], rootEditingKey: 'variables', value: 'customValue' };
		store.setOverride(overrideObj);
		expect(store.stored).toStrictEqual({ variables: { custom: 'customValue' } });

		const overrideObj2 = { path: ['custom', 'property'], rootEditingKey: 'variables', value: 'customValue' };
		store.setOverride(overrideObj2);
		expect(store.stored).toStrictEqual({ variables: { custom: { property: 'customValue' } } });

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(config.base, currency, language, store.stored);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});
	});

	it('can get theme', () => {
		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: testTheme,
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });

		const defaultLayoutOptionOverrides = config.base.layoutOptions?.find((option) => option.default)?.overrides || {};

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(config.base, config.currency, config.language, config.overrides!, defaultLayoutOptionOverrides);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});

		// assertions on 'test' theme
		expect(merged.components?.results?.columns == 5);
	});

	it('can get theme with overrides applied', () => {
		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: testTheme,
			overrides: {
				components: {
					results: {
						columns: 5,
					},
				},
			},
			variables: {},
			currency: {},
			language: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });

		const defaultLayoutOptionOverrides = config.base.layoutOptions?.find((option) => option.default)?.overrides || {};

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(config.base, config.currency, config.language, config.overrides!, defaultLayoutOptionOverrides);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});
	});

	it('can get theme with overrides and variables applied', () => {
		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: testTheme,
			overrides: {
				components: {
					results: {
						columns: 5,
					},
				},
			},
			variables: {
				breakpoints: [100, 200, 300, 400],
				colors: {
					primary: 'primary',
					secondary: 'secondary',
					accent: 'accent',
					active: {
						foreground: 'active.foreground',
						background: 'active.background',
						accent: 'active.accent',
					},
					hover: {
						foreground: 'hover.foreground',
						background: 'hover.background',
						accent: 'hover.account',
					},
				},
			},
			currency: {},
			language: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });

		const defaultLayoutOptionOverrides = config.base.layoutOptions?.find((option) => option.default)?.overrides || {};

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(
			config.base,
			config.currency,
			config.language,
			config.overrides!,
			{ variables: config.variables },
			defaultLayoutOptionOverrides
		);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});
	});

	it('can get theme with currency and language applied', () => {
		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: testTheme,
			overrides: {
				components: {
					results: {
						columns: 5,
					},
				},
			},
			variables: {
				breakpoints: [100, 200, 300, 400],
				colors: {
					primary: 'primary',
					secondary: 'secondary',
					accent: 'accent',
					active: {
						foreground: 'active.foreground',
						background: 'active.background',
						accent: 'active.accent',
					},
					hover: {
						foreground: 'hover.foreground',
						background: 'hover.background',
						accent: 'hover.account',
					},
				},
			},
			currency: {
				components: {
					price: {
						symbol: '€',
					},
				},
			},
			language: {
				components: {
					filterSummary: {
						title: 'Filter Summary Title',
					},
				},
			},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });

		const defaultLayoutOptionOverrides = config.base.layoutOptions?.find((option) => option.default)?.overrides || {};

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(
			config.base,
			config.currency,
			config.language,
			config.overrides!,
			{ variables: config.variables },
			defaultLayoutOptionOverrides
		);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});
	});

	it('can get theme at breakpoint', () => {
		const bpIndex = 0; // simulate being at first breakpoint
		expect(testTheme.variables?.breakpoints[bpIndex]).toBe(0);

		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: testTheme,
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			innerWidth: 300,
		};

		const store = new ThemeStore({ config, dependencies, settings });
		expect(store.innerWidth).toBe(config.innerWidth);

		const layoutOptions = config.base.responsive?.[bpIndex].layoutOptions || config.base.layoutOptions;
		const defaultLayoutOptionOverrides = layoutOptions?.find((option) => option.default)?.overrides || {};

		const baseResponsiveOverrides = config.base.responsive?.[bpIndex]!;
		expect(baseResponsiveOverrides).toBeDefined();

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(
			config.base,
			baseResponsiveOverrides,
			config.currency,
			config.language,
			config.overrides!,
			defaultLayoutOptionOverrides
		);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});

		// extra assertions on 'test' theme
		expect(merged.components?.results?.columns).toBe(1);
	});

	it('can get theme with last breakpoint applied', () => {
		const bpIndex = 3;
		expect(testTheme.variables?.breakpoints[bpIndex]).toBeGreaterThan(0);

		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: testTheme,
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			innerWidth: 1600,
		};

		const store = new ThemeStore({ config, dependencies, settings });
		expect(store.innerWidth).toBe(config.innerWidth);

		const layoutOptions = config.base.responsive?.[bpIndex].layoutOptions || config.base.layoutOptions;
		const defaultLayoutOptionOverrides = layoutOptions?.find((option) => option.default)?.overrides || {};

		const baseResponsiveOverrides = config.base.responsive?.[bpIndex]!;

		const merged = mergeThemeLayers(
			config.base,
			config.currency,
			config.language,
			config.overrides!,
			baseResponsiveOverrides,
			defaultLayoutOptionOverrides
		);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});

		// extra assertions on 'test' theme
		expect(merged.components?.results?.columns).toBe(4);
	});

	it('can get theme at breakpoint and use breakpoint overrides', () => {
		const bpIndex = 0; // simulate being at first breakpoint
		expect(testTheme.variables?.breakpoints[bpIndex]).toBe(0);

		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: testTheme,
			overrides: {
				responsive: [
					{
						components: {
							results: { columns: 7 },
						},
					},
					{},
					{},
					{},
				],
			},
			variables: {
				breakpoints: [0, 100, 200, 300],
			},
			currency: {},
			language: {},
			innerWidth: 50,
		};

		const store = new ThemeStore({ config, dependencies, settings });
		expect(store.innerWidth).toBe(config.innerWidth);

		const layoutOptions = config.base.responsive?.[bpIndex].layoutOptions || config.base.layoutOptions;
		const defaultLayoutOptionOverrides = layoutOptions?.find((option) => option.default)?.overrides || {};

		const baseResponsiveOverrides = config.base.responsive?.[bpIndex]!;
		expect(baseResponsiveOverrides).toBeDefined();

		const additionalResponsiveOverrides = config.overrides?.responsive?.[bpIndex]!;
		expect(baseResponsiveOverrides).toBeDefined();

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(
			config.base,
			baseResponsiveOverrides,
			config.currency,
			config.language,
			config.overrides!,
			additionalResponsiveOverrides,
			{ variables: config.variables },
			defaultLayoutOptionOverrides
		);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});

		// extra assertions on 'test' theme
		expect(merged.components?.results?.columns).toBe(7);
	});

	it('can get theme with all the things ', () => {
		const bpIndex = 0; // simulate being at first breakpoint
		expect(testTheme.variables?.breakpoints[bpIndex]).toBe(0);

		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: testTheme,
			overrides: {
				responsive: [
					{
						components: {
							results: { columns: 7 },
						},
					},
					{},
					{},
					{},
				],
			},
			variables: {
				breakpoints: [0, 100, 200, 300],
			},
			currency: {
				components: {
					results: { columns: 9 },
				},
			},
			language: {
				components: {
					results: { columns: 11 },
				},
			},
			innerWidth: 50,
		};

		const store = new ThemeStore({ config, dependencies, settings });
		expect(store.innerWidth).toBe(config.innerWidth);

		const layoutOptions = config.base.responsive?.[bpIndex].layoutOptions || config.base.layoutOptions;
		const defaultLayoutOptionOverrides = layoutOptions?.find((option) => option.default)?.overrides || {};

		const baseResponsiveOverrides = config.base.responsive?.[bpIndex]!;
		expect(baseResponsiveOverrides).toBeDefined();

		const additionalResponsiveOverrides = config.overrides?.responsive?.[bpIndex]!;
		expect(baseResponsiveOverrides).toBeDefined();

		const overrideObj = { path: ['results', 'columns'], rootEditingKey: 'components', value: 12 };
		store.setOverride(overrideObj);

		// testing all the things!!!
		// mergeThemeLayers(base, baseResponsive, currency, language, overrides, overridesResponsive, variables, layout, editor)

		const merged = mergeThemeLayers(
			config.base,
			baseResponsiveOverrides,
			config.currency,
			config.language,
			config.overrides!,
			additionalResponsiveOverrides,
			{ variables: config.variables },
			defaultLayoutOptionOverrides,
			store.stored
		);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});

		// extra assertions on 'test' theme
		expect(merged.components?.results?.columns).toBe(12);
	});

	it('can select layoutOption', () => {
		const bpIndex = 0;
		const config: ThemeStoreThemeConfig = {
			name: 'global',
			type: 'local',
			base: testTheme,
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });

		const layoutOptions = config.base.responsive?.[bpIndex].layoutOptions || config.base.layoutOptions;
		const layoutOptionDefault = layoutOptions?.find((option) => option.default);
		const layoutOptionNotDefault = layoutOptions?.find((option) => !option.default);

		if (!layoutOptionNotDefault?.overrides || !layoutOptionDefault?.overrides) {
			// skip if theme does not have any layoutOptions
			return;
		}

		expect(store.layout.selected).toStrictEqual(undefined);

		const defaultLayoutOptionOverrides = layoutOptionDefault.overrides;
		const selectedLayoutOptionOverrides = layoutOptionNotDefault.overrides;

		const merged = mergeThemeLayers(config.base, config.currency, config.language, config.overrides!, defaultLayoutOptionOverrides);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
		});

		// extra assertions on 'test' theme
		expect(merged.components?.results?.layout).toBe('list');

		store.layout.select(layoutOptionNotDefault);
		expect(store.layout.selected).toStrictEqual(layoutOptionNotDefault);

		// check merged theme after new layout selection
		const mergedSelectedLayout = mergeThemeLayers(config.base, config.currency, config.language, config.overrides!, selectedLayoutOptionOverrides);

		expect(store.theme).toStrictEqual({
			...mergedSelectedLayout,
			name: config.name,
		});

		expect(merged).not.toEqual(mergedSelectedLayout);

		// extra assertions on 'test' theme
		expect(mergedSelectedLayout.components?.results?.layout).toBe('grid');
	});

	it('adds a style sheet to the page when a style is provided', async () => {
		const config: ThemeStoreThemeConfig = {
			name: 'globally',
			type: 'local',
			base: testTheme,
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			innerWidth: 0,
			style: (theme) => {
				return {
					'.ss__result': {
						fontSize: '200%',
					},
				};
			},
		};

		new ThemeStore({ config, dependencies, settings });

		// wait for rendering of BranchOverride component
		await waitFor(() => {
			const styleElements = document.querySelectorAll('head style')!;
			expect(styleElements).toHaveLength(2);

			expect(styleElements[0].innerHTML).toBe(`<!-- searchspring style injection point for "${config.name}" theme -->`);

			expect(styleElements[1]).toHaveAttribute('data-emotion', 'ss-global');
		});
	});
});

describe('mergeThemeLayers function', () => {
	it(`deep merges 'variables' in ThemePartials`, () => {
		const themePartial1: ThemePartial = {
			variables: {
				breakpoints: [1, 2, 3, 4],
				colors: {
					primary: 'blue',
					active: {
						accent: 'blue',
					},
					hover: {
						accent: 'blue',
					},
				},
			},
		};

		const themePartial2: ThemePartial = {
			variables: {
				breakpoints: [5, 6, 7, 8],
				colors: {
					primary: 'red',
					active: {
						foreground: 'red',
						accent: 'red',
					},
				},
			},
		};

		const merged = mergeThemeLayers(themePartial1, themePartial2);
		expect(merged).toStrictEqual({
			variables: {
				breakpoints: [5, 6, 7, 8],
				colors: {
					primary: 'red',
					active: {
						foreground: 'red',
						accent: 'red',
					},
					hover: {
						accent: 'blue',
					},
				},
			},
		});
	});

	it(`deep merges 'responsive' in ThemePartials`, () => {
		const themePartial1: ThemePartial = {
			responsive: [
				{
					components: {
						results: { columns: 1 },
					},
				},
				{},
				{},
				{},
			],
		};

		const themePartial2: ThemePartial = {
			responsive: [
				{
					components: {
						result: { layout: 'grid' },
					},
				},
				{},
				{},
				{
					components: {
						results: { columns: 1 },
					},
				},
			],
		};

		const merged = mergeThemeLayers(themePartial1, themePartial2);
		expect(merged).toStrictEqual({
			responsive: [
				{
					components: {
						result: { layout: 'grid' },
						results: { columns: 1 },
					},
				},
				{},
				{},
				{
					components: {
						results: { columns: 1 },
					},
				},
			],
		});
	});

	it(`deep merges 'components' in ThemePartials`, () => {
		const themePartial1: ThemePartial = {
			components: {
				results: { columns: 1, gapSize: '20px' },
				noResults: {
					suggestionsList: ['do this', 'do that'],
					contactsList: [
						{
							title: 'call us',
							content: '1-800-its-snap',
						},
						{
							title: 'email us',
							content: 'snap@searchspring.com',
						},
					],
				},
			},
		};

		const themePartial2: ThemePartial = {
			components: {
				results: { columns: 5, rows: 2 },
				noResults: {
					suggestionsList: ['dont do this', 'do instead', 'this'],
					contactsList: [
						{
							title: 'dont call us',
							content: '1-800-its-snap',
						},
					],
				},
			},
		};

		const merged = mergeThemeLayers(themePartial1, themePartial2);
		expect(merged).toStrictEqual({
			components: {
				results: { columns: 5, rows: 2, gapSize: '20px' },
				noResults: {
					suggestionsList: ['dont do this', 'do instead', 'this'],
					contactsList: [
						{
							title: 'dont call us',
							content: '1-800-its-snap',
						},
					],
				},
			},
		});
	});

	it(`deep merges 'layoutOptions' in ThemePartials`, () => {
		const themePartial1: ThemePartial = {
			layoutOptions: [
				{
					label: 'dos',
					value: '2',
					default: true,
					overrides: {
						components: {
							results: {
								layout: 'grid',
								columns: 2,
							},
						},
					},
				},
				{
					label: 'uno',
					value: '1',
					overrides: {
						components: {
							results: {
								layout: 'grid',
								columns: 1,
							},
						},
					},
				},
			],
		};

		const themePartial2: ThemePartial = {
			layoutOptions: [
				{
					label: 'list',
					value: 'list',
					default: true,
					overrides: {
						components: {
							results: {
								layout: 'list',
								columns: 1,
							},
						},
					},
				},
				{
					label: 'grid',
					value: 'grid',
					overrides: {
						components: {
							results: {
								layout: 'grid',
								columns: 3,
							},
						},
					},
				},
			],
		};

		const merged = mergeThemeLayers(themePartial1, themePartial2);
		expect(merged).toStrictEqual({
			layoutOptions: [
				{
					label: 'list',
					value: 'list',
					default: true,
					overrides: {
						components: {
							results: {
								layout: 'list',
								columns: 1,
							},
						},
					},
				},
				{
					label: 'grid',
					value: 'grid',
					overrides: {
						components: {
							results: {
								layout: 'grid',
								columns: 3,
							},
						},
					},
				},
			],
		});
	});

	it(`deep merges all the things in ThemePartials`, () => {
		const themePartial1: ThemePartial = {
			variables: {
				breakpoints: [1, 2, 3, 4],
				colors: {
					primary: 'blue',
					active: {
						accent: 'blue',
					},
					hover: {
						accent: 'blue',
					},
				},
			},
			components: {
				results: { columns: 1, gapSize: '20px' },
				noResults: {
					suggestionsList: ['do this', 'do that'],
					contactsList: [
						{
							title: 'call us',
							content: '1-800-its-snap',
						},
						{
							title: 'email us',
							content: 'snap@searchspring.com',
						},
					],
				},
			},
			responsive: [
				{
					components: {
						results: { columns: 1 },
					},
					layoutOptions: [
						{
							label: 'dos',
							value: '2',
							default: true,
							overrides: {
								components: {
									results: {
										layout: 'grid',
										columns: 2,
									},
								},
							},
						},
					],
				},
				{},
				{},
				{},
			],
			layoutOptions: [
				{
					label: 'dos',
					value: '2',
					default: true,
					overrides: {
						components: {
							results: {
								layout: 'grid',
								columns: 2,
							},
						},
					},
				},
				{
					label: 'uno',
					value: '1',
					overrides: {
						components: {
							results: {
								layout: 'grid',
								columns: 1,
							},
						},
					},
				},
			],
		};

		const themePartial2: ThemePartial = {
			variables: {
				breakpoints: [0, 420, 720, 1440],
				colors: {
					primary: 'red',
					active: {
						accent: 'red',
					},
					hover: {
						foreground: 'red',
						background: 'red',
					},
				},
			},
			components: {
				results: { columns: 5, rows: 2 },
				noResults: {
					suggestionsList: ['dont do this', 'do instead', 'this'],
					contactsList: [
						{
							title: 'dont call us',
							content: '1-800-its-snap',
						},
					],
				},
			},
			responsive: [
				{
					layoutOptions: [],
				},
				{
					components: {},
				},
				{},
				{},
			],
			layoutOptions: [],
		};

		const merged = mergeThemeLayers(themePartial1, themePartial2);
		expect(merged).toStrictEqual({
			variables: {
				breakpoints: [0, 420, 720, 1440],
				colors: {
					primary: 'red',
					active: {
						accent: 'red',
					},
					hover: {
						accent: 'blue',
						foreground: 'red',
						background: 'red',
					},
				},
			},
			components: {
				results: { columns: 5, rows: 2, gapSize: '20px' },
				noResults: {
					suggestionsList: ['dont do this', 'do instead', 'this'],
					contactsList: [
						{
							title: 'dont call us',
							content: '1-800-its-snap',
						},
					],
				},
			},
			responsive: [
				{
					components: {
						results: { columns: 1 },
					},
					layoutOptions: [],
				},
				{ components: {} },
				{},
				{},
			],
			layoutOptions: [],
		});
	});
});
