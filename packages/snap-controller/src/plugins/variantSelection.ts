import { Product } from '@searchspring/snap-store-mobx';

import type { AfterStoreObj, SearchController, RecommendationController, AutocompleteController, AbstractController } from '../';
import type { Next } from '@searchspring/snap-event-manager';
import type { VariantConfig } from '@searchspring/snap-store-mobx';

const VARIANT_ATTRIBUTE = 'ss-variant-option';
const VARIANT_ATTRIBUTE_SELECTED = 'ss-variant-option-selected';

export function variantSelectionPlugin(controller: AbstractController) {
	const cntrl = controller as SearchController | RecommendationController | AutocompleteController;
	const makeVariantSelections = (variantConfig: VariantConfig, options: Record<string, string[]>) => {
		let filteredResults = cntrl.store.results;

		// filter based on config
		variantConfig.realtime?.filter?.forEach((filter: any) => {
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
	};

	// check for attributes for preselection
	const variantConfig = cntrl.config.settings?.variants;
	if (variantConfig?.field && !variantConfig?.realtime?.enabled === false) {
		const options: Record<string, string[]> = {};
		// grab values from elements on the page to form preselected elements
		document.querySelectorAll(`[${VARIANT_ATTRIBUTE_SELECTED}]`).forEach((elem) => {
			const attr = elem.getAttribute(VARIANT_ATTRIBUTE);
			if (attr) {
				const [option, value] = attr.split(':');
				options[option.toLowerCase()] = [value.toLowerCase()];
			}
		});

		makeVariantSelections(variantConfig, options);
	}

	cntrl.on('afterStore', async (_afterStore: AfterStoreObj, next: Next): Promise<void | boolean> => {
		// attach click event listener to elements for product variant clicks
		document.querySelectorAll(`[${VARIANT_ATTRIBUTE}]`).forEach((elem) => {
			const variantConfig = cntrl.config.settings?.variants;
			if (variantConfig?.field && !variantConfig?.realtime?.enabled === false) {
				elem.addEventListener('click', () => {
					const options: Record<string, string[]> = {};
					const attr = elem.getAttribute(VARIANT_ATTRIBUTE);
					if (attr) {
						const [option, value] = attr.split(':');
						options[option.toLowerCase()] = [value.toLowerCase()];

						makeVariantSelections(variantConfig, options);
					}
				});
			}
		});

		await next();
	});
}
