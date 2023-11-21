import { observable, makeObservable } from 'mobx';
import { TemplateTarget } from './TemplateStore';
import { GLOBAL_THEME_NAME } from '../SnapTemplate';
import { StorageStore } from '@searchspring/snap-store-mobx';

export type TemplateThemeLocation = 'library' | 'local';

export class TargetStore {
	public selector: string;
	public template: string;
	public theme: {
		location: TemplateThemeLocation;
		name: string;
	};
	private dependencies: { storage: StorageStore };

	constructor(template: TemplateTarget, location: TemplateThemeLocation, dependencies: { storage: StorageStore }) {
		this.dependencies = dependencies;
		this.selector = template.selector || '';
		this.template = this.dependencies.storage.get(`templates.${this.selector}.template`) || template.template;
		this.theme = this.dependencies.storage.get(`templates.${this.selector}.theme`) || {
			location,
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

	public setTheme(themeName: string, location: TemplateThemeLocation) {
		this.theme = {
			location,
			name: themeName,
		};
		this.dependencies.storage.set(`templates.${this.selector}.theme`, this.theme);
	}
}
