import type { AutocompleteController } from '@searchspring/snap-controller';
import { useState, MutableRef, useEffect } from 'preact/hooks';

export function useAcRenderedInput({
	input,
	controller,
	renderInput,
	buttonSelector,
	renderedInputRef,
	setActive,
}: {
	input: Element;
	controller: AutocompleteController;
	renderedInputRef: MutableRef<HTMLInputElement | null>;
	renderInput: boolean;
	buttonSelector?: string | Element;
	setActive?: (active: boolean) => void;
}) {
	const [_input, setInput] = useState<Element | null>(input);
	const [renderedInputInitialized, setRenderedInputInitialized] = useState(false);

	useEffect(() => {
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
							controller.config.selector = '.ss__search-input__input';
							setInput(renderedInputRef!.current);
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
		if (input !== _input) {
			//this is used to keep the values consistent between the native input and the rendered input
			_input?.addEventListener('input', () => {
				(input as HTMLInputElement).value = (_input as HTMLInputElement).value;
			});
		}
	});

	return _input;
}
