import { TemplatesStore } from './TemplateStore';
import { StorageStore } from '@searchspring/snap-store-mobx';
import type { SnapTemplatesConfig } from '../SnapTemplate';

describe('TemplateStore', () => {
	// const config: SnapTemplatesConfig = {
	//     // components: {},
	//     // config: {
	//     //     siteId: '8uyt2m',
	//     //     currency: 'USD',
	//     //     language: 'en',
	//     // },
	//     themes: {
	//         global: {
	//             extends: 'bocachica',
	//             // style: '',
	//             // variables: {},
	//             // overrides: {},
	//         },
	//     }
	// }
	it('has expected defaults', () => {
		const config: SnapTemplatesConfig = {
			themes: {
				global: {
					extends: 'bocachica',
				},
			},
		};
		const store = new TemplatesStore(config, { editMode: true });
		expect(store).toBeDefined();
		expect(store.loading).toBe(false);
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
				language: 'fr',
			},
		};
		const store = new TemplatesStore(config);
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
				currency: 'dne',
				language: 'dne',
			},
		};
		const store = new TemplatesStore(config);
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
			},
		};
		const store = new TemplatesStore(config);
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
			},
		};
		const store = new TemplatesStore(config);
		expect(store.window.innerWidth).toBe(global.window.innerWidth);

		const width = 1000;
		// @ts-ignore - private method
		store.setInnerWidth(width);

		expect(store.window.innerWidth).toBe(width);
	});

	it('can addTheme', async () => {
		const theme = 'global';
		const config: SnapTemplatesConfig = {
			themes: {
				[theme]: {
					extends: 'bocachica',
				},
			},
		};
		const store = new TemplatesStore(config);

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
		const theme = 'global';
		const config: SnapTemplatesConfig = {
			themes: {
				[theme]: {
					extends: 'bocachica',
				},
			},
		};
		const store = new TemplatesStore(config);
		const type = 'search';
		const templateTarget = {
			selector: '.test',
			theme: 'global',
			component: 'Search',
			resultComponent: 'Result',
		};
		const targetId = store.addTarget(type, templateTarget);
		expect(targetId).toBeDefined();
		expect([templateTarget.selector, templateTarget.component]).toContain(targetId);
		expect(store.targets[type][targetId!]).toBeDefined();
		expect(store.getTarget(type, targetId!)).toBe(store.targets[type][targetId!]);
	});
});

const wait = (time = 1) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};
