import { h } from 'preact';

export function useA11y(elem: any, tabIndex?: number, focusRingColor?: string) {
	if (elem && !elem.attributes?.ssA11y) {
		//A11y attribute is for debouncing on rerenders
		elem.setAttribute('ssA11y', true);

		//tab index 0 is default and used for actionable elements.
		elem.setAttribute('tabIndex', `${tabIndex || 0}`);

		elem.addEventListener('focus', (event: any) => {
			//webkit focus ring doesnt work on firefox so lets use highlight for those
			elem.style.outline = `${focusRingColor || '-webkit-focus-ring-color'} auto 1px`;
		});

		elem.addEventListener('focusout', (event: any) => {
			elem.style.outline = 'none';
		});

		elem.addEventListener('keydown', (event: any) => {
			if (event.code === 'Space' || event.code === 'Enter') {
				elem.click();
			}
		});
	}
}
