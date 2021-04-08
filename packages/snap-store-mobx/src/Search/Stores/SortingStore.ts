import { observable, computed, makeObservable } from 'mobx';

export class SortingStore {
	private controller;
	options: Option[] = [];

	constructor(controller, sorting, meta) {
		if (controller && meta) {
			this.controller = controller;
			const activeSort = sorting && sorting.length && sorting[0];

			this.options =
				meta &&
				meta.sortOptions &&
				meta.sortOptions.map((option, index) => {
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

					const optionObj = new Option(controller, option);

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

	constructor(controller, option) {
		this.active = option.active;
		this.default = option.default;
		this.field = option.field;
		this.label = option.label;
		this.direction = option.direction;
		this.type = option.type;
		this.value = `${option.field}:${option.direction}`;

		if (this.default) {
			this.url = controller.urlManager.remove('page').remove('sort');
		} else {
			this.url = controller.urlManager.remove('page').set('sort', [{ field: this.field, direction: this.direction }]);
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
