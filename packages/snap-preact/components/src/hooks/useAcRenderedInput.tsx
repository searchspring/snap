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

	const onClick = () => {
		if (setActive) {
			setActive(true);
		}

		//this is needed to await the rendered input to render before binding the controller
		setTimeout(async () => {
			if (!renderedInputInitialized) {
				setInput(renderedInputRef!.current);

				controller.config.selector = '.ss__search-input__input';
				await controller.bind();
				renderedInputRef?.current?.focus();
			}
			setRenderedInputInitialized(true);
		});
	};

	useEffect(() => {
		if (renderInput && buttonSelector) {
			let button;
			if (typeof buttonSelector == 'string') {
				button = document.querySelector(buttonSelector);
			} else {
				button = buttonSelector;
			}
			if (button) {
				button.addEventListener('click', (e) => {
					e.stopPropagation();
					onClick();
				});
				button.addEventListener('focus', () => onClick());
				button.addEventListener('select', () => onClick());
			}
		} else {
			if (setActive) {
				(input as Element)!.addEventListener('click', (e) => {
					e.stopPropagation();
					setActive(true);
				});
				(input as Element)!.addEventListener('focus', () => setActive(true));
				(input as Element)!.addEventListener('select', () => setActive(true));
			}
		}
	}, []);

	// this is used to keep the values consistent between the native input and the rendered input
	useEffect(() => {
		if (input !== _input) {
			_input?.addEventListener('input', () => {
				(input as HTMLInputElement).value = (_input as HTMLInputElement).value;
			});
		}
	}, [_input]);

	return _input;
}
