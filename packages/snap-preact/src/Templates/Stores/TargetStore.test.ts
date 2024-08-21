import { StorageStore } from '@searchspring/snap-store-mobx';
import { TargetStore } from './TargetStore';
import { TemplatesStoreDependencies, TemplatesStoreSettings, TemplateThemeTypes } from './TemplateStore';

describe('TargetStore', () => {
	let dependencies: TemplatesStoreDependencies;
	let settings: TemplatesStoreSettings;

	beforeEach(() => {
		dependencies = {
			storage: new StorageStore(),
		};
		settings = {
			editMode: false,
		};
	});

	it('has expected defaults', () => {
		const template = {
			component: '',
		};
		const store = new TargetStore(template, dependencies, settings);
		expect(store).toBeDefined();
		expect(store.selector).toStrictEqual('');
		expect(store.component).toStrictEqual('');
		expect(store.resultComponent).toBeUndefined();
		expect(store.theme).toStrictEqual({
			location: 'local',
			name: 'global',
		});
		// @ts-ignore - private property
		expect(store.dependencies).toBe(dependencies);
	});

	it('can create a TargetStore', () => {
		const template = {
			selector: '.test',
			theme: 'customTheme',
			component: 'Search',
			resultComponent: 'CustomResult',
		};
		const store = new TargetStore(template, dependencies, settings);
		expect(store).toBeDefined();
		expect(store.selector).toStrictEqual(template.selector);
		expect(store.component).toStrictEqual(template.component);
		expect(store.resultComponent).toStrictEqual(template.resultComponent);
		expect(store.theme).toStrictEqual({
			location: 'local',
			name: template.theme,
		});
	});

	it('can setComponent, setResultComponent, setTheme', () => {
		const template = {
			selector: '.test',
			theme: 'customTheme',
			component: 'Search',
			resultComponent: 'CustomResult',
		};
		const store = new TargetStore(template, dependencies, settings);

		store.setComponent('NewSearch');
		expect(store.component).toStrictEqual('NewSearch');

		store.setResultComponent('NewResult');
		expect(store.resultComponent).toStrictEqual('NewResult');

		store.setTheme('newTheme', 'local' as TemplateThemeTypes);
		expect(store.theme).toStrictEqual({
			location: 'local',
			name: 'newTheme',
		});
	});
});
