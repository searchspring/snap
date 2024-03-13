import { makeObservable, observable } from 'mobx';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import type { SearchStoreConfig, StoreServices, StoreConfigs, VariantSelectionOptions } from '../../types';
import type {
	SearchResponseModelResult,
	SearchResponseModelPagination,
	SearchResponseModelMerchandising,
	SearchResponseModelResultMappings,
	SearchResponseModelMerchandisingContentInline,
	SearchResponseModelMerchandisingContentConfig,
} from '@searchspring/snapi-types';

export class SearchResultStore extends Array<Product | Banner> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(
		config: StoreConfigs,
		services: StoreServices,
		resultData?: SearchResponseModelResult[],
		paginationData?: SearchResponseModelPagination,
		merchData?: SearchResponseModelMerchandising
	) {
		let results: (Product | Banner)[] = (resultData || []).map((result) => {
			return new Product(services, result, config);
		});

		if (merchData?.content?.inline) {
			const banners = merchData.content.inline
				.sort(function (a, b) {
					return a.config!.position!.index! - b.config!.position!.index!;
				})
				.map((banner) => {
					return new Banner(services, banner);
				});

			if (banners && paginationData?.totalResults) {
				results = addBannersToResults(config, results, banners, paginationData);
			}
		}
		super(...results);
	}
}

export class Banner {
	public type = 'banner';
	public id: string;
	public attributes: Record<string, unknown> = {};
	public mappings: SearchResponseModelResultMappings = {
		core: {},
	};
	public custom = {};
	public config: SearchResponseModelMerchandisingContentConfig;
	public value: string;

	constructor(services: StoreServices, banner: SearchResponseModelMerchandisingContentInline) {
		this.id = 'ss-ib-' + banner.config!.position!.index;
		this.config = banner.config!;
		this.value = banner.value!;

		makeObservable(this, {
			id: observable,
			mappings: observable,
			attributes: observable,
		});
	}
}

type VariantData = {
	mappings: SearchResponseModelResultMappings;
	attributes: Record<string, unknown>;
	options: Record<string, string>;
};

export class Product {
	public type = 'product';
	public id: string;
	public attributes: Record<string, unknown> = {};
	public mappings: SearchResponseModelResultMappings = {
		core: {},
	};
	public custom = {};
	public children?: Array<Child> = [];
	public quantity = 1;

	public display: VariantData = {
		mappings: {
			core: {},
		},
		attributes: {},
		options: {},
	};

	public variants?: Variants;

	constructor(services: StoreServices, result: SearchResponseModelResult, config?: StoreConfigs) {
		this.id = result.id!;
		this.attributes = result.attributes!;
		this.mappings = result.mappings!;

		//initialize the display
		this.updateDisplay();

		const variantsField = (config as SearchStoreConfig)?.settings?.variants?.field;
		if (config && variantsField && this.attributes && this.attributes[variantsField]) {
			try {
				// parse the field (JSON)
				const parsedVariants: VariantData[] = JSON.parse(this.attributes[variantsField] as string);

				this.variants = new Variants(config, services, parsedVariants, this.updateDisplay);
			} catch (err) {
				// failed to parse the variant JSON
				console.error(err, `Invalid variant JSON for product id: ${result.id}`);
			}
		}

		if (result?.children?.length) {
			this.children = result.children.map((variant, index) => {
				return new Child(services, {
					id: `${result.id}-${index}`,
					...variant,
				});
			});
		}

		makeObservable(this, {
			id: observable,
			display: observable,
			attributes: observable,
			custom: observable,
			quantity: observable,
		});

		// must set all subo
		const coreObservables = Object.keys(this.mappings.core!).reduce((map, key) => {
			return {
				...map,
				[key]: observable,
			};
		}, {});

		makeObservable(this.mappings.core!, coreObservables);
	}

	public updateDisplay = (display?: {
		mappings: SearchResponseModelResultMappings;
		attributes: Record<string, unknown>;
		options: Record<string, string>;
	}) => {
		const defaultDisplay = {
			mappings: this.mappings!,
			attributes: this.attributes!,
			options: {},
		};

		const newDisplay = deepmerge(defaultDisplay, display || defaultDisplay, { isMergeableObject: isPlainObject });
		if (JSON.stringify(this.display) !== JSON.stringify(newDisplay)) {
			this.display = newDisplay;
		}
	};
}

class Variants {
	public active?: Variant;
	public data: Variant[] = [];
	public selections: VariantSelection[] = [];
	public config: StoreConfigs;

	public updateDisplay: (variant: VariantData) => void;

	constructor(config: StoreConfigs, services: StoreServices, variantData: VariantData[], updateDisplay: (variant: VariantData) => void) {
		const options: string[] = [];

		// create variants objects
		this.data = variantData.map((variant) => {
			Object.keys(variant.options).forEach((variantOption) => {
				if (!options.includes(variantOption)) {
					options.push(variantOption);
				}
			});

			return new Variant(services, variant);
		});

		this.config = config;

		this.updateDisplay = updateDisplay;

		options.map((option) => {
			// TODO - merge with variant config before constructing selection (for label overrides and swatch mappings)
			const optionConfig = {
				field: option,
				label: option,
			};
			this.selections.push(new VariantSelection(config, services, this, optionConfig, this.data));
		});

		// select first available
		this.makeSelections();
	}

	public setActive(variant: Variant) {
		this.active = variant;
		this.updateDisplay(this.active);
	}

	public makeSelections(options?: Record<string, string[]>) {
		// options = {color: 'Blue', size: 'L'};

		if (!options) {
			// select first available for each selection
			this.selections.forEach((selection) => {
				const firstAvailableOption = selection.values.find((value) => value.available);
				if (firstAvailableOption) {
					selection.select(firstAvailableOption.value);
				}
			});
		} else {
			// select first available for each selection
			this.selections.forEach((selection, idx) => {
				// filter by first available, then by preselected option preference
				//make all options available for first selection.
				const availableOptions = selection.values.filter((value) => (idx == 0 ? true : value.available));
				const preferedOptions = options[selection.field as keyof typeof options];
				let preferencedOption = availableOptions[0];

				// if theres a preference for that field
				if (preferedOptions) {
					//loop through each preference option
					preferedOptions.forEach((preference: string) => {
						//see if that option is in the available options
						const availablePreferedOptions = availableOptions.find((value) => value.value.toLowerCase() == preference.toLowerCase());

						//use it
						if (availablePreferedOptions) {
							preferencedOption = availablePreferedOptions;
						}
					});
				}

				if (preferencedOption) {
					selection.select(preferencedOption.value);
				}
			});
		}
	}

	public update(fromSelection: VariantSelection) {
		// need to ensure the update originator is at the BOTTOM of the list for refinement
		const orderedSelections = [...this.selections];
		orderedSelections.sort((a) => {
			if (a.field == fromSelection.field) {
				return 1;
			}
			return -1;
		});

		// refine selections ensuring that the selection that triggered the update refines LAST
		orderedSelections.forEach((selection) => selection.refineSelections(this.data));

		// check to see if we have enough selections made to update the display
		const selectedSelections = this.selections.filter((selection) => selection.selected?.length);
		if (selectedSelections.length) {
			let availableVariants: Variant[] = this.data;

			// loop through selectedSelections and only include available products that match current selections
			for (const selectedSelection of selectedSelections) {
				availableVariants = availableVariants.filter(
					(variant) => selectedSelection.selected == variant.options[selectedSelection.field] && variant.available
				);
			}

			// set active variant
			if (availableVariants.length == 1) {
				this.setActive(availableVariants[0]);
			}
		}
	}
}

type SelectionValue = {
	value: string;
	label?: string;
	thumbnailImageUrl?: string;
	background?: string;
	available?: boolean;
};

export class VariantSelection {
	public field: string;
	public label: string;
	public selected?: string = ''; //ex: blue
	public previouslySelected?: string = '';

	public values: SelectionValue[] = [];
	private variants: Variants;

	constructor(config: StoreConfigs, services: StoreServices, variants: Variants, selectorConfig: VariantSelectionOptions, data: Variant[]) {
		this.field = selectorConfig.field;
		this.label = selectorConfig.label;

		// reference to parent variants
		this.variants = variants;

		// create possible values from the data and refine them
		this.refineSelections(data);

		makeObservable(this, {
			selected: observable,
			values: observable,
		});
	}

	public refineSelections(allVariants: Variant[]) {
		// current selection should only consider OTHER selections for availability
		const selectedSelections = this.variants.selections.filter((selection) => selection.field != this.field && selection.selected);

		let availableVariants = allVariants;

		// loop through selectedSelections and remove products that do not match
		for (const selectedSelection of selectedSelections) {
			availableVariants = availableVariants.filter(
				(variant) => selectedSelection.selected == variant.options[selectedSelection.field] && variant.available
			);
		}

		const newValues: SelectionValue[] = allVariants
			.filter((variant) => variant.options[this.field])
			.reduce((values: SelectionValue[], variant) => {
				if (!values.some((val) => variant.options[this.field] == val.value)) {
					values.push({
						value: variant.options[this.field] as string,
						label: variant.options[this.field] as string, // TODO - use configurable mappings
						// TODO set background for swatches (via configurable mappings)
						thumbnailImageUrl: variant.mappings.core?.thumbnailImageUrl,
						available: Boolean(availableVariants.some((availableVariant) => availableVariant.options[this.field] == variant.options[this.field])),
					});
				}
				return values;
			}, []);

		// if selection has been made
		if (this.selected) {
			//is that selection still available?
			if (!newValues.some((val) => val.value == this.selected && val.available)) {
				// the previous selection is no longer available
				if (this.previouslySelected && newValues.some((val) => val.value == this.previouslySelected && val.available)) {
					if (this.selected !== this.previouslySelected) {
						this.select(this.previouslySelected, true);
					}
				} else {
					//otherwise just choose the first available option
					const availableValues = newValues.filter((val) => val.available);
					if (newValues.length && availableValues.length) {
						const nextAvailableValue = availableValues[0].value;
						if (this.selected !== nextAvailableValue) {
							this.select(nextAvailableValue, true);
						}
					}
				}
			}
		}

		this.values = newValues;
	}

	public reset() {
		this.selected = '';
		this.values.forEach((val) => (val.available = false));
	}

	public select(value: string, internalSelection = false) {
		const valueExist = this.values.find((val) => val.value == value);
		if (valueExist) {
			this.selected = value;
			if (!internalSelection) {
				this.previouslySelected = value;
			}

			this.variants.update(this);
		}
	}
}

class Variant {
	public type = 'variant';
	public available: boolean;
	public attributes: Record<string, unknown> = {};
	public options: Record<string, string> = {};
	public mappings: SearchResponseModelResultMappings = {
		core: {},
	};
	public custom = {};

	constructor(services: StoreServices, variantData: VariantData) {
		this.attributes = variantData.attributes;
		this.mappings = variantData.mappings;
		this.options = variantData.options;
		this.available = (this.attributes.available as boolean) || false;

		makeObservable(this, {
			attributes: observable,
			mappings: observable,
			custom: observable,
			available: observable,
		});
	}
}

class Child {
	public type = 'child';
	public id: string;
	public attributes: Record<string, unknown> = {};
	public custom = {};

	constructor(services: StoreServices, result: SearchResponseModelResult) {
		this.id = result.id!;
		this.attributes = result.attributes!;

		makeObservable(this, {
			id: observable,
			attributes: observable,
			custom: observable,
		});
	}
}

function addBannersToResults(config: StoreConfigs, results: (Product | Banner)[], banners: Banner[], paginationData: SearchResponseModelPagination) {
	const productCount = results.length;
	let minIndex = paginationData.pageSize! * (paginationData.page! - 1);
	const maxIndex = minIndex + paginationData.pageSize!;

	if ((config as SearchStoreConfig)?.settings?.infinite) {
		minIndex = 0;
	}

	banners
		.reduce((adding, banner) => {
			const resultCount = productCount + adding.length;

			if (banner.config.position!.index! >= minIndex && (banner.config.position!.index! < maxIndex || resultCount < paginationData.pageSize!)) {
				adding.push(banner);
			}

			return adding;
		}, [] as Banner[])
		.forEach((banner) => {
			const adjustedIndex = banner.config.position!.index! - minIndex;

			results.splice(adjustedIndex, 0, banner);
		});

	return results;
}
