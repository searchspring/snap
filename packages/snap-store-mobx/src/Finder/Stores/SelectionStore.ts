export class SelectionStore extends Array {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(config, services, facets, meta, loading, storage) {
		if (!facets || !meta) {
			return;
		}
		const selections = [];
		config?.fields?.forEach((fieldObj) => {
			let facet = facets?.filter((facet) => facet.field == fieldObj.field).pop();

			facet = {
				...meta?.facets[fieldObj.field],
				...facet,
			};

			const isHierarchy = facet.display === 'hierarchy';
			if (isHierarchy) {
				// filter out history/current hierarchy values
				const filtered = facet.filtered && facet.values.filter((value) => value.filtered).pop();

				if (filtered) {
					const filteredLevel = filtered.value.split(facet.hierarchyDelimiter).length;

					facet.values = facet.values.filter((value, index) => {
						return (value.value && value.value.split(facet.hierarchyDelimiter).length > filteredLevel) || index == facet.values.length - 1;
					});
				}

				const levels = fieldObj?.levels || facet?.values[facet?.values.length - 1]?.value.split(facet.hierarchyDelimiter);

				levels?.map((level, index) => {
					const levelConfig = { index, label: fieldObj.levels ? level : '', key: `ss-${index}` };
					selections.push(new SelectionHierarchy(services, config.id, facet, levelConfig, loading, storage));
				});
			} else {
				selections.push(new Selection(services, config.id, facet, fieldObj, loading, storage));
			}
		});

		super(...selections);
	}
}

class SelectionBase {
	type: string;
	field: string;
	filtered = false;
	collapsed = false;
	display = '';
	label: string;
	multiple: string;
	id: string;
	disabled = false;
	selected = '';
	custom = {};

	services;
	loading;
	config;
	data;
	storage;

	constructor(services, id, facet, selectionConfig, loading, storageStore) {
		this.services = services;
		this.loading = loading;

		this.id = id;
		this.config = selectionConfig;

		// inherit all standard facet properties
		this.type = facet.type;
		this.field = facet.field;
		this.filtered = facet.filtered;
		this.collapsed = facet.collapsed;
		this.display = facet.display;
		this.label = facet.label;
		this.multiple = facet.multiple;

		// abstracted StorageStore
		this.storage = {
			key: `ss-finder-${this.id}.${this.field}`,
			get: function (key) {
				const path = this.key + (key ? `.${key}` : '');
				return storageStore.get(path);
			},
			set: function (key, value) {
				const path = this.key + (key ? `.${key}` : '');
				return storageStore.set(path, value);
			},
		};
	}

	get values() {
		const values = [...(this.data || [])];

		values.unshift({
			filtered: false,
			value: '',
			label: this.config.label || this.label,
		});

		return values;
	}
}

class Selection extends SelectionBase {
	config: {
		label?: string;
		field: string;
	};

	constructor(services, id, facet, config, loading, storageStore) {
		super(services, id, facet, config, loading, storageStore);

		this.loading = loading;
		this.storage.set('values', facet.values);

		const storageData = this.storage.get();
		this.data = storageData.values;

		// check if any dropdowns have been selected
		this.disabled = !this.values.length;
		this.selected = this.disabled ? '' : storageData.selected || '';
	}

	select(value) {
		if (this.loading) return;

		if (!value) {
			this.selected = '';
			this.storage.set('selected', '');
			this.services.urlManager.remove(`filter.${this.field}`).go();
		} else {
			this.selected = value;
			this.storage.set('selected', value);
			this.services.urlManager.set(`filter.${this.field}`, value).go();
		}
	}
}

class SelectionHierarchy extends SelectionBase {
	hierarchyDelimiter: string;
	config: {
		index: number;
		label?: string;
		key: string;
	};

	constructor(services, id, facet, config, loading, storageStore) {
		super(services, id, facet, config, loading, storageStore);

		// inherit additional facet properties
		this.hierarchyDelimiter = facet.hierarchyDelimiter;

		let storageData = this.storage.get();

		if (!storageData) {
			// undefined, initial state for first dropdown
			this.storage.set(`${this.config.key}.values`, facet.values);
			storageData = this.storage.get();
		} else if (storageData[this.config.key]?.values) {
			// set values from storage
			this.selected = storageData[this.config.key].selected;
		} else {
			// value does not exist in storage
			const storedLevels = this.storage.get();
			const levels = Object.keys(storedLevels).map((a, index) => `ss-${index}`);
			!levels.includes(this.config.key) && levels.push(this.config.key);

			const selectedLevels = Object.keys(storedLevels).filter((key) => storedLevels[key].selected);
			const lastSelected = selectedLevels[selectedLevels.length - 1];

			const labelindex = levels.indexOf(this.config.key);
			const lastselectedindex = levels.indexOf(lastSelected);

			if (lastselectedindex != -1 && labelindex == lastselectedindex + 1) {
				this.storage.set(`${this.config.key}.values`, facet.values);
			} else {
				this.disabled = true;
			}
		}

		this.data = storageData[this.config.key]?.values || [];
	}

	select(value = '') {
		if (this.loading) return;

		this.selected = value;

		const selectedLevel = this.config.index;

		const storedLevels = this.storage.get();
		const keysToRemove = Object.keys(storedLevels).slice(selectedLevel);

		Object.keys(storedLevels)
			.reverse()
			.forEach((key) => {
				if (key == this.config.key) {
					this.storage.set(`${key}.selected`, value);
				} else if (keysToRemove.includes(key)) {
					this.storage.set(`${key}`, {});
				}

				value = value || this.storage.get(`${key}.selected`);
			});

		this.services.urlManager.set(`filter.${this.field}`, value).go();
	}
}
