import { AutocompleteController } from '@searchspring/snap-controller';

export function useA11y(
	elem: any,
	tabIndex?: number,
	trapFocus?: boolean | { returnelem?: any; clickToClose?: boolean; blurToClose?: boolean; controller?: AutocompleteController }
) {
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
			const focusableEls = elem.querySelectorAll('[tabindex]');
			const firstFocusableEl = focusableEls[0];
			const lastFocusableEl = focusableEls[focusableEls.length - 1];
			const KEYCODE_TAB = 9;
			const escKey = 27;

			elem.addEventListener('keydown', function (e: any) {
				let returnElem;
				let clickToClose;
				let blurToClose;
				let controller;

				if (typeof trapFocus !== 'boolean') {
					returnElem = trapFocus.returnelem;
					clickToClose = trapFocus.clickToClose;
					blurToClose = trapFocus.blurToClose;
					controller = trapFocus.controller;
				}
				//esc key
				if (e.keyCode == escKey) {
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
					if (blurToClose) {
						actionElem.blur && actionElem.blur();
					}
					if (controller) {
						controller.reset();
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
