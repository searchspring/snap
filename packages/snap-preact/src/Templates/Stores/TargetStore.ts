import { observable, makeObservable } from 'mobx';
import { TemplateTarget, type TemplatesStoreSettings, type TemplatesStoreDependencies, type TemplateThemeTypes } from './TemplateStore';

const GLOBAL_THEME_NAME = 'global';

export class TargetStore {
	public selector: string;
	public component: string;
	public resultComponent: string;
	public theme: {
		location: TemplateThemeTypes;
		name: string;
	};
	private dependencies: TemplatesStoreDependencies;

	constructor(template: TemplateTarget, dependencies: TemplatesStoreDependencies, settings: TemplatesStoreSettings) {
		this.dependencies = dependencies;
		this.selector = template.selector || '';
		this.component = (settings.editMode && this.dependencies.storage.get(`templates.${this.selector}.component`)) || template.component;
		this.resultComponent =
			(settings.editMode && this.dependencies.storage.get(`templates.${this.selector}.resultComponent`)) || template.resultComponent;
		this.theme = (settings.editMode && this.dependencies.storage.get(`templates.${this.selector}.theme`)) || {
			location: 'local',
			name: template.theme || GLOBAL_THEME_NAME,
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
