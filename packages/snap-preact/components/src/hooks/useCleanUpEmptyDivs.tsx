import { h } from 'preact';
import { useEffect } from 'preact/hooks';

export function useCleanUpEmptyDivs(className: string) {
	useEffect(() => {
		document.querySelectorAll(className).forEach((col) => {
			if (!hasElemsToShow(col)) {
				col.remove();
			}
		});
	});
}

function hasElemsToShow(element: Element) {
	if (!element.children.length) return false;

	for (const child of element.children as any) {
		const innerHTML = child.innerHTML.trim();
		const cleanedInner = innerHTML.replace(/\<div class=\"ss__autocomplete__separator\"><\/div\>/g, '');

		if (child.tagName !== 'DIV' || cleanedInner.trim() !== '') {
			return true;
		}
	}
	return false;
}
