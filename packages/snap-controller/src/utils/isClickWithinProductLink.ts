import type { Product } from '@searchspring/snap-store-mobx';

export const CLICK_DUPLICATION_TIMEOUT = 300;
export const CLICK_THROUGH_CLOSEST_MAX_LEVELS = 12;

export const isClickWithinProductLink = (e: MouseEvent, result: Product): boolean => {
	const resultCoreUrl = (result as Product)?.display?.mappings.core?.url || '';
	const resultDisplayUrl = (result as Product)?.mappings.core?.url || '';

	// Get the composed path to handle shadow DOM elements
	const path = e.composedPath ? e.composedPath() : [e.target];

	// Check up to CLICK_THROUGH_CLOSEST_MAX_LEVELS elements in the path
	const elementsToCheck = path.slice(0, CLICK_THROUGH_CLOSEST_MAX_LEVELS);

	for (const element of elementsToCheck) {
		if (element instanceof Element) {
			const href = element.getAttribute('href');
			if (href && ((resultCoreUrl && href.includes(resultCoreUrl)) || (resultDisplayUrl && href.includes(resultDisplayUrl)))) {
				return true;
			}
		}
	}

	return false;
};
