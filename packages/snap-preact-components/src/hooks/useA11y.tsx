const KEYCODE_TAB = 9;
const KEYCODE_ESC = 27;

export function useA11y(elem: any, tabIndex?: number, trapFocus?: boolean | { returnElem?: any; clickToClose?: boolean; callback?: () => unknown }) {
	const styleId = 'ssA11yFocusStyle';
	if (!document.querySelector(`#${styleId}`)) {
		const style = document.createElement('style');
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

		if (trapFocus) {
			elem.addEventListener('keydown', function (e: any) {
				const focusableEls = elem.querySelectorAll(
					'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]'
				);
				const firstFocusableEl = focusableEls[0];
				const lastFocusableEl = focusableEls[focusableEls.length - 1];

				let returnElem;
				let clickToClose;
				let callback;

				if (typeof trapFocus !== 'boolean') {
					returnElem = trapFocus.returnElem;
					clickToClose = trapFocus.clickToClose;
					callback = trapFocus.callback;
				}
				//esc key
				if (e.keyCode == KEYCODE_ESC) {
					let actionElem;

					if (returnElem) {
						if (typeof returnElem == 'string') {
							const returnTo = document.querySelector(returnElem);
							actionElem = returnTo;
						} else if (returnElem.current) {
							if (returnElem.current.base) {
								actionElem = returnElem.current.base;
							} else {
								actionElem = returnElem.current;
							}
						} else {
							actionElem = returnElem;
						}
					} else {
						actionElem = elem;
					}

					actionElem.focus();
					if (clickToClose) {
						actionElem.click && actionElem.click();
					}
					if (callback) {
						callback();
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
