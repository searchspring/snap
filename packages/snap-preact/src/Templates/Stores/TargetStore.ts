import { observable, makeObservable } from 'mobx';
import { TemplateTarget, type TemplatesStoreConfigSettings, type TemplatesStoreDependencies, type TemplateThemeTypes } from './TemplateStore';

export const GLOBAL_THEME_NAME = 'global';

type TargetStoreConfig = {
	target: TemplateTarget;
	dependencies: TemplatesStoreDependencies;
	settings: TemplatesStoreConfigSettings;
};
export class TargetStore {
	public selector: string;
	public component: string;
	public resultComponent: string;
	public theme: {
		location: TemplateThemeTypes;
		name: string;
	};
	private dependencies: TemplatesStoreDependencies;

	constructor(params: TargetStoreConfig) {
		const { target, dependencies, settings } = params;
		this.dependencies = dependencies;
		this.selector = target.selector || '';
		this.component = (settings.editMode && this.dependencies.storage.get(`templates.${this.selector}.component`)) || target.component;
		this.resultComponent =
			(settings.editMode && this.dependencies.storage.get(`templates.${this.selector}.resultComponent`)) || target.resultComponent;
		this.theme = (settings.editMode && this.dependencies.storage.get(`templates.${this.selector}.theme`)) || {
			location: 'local',
			name: target.theme || GLOBAL_THEME_NAME,
		};

		makeObservable(this, {
			component: observable,
			resultComponent: observable,
			selector: observable,
			theme: observable,
		});
	}

	public setComponent(componentName: string) {
		this.component = componentName;
		this.dependencies.storage.set(`templates.${this.selector}.component`, this.component);
	}

	public setResultComponent(resultComponentName: string) {
		this.resultComponent = resultComponentName;
		this.dependencies.storage.set(`templates.${this.selector}.resultComponent`, this.resultComponent);
	}

	public setTheme(themeName: string, location: TemplateThemeTypes) {
		this.theme = {
			location,
			name: themeName,
		};
		this.dependencies.storage.set(`templates.${this.selector}.theme`, this.theme);
	}
}
