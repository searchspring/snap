import { ThemeStore, mergeLayers } from './ThemeStore';
import { StorageStore } from '@searchspring/snap-store-mobx';
import type { TemplatesStoreDependencies, TemplateThemeTypes, TemplatesStoreSettings } from './TemplateStore';
import type { Theme } from '../../../components/src/providers/theme';

import { bocachica } from '../../../components/src/themes/bocachica';
import { pike } from '../../../components/src/themes/pike';

const themes = [
	{
		name: 'bocachica',
		base: bocachica,
	},
	{
		name: 'pike',
		base: pike,
	},
];
themes.forEach((theme) => {
	describe(`ThemeStore using ${theme.name} theme`, () => {
		let dependencies: TemplatesStoreDependencies;
		let settings: TemplatesStoreSettings;
		let baseTheme: Theme;

		beforeEach(() => {
			baseTheme = theme.base;
			dependencies = {
				storage: new StorageStore(),
			};
			settings = {
				editMode: false,
			};
		});

		it('has expected defaults and can invoke methods', () => {
			const config = {
				name: 'global',
				type: 'local' as TemplateThemeTypes,
				base: {},
				overrides: {},
				variables: {},
				currency: {},
				language: {},
				innerWidth: 0,
				style: () => ({}),
			};

			const store = new ThemeStore(config, dependencies, settings);
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
				name: config.name,
				variables: {},
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
		});

		it('can get base theme with its layoutOptions applied', () => {
			const config = {
				name: 'global',
				type: 'local' as TemplateThemeTypes,
				base: baseTheme,
				overrides: {},
				variables: {},
				currency: {},
				language: {},
				innerWidth: 0,
				style: () => ({}),
			};

			const store = new ThemeStore(config, dependencies, settings);

			const defaultLayoutOptionOverrides = config.base.layoutOptions?.find((option) => option.default)?.overrides || {};
			const base = mergeLayers(config.base, defaultLayoutOptionOverrides as Partial<Theme>);

			expect(store.theme).toStrictEqual({
				...base,
				name: config.name,
			});
		});

		it('can get theme with overrides applied', () => {
			const config = {
				name: 'global',
				type: 'local' as TemplateThemeTypes,
				base: baseTheme,
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
				style: () => ({}),
			};

			const store = new ThemeStore(config, dependencies, settings);

			const defaultLayoutOptionOverrides = config.base.layoutOptions?.find((option) => option.default)?.overrides || {};
			const base = mergeLayers(config.base, defaultLayoutOptionOverrides as Partial<Theme>);
			const merged = mergeLayers(base, config.overrides);

			expect(store.theme).toStrictEqual({
				...merged,
				name: config.name,
			});
		});

		it('can get theme with variables applied', () => {
			const config = {
				name: 'global',
				type: 'local' as TemplateThemeTypes,
				base: baseTheme,
				overrides: {
					components: {
						results: {
							columns: 5,
						},
					},
				},
				variables: {
					breakpoints: [100, 200, 300, 400] as [number, number, number, number],
					color: {
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
				style: () => ({}),
			};

			const store = new ThemeStore(config, dependencies, settings);

			const defaultLayoutOptionOverrides = config.base.layoutOptions?.find((option) => option.default)?.overrides || {};
			const base = mergeLayers(config.base, defaultLayoutOptionOverrides as Partial<Theme>);
			const merged = mergeLayers(base, config.overrides, { variables: config.variables });

			expect(store.theme).toStrictEqual({
				...merged,
				name: config.name,
			});
		});

		it('can get theme with currency and language applied', () => {
			const config = {
				name: 'global',
				type: 'local' as TemplateThemeTypes,
				base: baseTheme,
				overrides: {
					components: {
						results: {
							columns: 5,
						},
					},
				},
				variables: {
					breakpoints: [100, 200, 300, 400] as [number, number, number, number],
					color: {
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
				style: () => ({}),
			};

			const store = new ThemeStore(config, dependencies, settings);

			const defaultLayoutOptionOverrides = config.base.layoutOptions?.find((option) => option.default)?.overrides || {};
			const base = mergeLayers(config.base, defaultLayoutOptionOverrides as Partial<Theme>);
			const merged = mergeLayers(base, config.currency, config.language, config.overrides, { variables: config.variables });

			expect(store.theme).toStrictEqual({
				...merged,
				name: config.name,
			});
		});

		it('can get theme with breakpoints applied', () => {
			const bpIndex = 1; // simulate being at second breakpoint
			expect(baseTheme.variables?.breakpoints[bpIndex]).toBeGreaterThan(0);

			const config = {
				name: 'global',
				type: 'local' as TemplateThemeTypes,
				base: baseTheme,
				overrides: {},
				variables: {},
				currency: {},
				language: {},
				innerWidth: baseTheme.variables!.breakpoints[bpIndex] + 10,
				style: () => ({}),
			};

			const store = new ThemeStore(config, dependencies, settings);
			expect(store.innerWidth).toBe(config.innerWidth);

			const layoutOptions = config.base.responsive?.[bpIndex].layoutOptions || config.base.layoutOptions;
			const defaultLayoutOptionOverrides = layoutOptions?.find((option) => option.default)?.overrides || {};
			const base = mergeLayers(config.base, defaultLayoutOptionOverrides as Partial<Theme>);

			const bpOverrides = config.base.responsive?.[bpIndex]!;
			expect(bpOverrides).toBeDefined();

			const merged = mergeLayers(base, config.currency, config.language, config.overrides, bpOverrides);

			expect(store.theme).toStrictEqual({
				...merged,
				name: config.name,
			});
		});

		it('can get theme with last breakpoint applied & responsive layoutOptions', () => {
			const bpIndex = baseTheme.variables!.breakpoints.length - 1;
			expect(baseTheme.variables?.breakpoints[bpIndex]).toBeGreaterThan(0);

			const config = {
				name: 'global',
				type: 'local' as TemplateThemeTypes,
				base: baseTheme,
				overrides: {},
				variables: {},
				currency: {},
				language: {},
				innerWidth: baseTheme.variables!.breakpoints[bpIndex] + 10,
				style: () => ({}),
			};

			const store = new ThemeStore(config, dependencies, settings);
			expect(store.innerWidth).toBe(config.innerWidth);

			const layoutOptions = config.base.responsive?.[bpIndex].layoutOptions || config.base.layoutOptions;
			const defaultLayoutOptionOverrides = layoutOptions?.find((option) => option.default)?.overrides || {};

			const base = mergeLayers(config.base, defaultLayoutOptionOverrides as Partial<Theme>);

			const bpOverrides = config.base.responsive?.[bpIndex]!;
			expect(bpOverrides).toBeDefined();

			const merged = mergeLayers(base, config.currency, config.language, config.overrides, bpOverrides);

			expect(store.theme).toStrictEqual({
				...merged,
				name: config.name,
			});
		});

		it('can select layoutOptions', () => {
			const bpIndex = 0;
			const config = {
				name: 'global',
				type: 'local' as TemplateThemeTypes,
				base: baseTheme,
				overrides: {},
				variables: {},
				currency: {},
				language: {},
				innerWidth: 0,
				style: () => ({}),
			};

			const store = new ThemeStore(config, dependencies, settings);

			const layoutOptions = config.base.responsive?.[bpIndex].layoutOptions || config.base.layoutOptions;
			const layoutOptionDefault = layoutOptions?.find((option) => option.default);
			const layoutOptionNotDefault = layoutOptions?.find((option) => !option.default);

			if (!layoutOptionNotDefault || !layoutOptionDefault) {
				// skip if theme does not have any layoutOptions
				return;
			}

			expect(store.layout.selected).toStrictEqual(undefined);

			store.layout.select(layoutOptionNotDefault!);
			expect(store.layout.selected).toStrictEqual(layoutOptionNotDefault);
		});
	});
});
