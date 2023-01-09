import { h } from 'preact';

export function useA11y(elem: any, tabIndex?: number, focusRingColor?: string) {
	if (elem) {
		elem.setAttribute('tabIndex', `${tabIndex || 0}`);

		//how do we do this better
		elem.addEventListener('focus', (event: any) => {
			elem.style.outline = `${focusRingColor || '-webkit-focus-ring-color'} auto 1px`;
		});

		elem.addEventListener('focusout', (event: any) => {
			elem.style.outline = 'none';
		});

		elem.addEventListener('keydown', (event: any) => {
			// event.stopPropagation();
			if (event.code === 'Space' || event.code === 'Enter') {
				elem.click();
			}
		});

		// return elem;
	}
}
