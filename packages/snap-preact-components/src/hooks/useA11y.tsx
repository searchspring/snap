import { h } from 'preact';

export function useA11y(elem: any, tabIndex?: number) {
	const styleId = 'ssA11yFocusStyle';
	if (!document.querySelector(`#${styleId}`)) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.id = styleId;
		style.innerHTML = `[ssA11y]:focus-visible { outline: -webkit-focus-ring-color auto 1px !important; }`;
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	if (elem && !elem.attributes?.ssA11y) {
		//A11y attribute is for debouncing on rerenders
		elem.setAttribute('ssA11y', true);

		//tab index 0 is default and used for actionable elements.
		elem.setAttribute('tabIndex', `${tabIndex || 0}`);

		elem.addEventListener('keydown', (event: any) => {
			if (event.code === 'Space' || event.code === 'Enter') {
				elem.click();
			}
		});
	}
}
