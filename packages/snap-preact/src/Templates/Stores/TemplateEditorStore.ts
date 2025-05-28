import { StorageStore, StorageType } from '@searchspring/snap-store-mobx';
import { observable, makeObservable } from 'mobx';

export type Tabs = 'Templates' | 'Configuration';
export class TemplateEditorStore {
	storage: StorageStore;

	tabs: Tabs[] = ['Templates', 'Configuration'];
	activeTab: Tabs = 'Configuration';

	constructor() {
		this.storage = new StorageStore({ type: StorageType.local, key: 'ss-template-editor' });

		/*

            
        
        */

		// view: string
		// tabs []
		// activeTab: string
		// contentSelector: string
		// autocompleteSelector: string
		// componentSelector: string

		makeObservable(this, {
			activeTab: observable,
		});
	}

	switchTabs(tab: Tabs) {
		this.activeTab = tab;
	}
}
