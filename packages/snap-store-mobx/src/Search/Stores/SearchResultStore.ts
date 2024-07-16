import { computed, makeObservable, observable } from 'mobx';
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';
import type {
	SearchStoreConfig,
	StoreServices,
	StoreConfigs,
	ResultBadge,
	VariantOptionConfig,
	VariantConfig,
	AutocompleteStoreConfig,
	RecommendationStoreConfig,
} from '../../types';
import type {
	SearchResponseModelResult,
	SearchResponseModelPagination,
	SearchResponseModelMerchandising,
	SearchResponseModelResultMappings,
	SearchResponseModelMerchandisingContentInline,
	SearchResponseModelMerchandisingContentConfig,
	MetaResponseModel,
} from '@searchspring/snapi-types';

const VARIANT_ATTRIBUTE = 'ss-variant-option';
const VARIANT_ATTRIBUTE_SELECTED = 'ss-variant-option-selected';

export class SearchResultStore extends Array<Product | Banner> {
	static get [Symbol.species](): ArrayConstructor {
		return Array;
	}

	constructor(
		config: StoreConfigs,
		services: StoreServices,
		metaData: MetaResponseModel,
		resultData?: SearchResponseModelResult[],
		paginationData?: SearchResponseModelPagination,
		merchData?: SearchResponseModelMerchandising,
		loaded?: boolean
	) {
		let results: (Product | Banner)[] = (resultData || []).map((result) => {
			return new Product(services, result, metaData, config);
		});

		const variantConfig = (config as SearchStoreConfig | AutocompleteStoreConfig | RecommendationStoreConfig)?.settings?.variants;

		// preselected variant options
		if (variantConfig?.realtime?.enabled) {
			// attach click events - ONLY happens once (known limitation)
			if (!loaded && results.length) {
				document.querySelectorAll(`[${VARIANT_ATTRIBUTE}]`).forEach((elem) => {
					if (variantConfig?.field && !variantConfig?.realtime?.enabled === false) {
						elem.addEventListener('click', () => variantOptionClick(elem, variantConfig, results));
					}
				});
			}

			// check for attributes for preselection
			if (results.length) {
				if (variantConfig?.field && !variantConfig?.realtime?.enabled === false) {
					const options: Record<string, string[]> = {};
					// grab values from elements on the page to form preselected elements
					document.querySelectorAll(`[${VARIANT_ATTRIBUTE_SELECTED}]`).forEach((elem) => {
						const attr = elem.getAttribute(VARIANT_ATTRIBUTE);
						if (attr) {
							const [option, value] = attr.split(':');
							if (option && value) {
								options[option.toLowerCase()] = [value.toLowerCase()];
							}
						}
					});

					makeVariantSelections(variantConfig, options, results);
				}
			}
		}

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

export type VariantData = {
	mappings: SearchResponseModelResultMappings;
	attributes: Record<string, unknown>;
	options: VariantDataOptions;
};

export type VariantDataOptions = Record<
	string,
	{
		value: string;
		background?: string;
		backgroundImageUrl?: string;
		attributeId?: string;
		optionId?: string;
	}
>;

type ProductMinimal = {
	id: string;
	attributes: Record<string, unknown>;
	mappings: SearchResponseModelResultMappings;
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
	public badges: Badges;

	public quantity = 1;
	public mask = new ProductMask();
	public variants?: Variants;

	constructor(services: StoreServices, result: SearchResponseModelResult, metaData: MetaResponseModel, config?: StoreConfigs) {
		this.id = result.id!;
		this.attributes = result.attributes!;

		this.mappings = result.mappings!;

		this.badges = new Badges(result, metaData);

		const variantsField = (config as SearchStoreConfig)?.settings?.variants?.field;
		if (config && variantsField && this.attributes && this.attributes[variantsField]) {
			try {
				// parse the field (JSON)
				const parsedVariants: VariantData[] = JSON.parse(this.attributes[variantsField] as string);

				this.variants = new Variants(parsedVariants, this.mask, (config as SearchStoreConfig)?.settings?.variants);
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
			display: computed,
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

	public get display(): ProductMinimal {
		return deepmerge({ id: this.id, mappings: this.mappings, attributes: this.attributes }, this.mask.data, { isMergeableObject: isPlainObject });
	}
}

export class Badges {
	public all: ResultBadge[] = [];

	constructor(result: SearchResponseModelResult, metaData: MetaResponseModel) {
		this.all = (result.badges || [])
			.filter((badge) => {
				// remove badges that are not in the meta or are disabled
				return !!(badge?.tag && metaData?.badges?.tags && metaData?.badges?.tags[badge.tag] && metaData?.badges?.tags[badge.tag].enabled);
			})
			.map((badge) => {
				// merge badge with badge meta data
				const metaBadgeData = metaData?.badges?.tags?.[badge.tag]!;

				return {
					...badge,
					...metaBadgeData,
				};
			})
			.sort((a, b) => {
				return a.priority - b.priority;
			}) as ResultBadge[];

		makeObservable(this, {
			all: observable,
			tags: computed,
			locations: computed,
		});
	}

	// get all the result badges that are in a specific location
	public atLocation(location?: string[] | string): ResultBadge[] {
		const locations = Array.isArray(location) ? location : [location];
		return this.all.filter((badge) => {
			// filter location
			return locations.some((location) => badge.location.startsWith(`${location}/`) || badge.location == location);
		});
	}

	public get tags(): Record<string, ResultBadge> {
		return this.all.reduce((badgeMap: Record<string, ResultBadge>, badge) => {
			badgeMap[badge.tag] = badge;
			return badgeMap;
		}, {});
	}

	public get locations(): Record<string, Record<string, ResultBadge[]>> {
		return this.all.reduce((locationMap: Record<string, Record<string, ResultBadge[]>>, badge) => {
			// put badge in location by path
			const [section, tag] = badge.location.split('/');
			locationMap[section] = locationMap[section] || {};
			locationMap[section][tag] = (locationMap[section][tag] || []).concat(badge);
			return locationMap;
		}, {});
	}
}

// Mask is used to power the product display for quick attribute swapping
export class ProductMask {
	public data: Partial<Product> = {};

	constructor() {
		makeObservable(this, {
			data: observable,
		});
	}

	public merge(mask: Partial<Product>) {
		// TODO: look into making more performant
		// needed to prevent infinite re-render on merge with same data
		if (JSON.stringify(deepmerge(this.data, mask)) != JSON.stringify(this.data)) {
			this.data = deepmerge(this.data, mask);
		}
	}

	public set(mask: Partial<Product>) {
		// TODO: look into making more performant
		// needed to prevent infinite re-render on set with same data
		if (JSON.stringify(mask) != JSON.stringify(this.data)) {
			this.data = mask;
		}
	}

	public reset() {
		this.data = {};
	}
}

export class Variants {
	public active?: Variant;
	public data: Variant[] = [];
	public selections: VariantSelection[] = [];
	public setActive: (variant: Variant) => void;
	private config?: VariantConfig;

	constructor(variantData: VariantData[], mask: ProductMask, config?: VariantConfig) {
		// setting function in constructor to prevent exposing mask as class property
		this.setActive = (variant: Variant) => {
			this.active = variant;
			mask.set({ mappings: this.active.mappings, attributes: this.active.attributes });
		};

		if (config) {
			this.config = config;
		}

		this.update(variantData, config);
	}

	public update(variantData: VariantData[], config = this.config) {
		try {
			const options: string[] = [];

			// create variants objects
			this.data = variantData.map((variant) => {
				Object.keys(variant.options).forEach((variantOption) => {
					if (!options.includes(variantOption)) {
						options.push(variantOption);
					}
				});

				return new Variant(variant);
			});

			//need to reset this.selections first
			this.selections = [];

			options.map((option) => {
				const variantOptionConfig = this.config?.options && this.config.options[option];
				this.selections.push(new VariantSelection(this, option, variantOptionConfig));
			});

			const preselectedOptions: Record<string, string[]> = {};
			if (config?.options) {
				Object.keys(config?.options).forEach((option) => {
					if (config.options![option].preSelected) {
						preselectedOptions[option] = config.options![option].preSelected as string[];
					}
				});
			}

			// select first available
			this.makeSelections(preselectedOptions);
		} catch (err) {
			// failed to parse the variant JSON
			console.error(err, `Invalid variant JSON for: ${variantData}`);
		}
	}

	public makeSelections(options?: Record<string, string[]>) {
		// options = {color: 'Blue', size: 'L'};
		if (!options || !Object.keys(options).length) {
			// select first available for each selection
			this.selections.forEach((selection) => {
				const firstAvailableOption = selection.values.find((value) => value.available);
				if (firstAvailableOption) {
					selection.select(firstAvailableOption.value, true);
				}
			});
		} else {
			this.selections.forEach((selection, idx) => {
				// filter by first available, then by preselected option preference
				//make all options available for first selection.
				const availableOptions = selection.values.filter((value) => (idx == 0 ? true : value.available));
				const preferedOptions = options[selection.field as keyof typeof options];
				let preferencedOption = selection.selected || availableOptions[0];
				// if theres a preference for that field
				if (preferedOptions) {
					const checkIfAvailable = (preference: string) => {
						//see if that option is in the available options
						const availablePreferedOptions = availableOptions.find(
							(value) => value.value.toString().toLowerCase() == preference?.toString().toLowerCase()
						);

						//use it
						if (availablePreferedOptions) {
							preferencedOption = availablePreferedOptions;
						}
					};

					if (Array.isArray(preferedOptions)) {
						//loop through each preference option
						preferedOptions.forEach((preference: string) => {
							checkIfAvailable(preference);
						});
					} else {
						checkIfAvailable(preferedOptions);
					}
				}

				if (preferencedOption) {
					selection.select(preferencedOption.value, true);
				}
			});
		}
	}

	public refineSelections(fromSelection: VariantSelection) {
		// need to ensure the update originator is at the BOTTOM of the list for refinement
		const orderedSelections = [...this.selections];
		orderedSelections.sort((a) => {
			if (a.field == fromSelection.field) {
				return 1;
			}
			return -1;
		});

		// refine selections ensuring that the selection that triggered the update refines LAST
		orderedSelections.forEach((selection) => selection.refineValues(this));

		// check to see if we have enough selections made to update the display
		const selectedSelections = this.selections.filter((selection) => selection.selected?.value?.length);
		if (selectedSelections.length) {
			let availableVariants: Variant[] = this.data;

			// loop through selectedSelections and only include available products that match current selections
			for (const selectedSelection of selectedSelections) {
				availableVariants = availableVariants.filter(
					(variant) => selectedSelection.selected?.value == variant.options[selectedSelection.field].value && variant.available
				);
			}

			// set active variant
			if (availableVariants.length == 1) {
				this.setActive(availableVariants[0]);
			}
		}
	}
}

export type VariantSelectionValue = {
	value: string;
	label?: string;
	thumbnailImageUrl?: string;
	backgroundImageUrl?: string;
	background?: string;
	available?: boolean;
};

export class VariantSelection {
	public field: string;
	public label: string;
	public selected?: VariantSelectionValue = undefined;
	public previouslySelected?: VariantSelectionValue = undefined;
	public values: VariantSelectionValue[] = [];
	private config: VariantOptionConfig;
	private variantsUpdate: () => void;

	constructor(variants: Variants, selectorField: string, variantConfig?: VariantOptionConfig) {
		this.field = selectorField;
		this.label = variantConfig?.label || selectorField;
		this.config = variantConfig || {};

		// needed to prevent attaching variants as class property
		this.variantsUpdate = () => variants.refineSelections(this);

		// create possible values from the data and refine them
		this.refineValues(variants);

		makeObservable(this, {
			selected: observable,
			values: observable,
		});
	}

	public refineValues(variants: Variants) {
		// current selection should only consider OTHER selections for availability
		const selectedSelections = variants.selections.filter((selection) => selection.field != this.field && selection.selected);

		let availableVariants = variants.data;

		// loop through selectedSelections and remove products that do not match
		for (const selectedSelection of selectedSelections) {
			availableVariants = availableVariants.filter(
				(variant) => selectedSelection.selected?.value == variant.options[selectedSelection.field].value && variant.available
			);
		}

		const newValues: VariantSelectionValue[] = variants.data
			.filter((variant) => variant.options[this.field])
			.reduce((values: VariantSelectionValue[], variant) => {
				if (!values.some((val) => variant.options[this.field].value == val.value)) {
					const value = variant.options[this.field].value;

					const thumbnailImageUrl = variant.mappings.core?.thumbnailImageUrl;
					const mappedValue: {
						available: boolean;
						value: string;
						label: string;
						thumbnailImageUrl?: string;
						background?: string;
						backgroundImageUrl?: string;
					} = {
						value: value,
						label: value,
						thumbnailImageUrl: thumbnailImageUrl,
						available: Boolean(
							availableVariants.some((availableVariant) => availableVariant.options[this.field].value == variant.options[this.field].value)
						),
					};

					if (this.config.thumbnailBackgroundImages) {
						mappedValue.backgroundImageUrl = thumbnailImageUrl;
					} else if (variant.options[this.field].backgroundImageUrl) {
						mappedValue.backgroundImageUrl = variant.options[this.field].backgroundImageUrl;
					}

					if (variant.options[this.field].background) {
						mappedValue.background = variant.options[this.field].background;
					}

					if (this.config.mappings && this.config.mappings && this.config.mappings[value.toString().toLowerCase()]) {
						const mapping = this.config.mappings[value.toString().toLowerCase()];

						if (mapping.label) {
							mappedValue.label = mapping.label;
						}

						if (mapping.background) {
							mappedValue.background = mapping.background;
						}

						if (mapping.backgroundImageUrl) {
							mappedValue.backgroundImageUrl = mapping.backgroundImageUrl;
						}
					}

					values.push(mappedValue);
				}

				// TODO: use sorting function from config
				return values;
			}, []);

		// if selection has been made
		if (this.selected) {
			// check if the selection is stil available
			if (!newValues.some((val) => val.value == this.selected?.value && val.available)) {
				// the selection is no longer available, attempt to select previous selection
				if (
					this.selected !== this.previouslySelected &&
					this.previouslySelected &&
					newValues.some((val) => val.value == this.previouslySelected?.value && val.available)
				) {
					this.select(this.previouslySelected.value, true);
				} else {
					// choose the first available option if previous seletions are unavailable
					const availableValues = newValues.filter((val) => val.available);
					if (newValues.length && availableValues.length) {
						const nextAvailableValue = availableValues[0].value;
						if (this.selected.value !== nextAvailableValue) {
							this.select(nextAvailableValue, true);
						}
					}
				}
			}
		}

		this.values = newValues;
	}

	public reset() {
		this.selected = undefined;
		this.values.forEach((val) => (val.available = false));
	}

	public select(value: string | number, internalSelection = false) {
		const valueExist = this.values.find((val) => val.value == value);
		if (valueExist) {
			if (!internalSelection) {
				this.previouslySelected = this.selected;
			}

			this.selected = valueExist;

			this.variantsUpdate();
		}
	}
}

export class Variant {
	public type = 'variant';
	public available: boolean;
	public attributes: Record<string, unknown> = {};
	public options: VariantDataOptions;

	public mappings: SearchResponseModelResultMappings = {
		core: {},
	};
	public custom = {};

	constructor(variantData: VariantData) {
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

function variantOptionClick(elem: Element, variantConfig: VariantConfig, results: (Product | Banner)[]) {
	const options: Record<string, string[]> = {};
	const attr = elem.getAttribute(VARIANT_ATTRIBUTE);
	if (attr) {
		const [option, value] = attr.split(':');
		options[option.toLowerCase()] = [value.toLowerCase()];

		makeVariantSelections(variantConfig, options, results);
	}
}

function makeVariantSelections(variantConfig: VariantConfig, options: Record<string, string[]>, results: (Product | Banner)[]) {
	let filteredResults = results;

	// filter based on config
	variantConfig.realtime?.filters?.forEach((filter: any) => {
		if (filter == 'first') {
			filteredResults = [filteredResults[0]];
		}

		if (filter == 'unaltered') {
			filteredResults = filteredResults.filter(
				(result) => !(result as Product).variants?.selections.some((selection) => selection.previouslySelected)
			);
		}
	});

	filteredResults.forEach((result) => {
		// no banner types
		if (result.type == 'product') {
			(result as Product).variants?.makeSelections(options);
		}
	});
}
