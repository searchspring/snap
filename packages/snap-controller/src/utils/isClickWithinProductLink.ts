import type { Product } from '@searchspring/snap-store-mobx';

export const CLICK_DUPLICATION_TIMEOUT = 300;
export const CLICK_THROUGH_CLOSEST_MAX_LEVELS = 12;

export const isClickWithinProductLink = (e: MouseEvent, result: Product): boolean => {
	let currentElement: Element | null = e.target as Element;
	let href: string | null = null;
	let level = 0;
	const resultCoreUrl = (result as Product)?.display?.mappings.core?.url || '';
	const resultDisplayUrl = (result as Product)?.mappings.core?.url || '';

	while (currentElement && level < CLICK_THROUGH_CLOSEST_MAX_LEVELS) {
		href = currentElement.getAttribute('href');
		if (href && ((resultCoreUrl && href.includes(resultCoreUrl)) || (resultDisplayUrl && href.includes(resultDisplayUrl)))) {
			return true;
		}
		currentElement = currentElement.parentElement;
		level++;
	}
	return false;
};
