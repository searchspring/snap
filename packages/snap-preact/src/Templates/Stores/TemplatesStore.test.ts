import { TemplatesStore } from './TemplateStore';
import type { SnapTemplatesConfig } from '../SnapTemplates';
import { GLOBAL_THEME_NAME } from './TargetStore';

describe('TemplateStore', () => {
	it('has expected defaults', () => {
		const config: SnapTemplatesConfig = {
			config: {
				platform: 'other',
			},
			themes: {
				global: {
					extends: 'bocachica',
				},
			},
		};
		const store = new TemplatesStore({ config, settings: { editMode: true } });
		expect(store).toBeDefined();
		expect(store.loading).toBe(true);
		expect(store.config).toBe(config);
		expect(store.language).toBe('en');
		expect(store.currency).toBe('usd');
		expect(store.settings).toStrictEqual({ editMode: true });
		expect(store.window.innerWidth).toBe(global.window.innerWidth);
	});

	it('can define config', () => {
		const config: SnapTemplatesConfig = {
			themes: {
				global: {
					extends: 'bocachica',
				},
			},
			config: {
				siteId: '8uyt2m',
				currency: 'eur',
				platform: 'other',
				language: 'fr',
			},
		};
		const store = new TemplatesStore({ config });
		expect(store.config).toBe(config);
		expect(store.language).toBe(config.config?.language);
		expect(store.currency).toBe(config.config?.currency);
	});

	it("fallsback if language and currency doesn't exist", () => {
		const config: SnapTemplatesConfig = {
			themes: {
				global: {
					extends: 'bocachica',
				},
			},
			config: {
				siteId: '8uyt2m',
				// @ts-ignore - testing invalid values
				currency: 'dne',
				// @ts-ignore - testing invalid values
				language: 'dne',
			},
		};
		const store = new TemplatesStore({ config });
		expect(store.config).toBe(config);
		expect(store.language).toBe('en');
		expect(store.currency).toBe('usd');
	});

	it('can change language and currency', async () => {
		const config: SnapTemplatesConfig = {
			themes: {
				global: {
					extends: 'bocachica',
				},
			},
			config: {
				siteId: '8uyt2m',
				platform: 'other',
			},
		};
		const store = new TemplatesStore({ config });
		expect(store.language).toBe('en');
		expect(store.currency).toBe('usd');

		await store.setLanguage('fr');
		await store.setCurrency('eur');

		expect(store.language).toBe('fr');
		expect(store.currency).toBe('eur');
	});

	it('can change innerWidth', () => {
		const config: SnapTemplatesConfig = {
			themes: {
				global: {
					extends: 'bocachica',
				},
			},
			config: {
				siteId: '8uyt2m',
				platform: 'other',
			},
		};
		const store = new TemplatesStore({ config });
		expect(store.window.innerWidth).toBe(global.window.innerWidth);

		const width = 1000;
		// @ts-ignore - private method
		store.setInnerWidth(width);

		expect(store.window.innerWidth).toBe(width);
	});

	it('can addTheme', async () => {
		const theme = GLOBAL_THEME_NAME;
		const config: SnapTemplatesConfig = {
			config: {
				platform: 'other',
			},
			themes: {
				[theme]: {
					extends: 'bocachica',
				},
			},
		};
		const store = new TemplatesStore({ config });

		// addTheme from config
		const spy = jest.spyOn(store, 'addTheme');
		expect(store.library.import.theme[config.themes[theme].extends]).toBeDefined();
		expect(store.library.themes[config.themes[theme].extends]).toBeUndefined();
		expect(spy).toHaveBeenCalledTimes(0);
		await wait(100);
		expect(store.library.themes[config.themes[theme].extends]).toBeDefined();
		expect(spy).toHaveBeenCalledTimes(1);

		expect(store.themes.local[theme]).toBeDefined();
		expect(store.getThemeStore(theme)).toBe(store.themes.local[theme]);
		const storeTheme = store.getThemeStore(theme);
		expect(storeTheme?.name).toBe(theme);
		// @ts-ignore - private property
		expect(storeTheme.base.name).toBe(config.themes[theme].extends);
		spy.mockClear();

		// addTheme manual call
		const base = await store.library.import.theme.bocachica();
		const customTheme = 'customTheme';

		store.addTheme({
			name: customTheme,
			type: 'local',
			base,
			overrides: {},
			variables: {},
			currency: {},
			language: {},
			languageOverrides: {},
			innerWidth: store.window.innerWidth,
			style: undefined,
		});
		expect(store.themes.local[customTheme]).toBeDefined();
		expect(store.getThemeStore(customTheme)).toBe(store.themes.local[customTheme]);
		const newTheme = store.getThemeStore(customTheme);
		expect(newTheme?.name).toBe(customTheme);
		// @ts-ignore - private property
		expect(newTheme.base.name).toBe('bocachica');
	});

	it('can addTarget', async () => {
		const theme = GLOBAL_THEME_NAME;
		const config: SnapTemplatesConfig = {
			config: {
				platform: 'other',
			},
			themes: {
				[theme]: {
					extends: 'bocachica',
				},
			},
		};
		const store = new TemplatesStore({ config });
		const type = 'search';
		const target = {
			selector: '.test',
			theme: GLOBAL_THEME_NAME,
			component: 'Search',
			resultComponent: 'Result',
		};
		const targetId = store.addTarget(type, target);
		expect(targetId).toBeDefined();
		expect([target.selector, target.component]).toContain(targetId);
		expect(store.targets[type][targetId!]).toBeDefined();
		expect(store.getTarget(type, targetId!)).toBe(store.targets[type][targetId!]);
	});
});

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};
