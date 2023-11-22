import { observable, makeObservable } from 'mobx';
import { TemplateTarget, type TemplatesStoreSettings, type TemplatesStoreDependencies, type TemplateThemeTypes } from './TemplateStore';
import { GLOBAL_THEME_NAME } from '../SnapTemplate';

export class TargetStore {
	public selector: string;
	public template: string;
	public theme: {
		location: TemplateThemeTypes;
		name: string;
	};
	private dependencies: TemplatesStoreDependencies;

	constructor(template: TemplateTarget, dependencies: TemplatesStoreDependencies, settings: TemplatesStoreSettings) {
		this.dependencies = dependencies;
		this.selector = template.component ? `.ss__recommendation-${template.component}` : template.selector || '';
		this.template = (settings.editMode && this.dependencies.storage.get(`templates.${this.selector}.template`)) || template.template;
		this.theme = (settings.editMode && this.dependencies.storage.get(`templates.${this.selector}.theme`)) || {
			location: 'local',
			name: template.theme || GLOBAL_THEME_NAME,
		};

		makeObservable(this, {
			template: observable,
			selector: observable,
			theme: observable,
		});
	}

	public setTemplate(templateName: string) {
		this.template = templateName;
		this.dependencies.storage.set(`templates.${this.selector}.template`, this.template);
	}

	public setTheme(themeName: string, location: TemplateThemeTypes) {
		this.theme = {
			location,
			name: themeName,
		};
		this.dependencies.storage.set(`templates.${this.selector}.theme`, this.theme);
	}
}
