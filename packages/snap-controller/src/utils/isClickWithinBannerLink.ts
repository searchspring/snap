import { CLICK_THROUGH_CLOSEST_MAX_LEVELS } from './isClickWithinProductLink';

const TRACKING_ATTRIBUTE = 'sstracking';
export const isClickWithinBannerLink = (e: MouseEvent): boolean => {
	let currentElement: Element | null = e.target as Element;
	let href: string | null = null;
	let level = 0;
	while (currentElement && (level < CLICK_THROUGH_CLOSEST_MAX_LEVELS || !currentElement.getAttribute(TRACKING_ATTRIBUTE))) {
		href = currentElement.getAttribute('href');
		const isAnchor = currentElement.tagName.toLowerCase() === 'a';
		if (href && isAnchor) {
			return true;
		}
		currentElement = currentElement.parentElement;
		level++;
	}
	return false;
};
