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
		const target = {
			component: '',
		};
		const store = new TargetStore({ target, dependencies, settings });
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
		const target = {
			selector: '.test',
			theme: 'customTheme',
			component: 'Search',
			resultComponent: 'CustomResult',
		};
		const store = new TargetStore({ target, dependencies, settings });
		expect(store).toBeDefined();
		expect(store.selector).toStrictEqual(target.selector);
		expect(store.component).toStrictEqual(target.component);
		expect(store.resultComponent).toStrictEqual(target.resultComponent);
		expect(store.theme).toStrictEqual({
			location: 'local',
			name: target.theme,
		});
	});

	it('can setComponent, setResultComponent, setTheme', () => {
		const target = {
			selector: '.test',
			theme: 'customTheme',
			component: 'Search',
			resultComponent: 'CustomResult',
		};
		const store = new TargetStore({ target, dependencies, settings });

		expect(store.component).toStrictEqual('Search');
		store.setComponent('NewSearch');
		expect(store.component).toStrictEqual('NewSearch');

		expect(store.resultComponent).toStrictEqual('CustomResult');
		store.setResultComponent('NewResult');
		expect(store.resultComponent).toStrictEqual('NewResult');

		expect(store.theme).toStrictEqual({
			location: 'local',
			name: 'customTheme',
		});
		store.setTheme('newTheme', 'local' as TemplateThemeTypes);
		expect(store.theme).toStrictEqual({
			location: 'local',
			name: 'newTheme',
		});
	});
});
