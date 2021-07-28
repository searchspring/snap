import { makeObservable, observable, toJS, configure } from 'mobx';

configure({
	// useProxies: "never",  // for IE 11 (es5) support
	enforceActions: 'never',
});

export abstract class AbstractStore {
	protected controller;
	public custom = {};
	public loading = true;
	public loaded = false;

	constructor() {
		makeObservable(this, {
			custom: observable,
			loading: observable,
			loaded: observable,
		});
	}

	abstract update(data): void;

	toJSON(thing: any = this) {
		const obj: any = {
			...toJS(thing),
		};

		try {
			// mobX toJS does not serialize computed properties and methods, add a reference manually
			const facetProperties = ['refinedValues', 'clear', 'toggleCollapse'];
			obj?.facets?.forEach((facet, index) => {
				facetProperties.forEach((property) => {
					if (thing.hasOwnProperty('facets') && thing?.facets[index][property]) {
						obj.facets[index][property] = thing.facets[index][property];
					}
				});
			});

			const paginationProperties = [
				'begin',
				'end',
				'totalPages',
				'multiplePages',
				'current',
				'first',
				'last',
				'next',
				'previous',
				'getPages',
				'setPageSize',
			];
			paginationProperties.forEach((property) => {
				if (thing.hasOwnProperty('pagination') && thing?.pagination[property]) {
					obj.pagination[property] = thing.pagination[property];
				}
			});

			const sortingProperties = ['current'];
			sortingProperties.forEach((property) => {
				if (thing.hasOwnProperty('sorting') && thing?.sorting[property]) {
					obj.sorting[property] = thing.sorting[property];
				}
			});

			const stateProperties = ['clear'];
			stateProperties.forEach((property) => {
				if (thing.hasOwnProperty('state') && thing?.state[property]) {
					obj.state[property] = thing.state[property];
				}
			});

			const stateLocksProperties = ['reset', 'lock', 'locked', 'unlock'];
			stateLocksProperties.forEach((property) => {
				if (thing?.state?.locks.terms[property]) {
					obj.state.locks.terms[property] = thing.state.locks.terms[property];
				}
				if (thing?.state?.locks.facets[property]) {
					obj.state.locks.facets[property] = thing.state.locks.facets[property];
				}
			});

			const storageProperties = ['set', 'get', 'clear'];
			storageProperties.forEach((property) => {
				if (thing.hasOwnProperty('storage') && thing?.storage[property]) {
					obj.storage[property] = thing.storage[property];
				}
			});

			const selectionProperties = ['select'];
			obj?.selections?.forEach((selection, index) => {
				selectionProperties.forEach((property) => {
					if (thing.hasOwnProperty('selections') && thing?.selections[index][property]) {
						obj.selections[index][property] = thing.selections[index][property];
					}
				});
			});
		} catch (e) {
			console.log(e);
			console.log(
				`toJSON encountered an error attempting to add references to computed properties or methods. Falling back to JSON without computed properties or methods:`
			);
			return toJS(thing);
		}

		return obj;
	}
}
