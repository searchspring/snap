import { makeObservable, observable } from 'mobx';
import deepmerge from 'deepmerge';
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
	options: Record<string, unknown>;
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

	defaultDisplay: VariantData = {
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

		this.defaultDisplay = {
			mappings: result.mappings!,
			attributes: result.attributes!,
			options: {},
		};

		this.display = this.defaultDisplay;

		const variantsField = (config as SearchStoreConfig)?.settings?.variants?.field;
		if (config && variantsField && this.attributes && this.attributes[variantsField]) {
			try {
				// parse the field (JSON)
				const parsedVariants: VariantData[] = JSON.parse(this.attributes[variantsField] as string);

				this.variants = new Variants(config, services, parsedVariants, this.setDisplay);
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
			attributes: observable,
			custom: observable,
			quantity: observable,
			setQuantity: observable,
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

	public setQuantity = (quantity: number) => {
		this.quantity = Number(quantity);
	};

	public setDisplay = (display: VariantData) => {
		this.display = deepmerge(this.defaultDisplay, display);
	};
}

class Variants {
	public active?: Variant;
	public data: Variant[] = [];
	public selections: VariantSelection[] = [];
	public config: StoreConfigs;

	public setDisplay: (variant: VariantData) => void;

	public options: string[];
	constructor(config: StoreConfigs, services: StoreServices, variantData: VariantData[], setDisplay: (variant: VariantData) => void) {
		this.options = [];

		// create variants objects
		this.data = variantData.map((variant) => {
			Object.keys(variant.options).forEach((variantOption) => {
				if (!this.options.includes(variantOption)) {
					this.options.push(variantOption);
				}
			});

			return new Variant(services, variant);
		});

		this.config = config;

		this.setDisplay = setDisplay;

		//always set the first variant active;
		// TODO - might want to limit to "available" first variant
		if ((config as SearchStoreConfig).settings?.variants?.setFirstActive) {
			this.active = this.data[0];
			this.setDisplay(this.active);
		}

		this.options.map((option) => {
			// TODO - merge with variant config before constructing selection
			const optionConfig = {
				field: option,
				label: option,
			};
			this.selections.push(new VariantSelection(config, services, this, optionConfig, this.data));
		});
	}

	public reset(skip?: string) {
		// this.selections.map(selection => {
		// 	if ((available && (selection.field !== topLevelFeild)) || (!available && (selection.field !== updatedFrom))) {

		// 		//choose the last user selection if it exists
		// 		if (selection.lastUserSelection && availableVariants.filter(variant => variant.options[selection.field] == selection.lastUserSelection).length) {
		// 			availableVariants = availableVariants.filter(variant => variant.options[selection.field] == selection.lastUserSelection)
		// 			selection.select(selection.lastUserSelection);
		// 		}else {
		// 			//otherwise just choose the first available option
		// 			if (availableVariants.length){
		// 				const valueToSelect = availableVariants[0].options[selection.field] as string;
		// 				if (valueToSelect){
		// 					selection.setSelected(valueToSelect)
		// 				}
		// 			}
		// 		}
		// 	}
		// });

		if (this.selections) {
			this.options.map((option) => {
				if (option !== skip) {
					const resetMe = this.selections.filter((selection) => selection.field == option);
					if (resetMe.length) {
						resetMe[0].reset();
					}
				}
			});

			const selectedSelections = this.selections.filter((selection) => selection.selected?.length);

			this.selections.forEach((selection) => selection.refineSelections(this.data, selectedSelections));
		}
	}

	public update(updatedFrom: string, available: boolean) {
		/*
			variantSelection runs update after selection is made
			then
			each variantSelection needs to refine its options based on selections
				1. this may unselect current selection IF it is
		*/

		// if (this.selections){
		// 	let reset = false;

		// 	// reset any sub selectors
		// 	this.options.map(option => {
		// 		if (reset) {
		// 			const resetMe = this.selections.filter(selection => selection.field == option);
		// 			if (resetMe.length) {
		// 				resetMe[0].reset();
		// 			}
		// 		}
		// 		if (option == updatedFrom){
		// 			reset = true
		// 		}
		// 	})
		// }

		// filter out data based on current selections
		// find out what the currently selection options are (from sibling VariantSelections)

		//grab the selections that are actually selected
		const selectedSelections = this.selections.filter((selection) => selection.selected?.length);
		const topLevelFeild = this.options[0];

		if ((available && topLevelFeild == updatedFrom) || !available) {
			this.reset(updatedFrom);
			return;
		}

		if (selectedSelections.length) {
			const filteredData: Variant[] = [];
			let availableVariants: Variant[] = [];
			this.data.map((variant) => {
				//find active variant if exists
				let variantOptionAvailable = true;
				for (let i = 0; i < selectedSelections.length; i++) {
					if (selectedSelections[i].selected !== variant.options[selectedSelections[i].field]) {
						variantOptionAvailable = false;
					}
				}

				filteredData.push(variant);

				if (variantOptionAvailable) {
					availableVariants.push(variant);
				}
			});

			this.selections.map((selection) => {
				selection.refineSelections(filteredData, selectedSelections);
			});

			//if the value you are trying to select is not currently available or top level option changed. (color) pick first variant that fits that option and update the display
			if (topLevelFeild == updatedFrom || !available) {
				this.selections.map((selection) => {
					if ((available && selection.field !== topLevelFeild) || (!available && selection.field !== updatedFrom)) {
						//choose the last user selection if it exists
						console.log('lastuserSelection in update', selection.lastUserSelection, selection.field);

						if (
							selection.lastUserSelection &&
							availableVariants.filter((variant) => variant.options[selection.field] == selection.lastUserSelection).length
						) {
							availableVariants = availableVariants.filter((variant) => variant.options[selection.field] == selection.lastUserSelection);
							selection.select(selection.lastUserSelection);
						} else {
							//otherwise just choose the first available option
							if (availableVariants.length) {
								const valueToSelect = availableVariants[0].options[selection.field] as string;
								if (valueToSelect) {
									selection.setSelected(valueToSelect);
								}
							}
						}
					}
				});
			} else if (availableVariants.length == 1) {
				//check if all selections are made, and set active if true

				//needed to check variant selection length, in case some variants dont have all the same length of selections
				const options = this.options;
				let variantSelectionLength = 0;
				options?.forEach((option) => {
					if (availableVariants[0].options.hasOwnProperty(option)) {
						variantSelectionLength++;
					}
				});

				if (this.selections.filter((selection) => selection.selected?.length).length == variantSelectionLength) {
					this.active = availableVariants[0];
					this.setDisplay(this.active);
				}
			}
		} else {
			//back to normal
			this.selections.map((selection) => selection.refineSelections(this.data, selectedSelections));
		}
	}
}

type SelectionValue = {
	value: string;
	label?: string;
	background?: string;
	available?: boolean;
};

class VariantSelection {
	public field: string;
	public label: string;
	public selected?: string = ''; //ex: blue
	public lastUserSelection?: string = '';

	public values: SelectionValue[] = [];
	private variants: Variants;

	constructor(config: StoreConfigs, services: StoreServices, variants: Variants, selectorConfig: VariantSelectionOptions, data: Variant[]) {
		this.field = selectorConfig.field;
		this.label = selectorConfig.label;

		//this is needed for calling update back up the callstack
		this.variants = variants;

		// create possible values from the data
		this.refineSelections(data, []);

		//set first variant active if flag is set
		if ((config as SearchStoreConfig).settings?.variants?.setFirstActive) {
			if (variants.active) {
				if (variants.active.options[this.field]) {
					this.setSelected(this.values[0].value);
				}
			}
		}

		makeObservable(this, {
			selected: observable,
			values: observable,
		});
	}

	public refineSelections(data: Variant[], selectedSelections: VariantSelection[]) {
		const newValues: SelectionValue[] = [];
		data.forEach((variant) => {
			if (variant.options[this.field] && typeof variant.options[this.field] == 'string') {
				const valueObj: SelectionValue = {
					value: variant.options[this.field] as string,
					available: false,
				};

				//only push the new value if it hasnt already been added to the selection
				if (!newValues.some((val) => val.value === variant.options[this.field])) {
					newValues.push(valueObj);
				}

				if (variant.attributes.available) {
					if (selectedSelections.length) {
						let available = true;

						for (let i = 0; i < selectedSelections.length; i++) {
							const selection = selectedSelections[i];
							//need to check if the variant is available if you dont consider its own field
							if (selection.field !== this.field) {
								//if any selection matches, variant is available
								if (variant.options[selection.field] !== selection.selected) {
									available = false;
									break;
								}
							}
						}
						if (available) {
							newValues[newValues.findIndex((_variant) => _variant.value == valueObj.value)].available = true;
						}
					} else {
						newValues[newValues.findIndex((_variant) => _variant.value == valueObj.value)].available = true;
					}
				}
			}
		});

		this.values = newValues;
	}

	public reset() {
		this.selected = '';
		this.values.forEach((val) => (val.available = false));
	}

	//setSelected is used when you want to update selected w/out updating lastuserSelection
	public setSelected(value: string) {
		this.selected = value;

		const val = this.values.find((val) => val.value == value);

		// after a selection is made, we have to refine all other selections (eg. color chosen, need to limit size selection)
		this.variants.update(this.field, val?.available!);
	}

	//select is used when you want to set lastUserSelection as well as selected
	public select(value: string) {
		const valueExist = this.values.find((val) => val.value == value);
		if (valueExist) {
			this.lastUserSelection = value;
			console.log('lastuserSelection in select', this.lastUserSelection, this.field);
			this.setSelected(value);
		}
	}
}

class Variant {
	public type = 'variant';
	public available: boolean;
	public attributes: Record<string, unknown> = {};
	public options: Record<string, unknown> = {};
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
