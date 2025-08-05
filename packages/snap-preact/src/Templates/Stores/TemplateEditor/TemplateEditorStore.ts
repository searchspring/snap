import { AutocompleteStoreConfigSettings, SearchStoreConfigSettings, StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { observable, makeObservable } from 'mobx';

import deepmerge from 'deepmerge';
import { TemplatesStore, TEMPLATE_STORE_KEY, TargetMap, RecsTemplateTypes } from '../TemplateStore';
import { ThemeStore } from '../ThemeStore';
import { AutocompleteController, SearchController } from '@searchspring/snap-controller';

import type { AbstractionGroup } from '../../../types';
import { ThemeVariablesPartial } from '../../../../components/src';
import { TargetStore } from '../TargetStore';
import { AutocompleteTargetConfig, SearchTargetConfig, SnapTemplatesConfig } from '../../SnapTemplates';
import { searchControllerUI } from './uiAbstractions/searchControllerUI';
import { autocompleteControllerUI, updateAutocompleteControllerState } from './uiAbstractions/autocompleteControllerUI';

export type EditorTabs = 'templates' | 'configuration';

type EditorState = {
	hidden: boolean;
	activeTab: EditorTabs;
};

type EditorControllerConfigs = {
	search?: SearchStoreConfigSettings;
	autocomplete?: AutocompleteStoreConfigSettings;
};

type EditorThemeConfig = {
	extends?: string;
	variables?: ThemeVariablesPartial;
};

export class TemplateEditorStore {
	storage: StorageStore;
	state: EditorState = {
		hidden: false,
		activeTab: 'templates',
	};
	overrides: {
		controller: EditorControllerConfigs;
		theme: EditorThemeConfig;
	} = {
		controller: {},
		theme: {},
	};
	initial: {
		controller: EditorControllerConfigs;
		theme: EditorThemeConfig;
		config: SnapTemplatesConfig['config'];
	} = {
		controller: {},
		theme: {},
		config: {},
	};

	tabs: EditorTabs[] = ['templates', 'configuration'];

	templatesStore: TemplatesStore;

	uiAbstractions: {
		controllers: {
			search: AbstractionGroup<SearchController>[];
			autocomplete: AbstractionGroup<AutocompleteController>[];
		};
	} = {
		controllers: {
			search: searchControllerUI(this),
			autocomplete: autocompleteControllerUI(this),
		},
	};

	constructor({ templatesStore }: { templatesStore: TemplatesStore }) {
		this.templatesStore = templatesStore;
		this.storage = new StorageStore({ type: StorageType.local, key: TEMPLATE_STORE_KEY });
		this.state = this.storage.get('editor') || this.state;
		this.overrides = this.storage.get('overrides') || this.overrides;
		this.overrides.controller = this.overrides.controller || {};
		this.initial.config = JSON.parse(JSON.stringify(templatesStore.config.config || {})) as SnapTemplatesConfig['config'];
		this.initial.controller = {}; // set when registering controllers

		const themeConfig = JSON.parse(JSON.stringify(templatesStore.config.theme || {})) as SnapTemplatesConfig['theme'];
		delete themeConfig.style;
		this.initial.theme = themeConfig;

		this.storage.set('initial', this.initial);

		makeObservable(this, {
			state: observable,
			overrides: observable,
			initial: observable,
			uiAbstractions: observable,
		});
	}

	switchTabs(tab: EditorTabs) {
		this.state.activeTab = tab;
		this.storage.set('editor', this.state);
	}

	toggleHide(hide: boolean) {
		this.state.hidden = hide;
		this.storage.set('editor', this.state);
	}

	setTheme(type: 'local' | 'library', themeName: string) {
		const theme = this.templatesStore.themes[type][themeName];
		this.overrides.theme.extends = themeName;
		this.storage.set('overrides.theme.extends', this.overrides.theme.extends);

		// update the newly selected theme store with the overrides
		theme.setEditorOverrides({ variables: this.overrides.theme.variables || {} });

		// loop through all targets in templateStore and call setTheme on them all
		Object.keys(this.templatesStore.targets).forEach((feature) => {
			// loop through all the features (search, autocomplete, recommendations)
			if (feature == 'recommendation') {
				const recommendationObj = this.templatesStore.targets[feature as keyof typeof this.templatesStore.targets] as {
					[key in RecsTemplateTypes]: TargetMap;
				};
				Object.keys(recommendationObj).forEach((recType) => {
					const targetMap = recommendationObj[recType as keyof typeof recommendationObj];
					Object.keys(targetMap).forEach((target) => {
						const targetStore = targetMap[target as keyof typeof targetMap] as TargetStore;
						targetStore.setTheme(themeName, type);
					});
				});
			} else {
				const targetMap = this.templatesStore.targets[feature as keyof typeof this.templatesStore.targets] as TargetMap;
				Object.keys(targetMap).forEach((target) => {
					const targetStore = targetMap[target as keyof typeof targetMap] as TargetStore;
					targetStore.setTheme(themeName, type);
				});
			}
		});
	}

	resetThemeConfig(themeRef: ThemeStore) {
		this.overrides.theme = this.overrides.theme || {};
		delete this.overrides.theme.variables;
		this.storage.set('overrides.theme', this.overrides.theme);
		themeRef.setEditorOverrides({ variables: this.overrides.theme.variables || {} });
	}

	resetThemeConfigPath(obj: { path: string[]; rootEditingKey: string }, themeRef: ThemeStore) {
		const { path, rootEditingKey } = obj;

		let themeConfigOverrides = this.overrides.theme[rootEditingKey as keyof typeof this.overrides.theme] as any;

		path.forEach((p, i) => {
			if (i === path.length - 1) {
				delete themeConfigOverrides[p];
			} else {
				themeConfigOverrides = themeConfigOverrides[p];
			}
		});

		this.storage.set('overrides.theme', this.overrides.theme);

		themeRef.setEditorOverrides({ variables: this.overrides.theme.variables || {} });
	}

	setThemeConfigPath(obj: { path: string[]; value: unknown }, themeRef: ThemeStore) {
		const { path, value } = obj;
		const themeConfigOverrides = {
			variables: path
				.slice()
				.reverse()
				.reduce((res, key) => {
					if (path.indexOf(key) === path.length - 1) {
						return {
							[key]: value,
						};
					}
					return {
						[key]: res,
					};
				}, {}),
		};
		this.overrides.theme = deepmerge(this.overrides.theme, themeConfigOverrides);
		this.storage.set('overrides.theme', this.overrides.theme);
		themeRef.setEditorOverrides({ variables: this.overrides.theme.variables || {} });
	}

	setControllerOverride<ControllerType extends SearchController | AutocompleteController>(obj: {
		path: string[];
		value?: unknown;
		controller: ControllerType;
	}) {
		const { path, value, controller } = obj;
		const type = controller.type as keyof EditorControllerConfigs;

		const controllerOverrides = {
			[type]: path
				.slice()
				.reverse()
				.reduce((res, key) => {
					if (path.indexOf(key) === path.length - 1) {
						return {
							[key]: value,
						};
					}
					return {
						[key]: res,
					};
				}, {}),
		};

		this.overrides.controller = deepmerge(this.overrides.controller || {}, controllerOverrides);

		// recursively remove empty objects and undefined values from this.overrides.controller
		this.overrides.controller = removeEmptyObjects(this.overrides.controller);

		this.storage.set(`overrides.controller.${type}`, this.overrides.controller[type]);

		const mergedConfig = deepmerge<any>(
			{
				settings: this.initial.controller[type] || {},
			},
			{
				settings: this.overrides.controller[type] || {},
			}
		);

		controller?.setConfig(mergedConfig);
	}

	registerController<ControllerType extends SearchController | AutocompleteController>(controller: ControllerType) {
		const settingsCopy = JSON.parse(JSON.stringify(controller.config.settings)) as SearchStoreConfigSettings | AutocompleteStoreConfigSettings;

		const type = controller.type as keyof EditorControllerConfigs;

		this.initial.controller[type] = settingsCopy;

		this.storage.set(`initial.controller.${type}`, this.initial.controller[type]);

		const mergedConfig = deepmerge<any>(controller.config, {
			settings: this.overrides.controller[type] || {},
		});

		controller.setConfig(mergedConfig);

		if (type === 'autocomplete') {
			updateAutocompleteControllerState(controller as AutocompleteController);
		}
	}

	getTargets() {
		const storeTargets = this.templatesStore.targets;
		const searchTargets = Object.keys(storeTargets.search || {}).map((target) => ({
			type: 'search',
			target,
			template: storeTargets.search[target],
			selector: storeTargets.search[target].selector,
		}));
		const autocompleteTargets = Object.keys(storeTargets.autocomplete || {}).map((target) => ({
			type: 'autocomplete',
			target,
			template: storeTargets.autocomplete[target],
			selector: storeTargets.autocomplete[target].selector,
		}));
		const recommendationBundleTargets = Object.keys(storeTargets.recommendation.bundle || {}).map((target) => ({
			type: 'recommendation/bundle',
			target,
			template: storeTargets.recommendation.bundle[target],
			selector: storeTargets.recommendation.bundle[target].selector,
		}));
		const recommendationDefaultTargets = Object.keys(storeTargets.recommendation.default || {}).map((target) => ({
			type: 'recommendation/default',
			target,
			template: storeTargets.recommendation.default[target],
			selector: storeTargets.recommendation.default[target].selector,
		}));
		const recommendationEmailTargets = Object.keys(storeTargets.recommendation.email || {}).map((target) => ({
			type: 'recommendation/email',
			target,
			template: storeTargets.recommendation.email[target],
			selector: storeTargets.recommendation.email[target].selector,
		}));
		const targets = [
			...searchTargets,
			...autocompleteTargets,
			...recommendationBundleTargets,
			...recommendationDefaultTargets,
			...recommendationEmailTargets,
		];

		return targets;
	}

	generateTemplatesConfig(): SnapTemplatesConfig {
		const originalConfig = JSON.parse(JSON.stringify(this.templatesStore.config)) as SnapTemplatesConfig;
		delete originalConfig.search;
		delete originalConfig.autocomplete;
		delete originalConfig.recommendation;
		delete originalConfig.components;

		const storageConfigData = (this.storage.get('config') || {}) as SnapTemplatesConfig['config'];
		const themeConfigData = (this.storage.get('overrides.theme') || {}) as SnapTemplatesConfig['theme'];
		const overrideConfig: SnapTemplatesConfig = { config: storageConfigData, theme: themeConfigData };

		const targets = this.getTargets();
		const searchTargets = targets
			.filter((target) => target.type === 'search')
			.map(
				(target) =>
					({
						selector: target.selector,
						component: target.template.component,
						resultComponent: target.template.resultComponent,
					} as SearchTargetConfig)
			);
		const autocompleteTargets = targets
			.filter((target) => target.type === 'autocomplete')
			.map(
				(target) =>
					({
						selector: target.selector,
						component: target.template.component,
						resultComponent: target.template.resultComponent,
					} as AutocompleteTargetConfig)
			);

		// add search controller settings
		if (searchTargets.length) {
			overrideConfig.search = {
				targets: searchTargets,
				settings: this.overrides.controller.search || {},
			};
		}

		// add autocomplete controller settings
		if (autocompleteTargets.length) {
			overrideConfig.autocomplete = {
				targets: autocompleteTargets,
				settings: this.overrides.controller.autocomplete || {},
			};
		}

		const config: SnapTemplatesConfig = deepmerge(originalConfig, overrideConfig);

		return config;
	}
}

function removeEmptyObjects(controller: EditorControllerConfigs): EditorControllerConfigs {
	// Create a recursive cleaning function that works with any object
	const cleanObj = (obj: any): any => {
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}

		const result: Record<string, any> = {};

		Object.entries(obj).forEach(([key, value]) => {
			// Skip undefined values
			if (value === undefined) return;

			if (value !== null && typeof value === 'object') {
				// Recursively clean nested objects
				const cleanedValue = cleanObj(value);

				// Only add non-empty objects
				if (Object.keys(cleanedValue).length > 0) {
					result[key] = cleanedValue;
				}
			} else {
				// Keep non-object values
				result[key] = value;
			}
		});

		return result;
	};

	// Apply the cleaning function to our controller object
	return cleanObj(controller);
}
