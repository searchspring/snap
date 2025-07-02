import { configure as configureMobx } from 'mobx';
import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/preact';

import { ThemeStore, ThemeStoreThemeConfig, mergeThemeLayers } from './ThemeStore';
import { StorageStore } from '@searchspring/snap-store-mobx';
import type { TemplatesStoreDependencies, TemplateThemeTypes, TemplatesStoreConfigSettings } from './TemplateStore';
import type { Theme, ThemeVariables, ThemePartial } from '../../../components/src/providers/theme';
import { GLOBAL_THEME_NAME } from './TargetStore';

// configure MobX - useProxies: 'never' matches what we are doing for browser support (IE 11)
configureMobx({ enforceActions: 'never', useProxies: 'never' });

const testThemeVariables: ThemeVariables = {
	breakpoints: { mobile: 420, tablet: 720, desktop: 1440 },
	colors: {
		primary: 'test.color.primary',
		secondary: 'test.color.secondary',
		accent: 'test.color.accent',
	},
};

let testTheme: Theme = {};

describe('ThemeStore', () => {
	let dependencies: TemplatesStoreDependencies;
	let settings: TemplatesStoreConfigSettings;

	beforeEach(() => {
		dependencies = {
			storage: new StorageStore(),
		};

		settings = {
			editMode: false,
		};

		document.body.innerHTML = `<html><head></head><body></body></html>`;

		testTheme = {
			name: 'test',
			variables: testThemeVariables,
			components: {
				results: {
					columns: 5,
				},
			},
			responsive: {
				mobile: {
					results: {
						columns: 1,
					},
				},
				tablet: {
					results: {
						columns: 2,
					},
				},
				desktop: {
					results: {
						columns: 3,
					},
				},
			},
		};
	});

	it('has expected defaults and can invoke methods', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
			type: 'local',
			base: {
				name: 'empty',
				variables: testThemeVariables,
				components: {},
			},
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			languageOverrides: {},
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
			activeBreakpoint: 'mobile',
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
			activeBreakpoint: 'mobile',
		});
	});

	it('updates activeBreakpoint correctly', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
			type: 'local',
			base: {
				name: 'empty',
				variables: testThemeVariables,
				components: {},
			},
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			languageOverrides: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });
		expect(store).toBeDefined();

		expect(store.innerWidth).toBe(config.innerWidth);

		expect(store.theme.activeBreakpoint).toStrictEqual('mobile');

		store.setInnerWidth(421);
		expect(store.innerWidth).toBe(421);

		expect(store.theme.activeBreakpoint).toStrictEqual('tablet');

		store.setInnerWidth(721);
		expect(store.innerWidth).toBe(721);

		expect(store.theme.activeBreakpoint).toStrictEqual('desktop');

		store.setInnerWidth(1441);
		expect(store.innerWidth).toBe(1441);

		expect(store.theme.activeBreakpoint).toStrictEqual('default');
	});

	it('can get theme', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
			type: 'local',
			base: testTheme,
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			languageOverrides: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(config.base, config.currency, config.language, config.overrides!);

		expect(store.theme).toStrictEqual({
			...merged,
			components: {
				...merged.components,
				'*(M)results': {
					columns: 1,
				},
			},
			name: config.name,
			activeBreakpoint: 'mobile',
		});

		// assertions on 'test' theme
		expect(merged.components?.results?.columns == 5);
	});

	it('can get theme with overrides applied', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
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
			languageOverrides: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(config.base, config.currency, config.language, config.overrides!);

		expect(store.theme).toStrictEqual({
			...merged,
			components: {
				...merged.components,
				'*(M)results': {
					columns: 1,
				},
			},
			name: config.name,
			activeBreakpoint: 'mobile',
		});
	});

	it('can get theme with overrides and variables applied', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
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
				breakpoints: { mobile: 100, tablet: 200, desktop: 300 },
				colors: {
					primary: 'primary',
					secondary: 'secondary',
					accent: 'accent',
				},
			},
			currency: {},
			language: {},
			languageOverrides: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(config.base, config.currency, config.language, config.overrides!, { variables: config.variables });

		expect(store.theme).toStrictEqual({
			...merged,
			components: {
				...merged.components,
				'*(M)results': {
					columns: 1,
				},
			},
			name: config.name,
			activeBreakpoint: 'mobile',
		});
	});

	it('can get theme with currency and language applied', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
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
				breakpoints: { mobile: 100, tablet: 200, desktop: 300 },
				colors: {
					primary: 'primary',
					secondary: 'secondary',
					accent: 'accent',
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
			languageOverrides: {},
			innerWidth: 0,
		};

		const store = new ThemeStore({ config, dependencies, settings });

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(config.base, config.currency, config.language, config.overrides!, { variables: config.variables });

		expect(store.theme).toStrictEqual({
			...merged,
			components: {
				...merged.components,
				'*(M)results': {
					columns: 1,
				},
			},
			name: config.name,
			activeBreakpoint: 'mobile',
		});
	});

	it('can get theme at a breakpoint', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
			type: 'local',
			base: testTheme,
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			languageOverrides: {},
			innerWidth: testTheme.variables?.breakpoints.mobile! - 10,
		};
		const store = new ThemeStore({ config, dependencies, settings });

		expect(store.innerWidth).toBe(config.innerWidth);

		const baseResponsiveOverrides = config.base.responsive?.mobile!;

		expect(baseResponsiveOverrides).toBeDefined();

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(
			config.base,
			{ components: baseResponsiveOverrides as ThemePartial },
			config.currency,
			config.language,
			config.overrides!
		);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
			activeBreakpoint: 'mobile',
		});

		// extra assertions on 'test' theme
		// @ts-ignore
		expect(merged.components?.['*(M)results']?.columns).toBe(1);
		// @ts-ignore
		expect(merged.components?.['*results']?.columns).toBe(5);
	});

	it('should not have overrides applied if past last breakpoint', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
			type: 'local',
			base: testTheme,
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			languageOverrides: {},
			innerWidth: testTheme.variables?.breakpoints.desktop! + 10,
		};

		const store = new ThemeStore({ config, dependencies, settings });
		expect(store.innerWidth).toBe(config.innerWidth);

		const merged = mergeThemeLayers(config.base, config.currency, config.language, config.overrides!);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
			activeBreakpoint: 'default',
		});

		// extra assertions on 'test' theme
		// @ts-ignore - its fine
		expect(merged.components?.['*results']?.columns).toBe(5);
	});

	it('can get theme at breakpoint and use breakpoint overrides', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
			type: 'local',
			base: testTheme,
			overrides: {
				responsive: {
					mobile: {
						results: { columns: 7 },
					},
					tablet: {},
					desktop: {},
				},
			},
			variables: {
				breakpoints: { mobile: 100, tablet: 200, desktop: 300 },
			},
			currency: {},
			language: {},
			languageOverrides: {},
			innerWidth: 50,
		};

		const store = new ThemeStore({ config, dependencies, settings });
		expect(store.innerWidth).toBe(config.innerWidth);

		const baseResponsiveOverrides = config.base.responsive?.mobile!;
		expect(baseResponsiveOverrides).toBeDefined();

		const additionalResponsiveOverrides = config.overrides?.responsive?.mobile!;
		expect(additionalResponsiveOverrides).toBeDefined();

		// order here matches order merged via theme() getter
		const merged = mergeThemeLayers(
			config.base,
			{ components: baseResponsiveOverrides },
			config.currency,
			config.language,
			config.overrides!,
			{ components: additionalResponsiveOverrides },
			{ variables: config.variables }
		);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
			activeBreakpoint: 'mobile',
		});

		// extra assertions on 'test' theme
		// @ts-ignore
		expect(merged.components?.['*results']?.columns).toBe(5);
		// @ts-ignore
		expect(merged.components?.['*(M)results']?.columns).toBe(1);
		// @ts-ignore
		expect(merged.components?.['(M)results']?.columns).toBe(7);
	});

	it('can get theme with all the things ', () => {
		const config: ThemeStoreThemeConfig = {
			name: GLOBAL_THEME_NAME,
			type: 'local',
			base: testTheme,
			overrides: {
				responsive: {
					mobile: {
						results: { columns: 7 },
					},
					tablet: {},
					desktop: {},
				},
			},
			variables: {
				breakpoints: { mobile: 100, tablet: 200, desktop: 300 },
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
			languageOverrides: {},
			innerWidth: 50,
		};

		const store = new ThemeStore({ config, dependencies, settings });
		expect(store.innerWidth).toBe(config.innerWidth);

		const baseResponsiveOverrides = config.base.responsive?.mobile!;
		expect(baseResponsiveOverrides).toBeDefined();

		const additionalResponsiveOverrides = config.overrides?.responsive?.mobile!;
		expect(additionalResponsiveOverrides).toBeDefined();

		const overrideObj = { path: ['results', 'columns'], rootEditingKey: 'components', value: 12 };
		store.setOverride(overrideObj);

		// testing all the things!!!
		// mergeThemeLayers(base, baseResponsive, currency, language, overrides, overridesResponsive, variables, layout, editor)

		const merged = mergeThemeLayers(
			config.base,
			{ components: baseResponsiveOverrides },
			config.currency,
			config.language,
			config.overrides!,
			{ components: additionalResponsiveOverrides },
			{ variables: config.variables },
			store.stored
		);

		expect(store.theme).toStrictEqual({
			...merged,
			name: config.name,
			activeBreakpoint: 'mobile',
		});

		// extra assertions on 'test' theme
		expect(merged.components?.results?.columns).toBe(12);
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
			languageOverrides: {},
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

		// wait for rendering of stylesheets
		await waitFor(() => {
			const styleElements = document.querySelectorAll('head style')!;
			expect(styleElements).toHaveLength(2);

			expect(styleElements[0].innerHTML).toBe(`<!-- searchspring style injection point for "${config.name}" theme -->`);

			expect(styleElements[1]).toHaveAttribute('data-emotion', 'ss-global');
		});
	});

	it('correctly merges observable variable arrays', async () => {
		// due to mobx observable arrays being objects, we need to ensure that the mergeThemeLayers function
		// correctly merges observable arrays (ThemeStore uses toJS function)

		const config: ThemeStoreThemeConfig = {
			name: 'globally',
			type: 'local',
			base: testTheme,
			overrides: {},
			variables: {
				breakpoints: { mobile: 1, tablet: 2, desktop: 3 },
			},
			currency: {},
			language: {},
			languageOverrides: {},
			innerWidth: 0,
		};

		const themeStore = new ThemeStore({ config, dependencies, settings });

		expect(themeStore.theme.variables?.breakpoints).toStrictEqual(config.variables?.breakpoints);
	});
});

describe('mergeThemeLayers function', () => {
	it(`deep merges 'variables' in ThemePartials`, () => {
		const themePartial1: ThemePartial = {
			variables: {
				breakpoints: { mobile: 1, tablet: 2, desktop: 3 },
				colors: {
					primary: 'blue',
					secondary: 'red',
					accent: 'green',
				},
			},
		};

		const themePartial2: ThemePartial = {
			variables: {
				breakpoints: { mobile: 4, tablet: 5, desktop: 6 },
				colors: {
					primary: 'red',
					secondary: 'blue',
					accent: 'green',
				},
			},
		};

		const merged = mergeThemeLayers(themePartial1, themePartial2);
		expect(merged).toStrictEqual({
			variables: {
				breakpoints: { mobile: 4, tablet: 5, desktop: 6 },
				colors: {
					primary: 'red',
					secondary: 'blue',
					accent: 'green',
				},
			},
		});
	});

	it(`deep merges 'responsive' in ThemePartials`, () => {
		const themePartial1: ThemePartial = {
			responsive: {
				mobile: {
					results: { columns: 1 },
				},
				tablet: {},
				desktop: {},
			},
		};

		const themePartial2: ThemePartial = {
			responsive: {
				mobile: {
					result: { layout: 'grid' },
				},
				tablet: {},
				desktop: {
					results: { columns: 1 },
				},
			},
		};

		const merged = mergeThemeLayers(themePartial1, themePartial2);
		expect(merged).toStrictEqual({
			responsive: {
				mobile: {
					result: { layout: 'grid' },
					results: { columns: 1 },
				},
				tablet: {},
				desktop: {
					results: { columns: 1 },
				},
			},
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

	it(`deep merges all the things in ThemePartials`, () => {
		const themePartial1: ThemePartial = {
			variables: {
				breakpoints: { mobile: 1, tablet: 2, desktop: 3 },
				colors: {
					primary: 'blue',
					secondary: 'red',
					accent: 'yellow',
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
			responsive: {
				mobile: {
					results: { columns: 1 },
				},
				tablet: {},
				desktop: {},
			},
		};

		const themePartial2: ThemePartial = {
			variables: {
				breakpoints: { mobile: 420, tablet: 720, desktop: 1440 },
				colors: {
					primary: 'red',
					secondary: 'yellow',
					accent: 'orange',
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
			responsive: {
				mobile: {},
				tablet: {},
			},
		};

		const merged = mergeThemeLayers(themePartial1, themePartial2);
		expect(merged).toStrictEqual({
			variables: {
				breakpoints: { mobile: 420, tablet: 720, desktop: 1440 },
				colors: {
					primary: 'red',
					secondary: 'yellow',
					accent: 'orange',
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
			responsive: {
				mobile: {
					results: { columns: 1 },
				},
				tablet: {},
				desktop: {},
			},
		});
	});
});
