import { observable, computed, makeObservable } from 'mobx';

export class SortingStore {
	options: Option[] = [];

	constructor(services, sorting, search, meta) {
		if (services && meta) {
			const activeSort = sorting && sorting.length && sorting[0];

			this.options =
				meta.sortOptions &&
				meta.sortOptions
					.filter((option) => {
						if (!search?.query) {
							return option.type == 'field';
						}

						return option;
					})
					.map((option, index) => {
						option.active = false;

						if (activeSort && activeSort.field == option.field && activeSort.direction == option.direction) {
							option.active = true;
						} else if (index === 0) {
							option.active = true;
						}

						if (index === 0) {
							// is the default sort
							option.default = true;
						}

						const optionObj = new Option(services, option);

						return optionObj;
					});

			makeObservable(this, {
				options: observable,
				current: computed,
			});
		}
	}

	get current(): Option {
		return this.options.filter((option) => option.active).pop();
	}
}

class Option {
	active: boolean;
	default: false;
	field: string;
	label: string;
	direction: string;
	type: string;
	value: string;
	url;

	constructor(services, option) {
		this.active = option.active;
		this.default = option.default;
		this.field = option.field;
		this.label = option.label;
		this.direction = option.direction;
		this.type = option.type;
		this.value = `${option.field}:${option.direction}`;

		if (this.default) {
			this.url = services.urlManager.remove('page').remove('sort');
		} else {
			this.url = services.urlManager.remove('page').set('sort', [{ field: this.field, direction: this.direction }]);
		}

		makeObservable(this, {
			field: observable,
			label: observable,
			direction: observable,
			type: observable,
			value: observable,
		});
	}
}
