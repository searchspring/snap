import { makeObservable, observable } from 'mobx';
import { AbstractStore } from '../Abstract/AbstractStore';
import { PaginationStore } from '../Search/Stores';
import { StorageStore } from '../Storage/StorageStore';
import { SelectionStore } from './Stores';
export class FinderStore extends AbstractStore {
	meta = {};
	storage: StorageStore;
	pagination: PaginationStore;
	selections: SelectionStore[];

	constructor() {
		super();
		this.storage = new StorageStore();
		this.update({ meta: {}, selections: [] });

		makeObservable(this, {
			selections: observable,
			pagination: observable,
		});
	}

	update(data): void {
		this.loaded = !!data.pagination;
		this.meta = data.meta;
		this.pagination = new PaginationStore(this.controller, data.pagination);
		this.selections = new SelectionStore(this.controller, data.facets, this.storage);
	}
}
