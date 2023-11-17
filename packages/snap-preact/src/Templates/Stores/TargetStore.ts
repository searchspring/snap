import { observable, makeObservable } from 'mobx';
import { TemplateTarget, GLOBAL_THEME_NAME } from './TemplateStore';

export type TargetLocation = 'library' | 'local';
export class TargetStore {
	public template: string;
	public selector: string;
	public component: string;
	public theme: {
		location: TargetLocation;
		name: string;
	};

	constructor(template: TemplateTarget, location: TargetLocation) {
		this.template = template.template;
		this.selector = template.selector || '';
		this.component = template.component || '';
		this.theme = {
			location,
			name: template.theme || GLOBAL_THEME_NAME,
		};

		makeObservable(this, {
			template: observable,
			selector: observable,
			component: observable,
			theme: observable,
		});
	}

	public setTemplate(templateName: string) {
		this.template = templateName;
	}

	public setTheme(themeName: string, location: TargetLocation) {
		this.theme = {
			location,
			name: themeName,
		};
	}
}
