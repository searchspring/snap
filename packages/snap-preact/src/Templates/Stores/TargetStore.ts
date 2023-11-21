import { observable, makeObservable } from 'mobx';
import { TemplateTarget } from './TemplateStore';
import { GLOBAL_THEME_NAME } from '../SnapTemplate';

export type TemplateThemeLocation = 'library' | 'local';

export class TargetStore {
	public template: string;
	public selector: string;
	public theme: {
		location: TemplateThemeLocation;
		name: string;
	};

	constructor(template: TemplateTarget, location: TemplateThemeLocation) {
		this.template = template.template;
		this.selector = template.selector || '';
		this.theme = {
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
	}

	public setTheme(themeName: string, location: TemplateThemeLocation) {
		this.theme = {
			location,
			name: themeName,
		};
	}
}
