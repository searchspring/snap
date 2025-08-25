import { h } from 'preact';
import { useEffect } from 'preact/hooks';

export function useCleanUpEmptyDivs(selectorsToClean: string[], selectorToIgnore?: string) {
	useEffect(() => {
		selectorsToClean.forEach((selectorToClean) => {
			document.querySelectorAll(selectorToClean).forEach((col) => {
				if (!hasElemsToShow(col, selectorToIgnore)) {
					col.remove();
				}
			});
		});
	});
}

function hasElemsToShow(element: Element, selectorToIgnore?: string): boolean {
	if (!element.children.length) return false;

	for (const child of element.children as any) {
		if (child.matches(selectorToIgnore)) {
			continue;
		} else {
			const innerHTML = child.innerHTML.trim();
			if (child.tagName !== 'DIV' || innerHTML.trim() !== '') {
				return true;
			}
		}
	}
	return false;
}
