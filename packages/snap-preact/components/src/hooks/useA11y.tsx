const KEYCODE_TAB = 9;
const KEYCODE_ESC = 27;
export const A11Y_ATTRIBUTE = 'ss-a11y';

export function useA11y(elem: any, tabIndex?: number, trapFocus?: boolean, escCallback?: () => unknown) {
	const styleId = 'ssA11yFocusStyle';
	if (!document.querySelector(`#${styleId}`)) {
		const style = document.createElement('style');
		style.type = 'text/css';
		style.id = styleId;
		style.innerHTML = `[${A11Y_ATTRIBUTE}]:focus-visible { outline: -webkit-focus-ring-color auto 1px !important; }`;
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	if (elem && !elem.attributes?.[A11Y_ATTRIBUTE]) {
		//A11y attribute is for debouncing on rerenders
		elem.setAttribute(A11Y_ATTRIBUTE, true);

		//tab index 0 is default and used for actionable elements.
		elem.setAttribute('tabIndex', `${tabIndex || 0}`);

		elem.addEventListener('keydown', (event: any) => {
			if (event.code === 'Space' || event.code === 'Enter') {
				elem.click();
			}
		});

		if (trapFocus) {
			elem.addEventListener('keydown', function (e: any) {
				const focusableEls = elem.querySelectorAll(
					'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]'
				);
				const firstFocusableEl = focusableEls[0];
				const lastFocusableEl = focusableEls[focusableEls.length - 1];

				//esc key
				if (e.keyCode == KEYCODE_ESC) {
					elem.focus();

					if (escCallback) {
						escCallback();
					}

					e.preventDefault();
					return;
				}

				//tab key
				if (e.key === 'Tab' || e.keyCode === KEYCODE_TAB) {
					/* shift + tab */
					if (e.shiftKey) {
						if (document.activeElement === firstFocusableEl) {
							lastFocusableEl.focus();
							e.preventDefault();
						}
					} else {
						if (document.activeElement === lastFocusableEl) {
							firstFocusableEl.focus();
							e.preventDefault();
						}
					}
				}
			});
		}
	}
}
