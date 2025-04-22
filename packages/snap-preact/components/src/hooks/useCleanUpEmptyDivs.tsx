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
	if (!element.children.length) return true;

	for (const child of element.children as any) {
		if (child.tagName !== 'DIV' || child.innerHTML.trim() !== '') {
			return true;
		}
	}
	return false;
}
