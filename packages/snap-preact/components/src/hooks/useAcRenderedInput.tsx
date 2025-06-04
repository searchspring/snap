import type { AutocompleteController } from '@searchspring/snap-controller';
import { useState, MutableRef } from 'preact/hooks';

export function useAcRenderedInput({
	input,
	controller,
	renderInput,
	buttonSelector,
	renderedInputRef,
	setActive,
}: {
	input: string | Element | null;
	controller: AutocompleteController;
	renderedInputRef: MutableRef<HTMLInputElement | null>;
	renderInput: boolean;
	buttonSelector?: string | Element;
	setActive?: (active: boolean) => void;
}) {
	const [_input, setInput] = useState(input);
	const [renderedInputInitialized, setRenderedInputInitialized] = useState(false);

	if (renderInput && buttonSelector) {
		let button;
		if (typeof buttonSelector == 'string') {
			button = document.querySelector(buttonSelector);
		} else {
			button = buttonSelector;
		}
		if (button) {
			button.addEventListener('click', () => {
				if (setActive) {
					setActive(true);
				}

				setTimeout(() => {
					if (!renderedInputInitialized) {
						(controller.config.selector = '.ss__search-input__input'), setInput(renderedInputRef!.current);
						controller.bind();
						renderedInputRef?.current?.focus();
						// if we want to reset the search input on open, uncomment the line below
						// reset();
					}
					setRenderedInputInitialized(true);
				});
			});
		}
	} else {
		if (setActive) {
			(input as Element)!.addEventListener('click', () => {
				setActive(true);
			});
		}
	}

	return _input;
}
