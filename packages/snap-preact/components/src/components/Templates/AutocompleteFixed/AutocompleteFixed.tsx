import { h, Fragment } from 'preact';
import { MutableRef, useRef, useState } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { css } from '@emotion/react';
import type { AutocompleteController } from '@searchspring/snap-controller';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { AutocompleteTemplate, AutocompleteTemplateProps } from '../../Organisms/AutocompleteTemplate';
import { Modal, ModalProps } from '../../Atoms/Modal';
import classNames from 'classnames';
import { SearchInput, SearchInputProps } from '../../Molecules/SearchInput';
import { Overlay, OverlayProps } from '../../Atoms/Overlay';
import { debounce } from '@searchspring/snap-toolbox';
import { useAcRenderedInput } from '../../../hooks';

const defaultStyles: StyleScript<AutocompleteFixedProps & { inputBounds: inputBounds }> = ({ inputBounds, offset, renderInput }) => {
	return css({
		position: 'absolute',
		left: '0',
		width: '100%',
		hight: '100%',
		right: '0',
		top: '0',
		zIndex: 1001,

		'& .ss__autocomplete-fixed__inner': {
			position: 'absolute',
			left: `calc(0px + ${offset?.left || 0}px)`,
			top: `calc(0px + ${renderInput ? 0 : `${inputBounds.height}px`} + ${offset?.top || 0}px)`,
			width: `calc(100% + ${offset?.width || 0}px)`,

			background: '#fff',
			zIndex: 1001,
		},
		'& .ss__overlay': {
			zIndex: 1000,
		},
		'& .ss__autocomplete': {
			position: 'relative',
		},
	});
};

export const AutocompleteFixed = observer((properties: AutocompleteFixedProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<AutocompleteFixedProps> = {
		layout: [['c1', 'c2', 'c3']],
		renderInput: true,
	};

	const props = mergeProps('autocompleteFixed', globalTheme, defaultProps, properties);

	const [active, setActive] = useState(false);

	let input: string | Element | null | undefined = props.input;
	let buttonSelector = props.buttonSelector;
	if (input) {
		if (typeof input === 'string') {
			input = document.querySelector(input);
		}
	}

	if (!buttonSelector && input) {
		buttonSelector = input;
	}

	const inputName = (input as HTMLInputElement).getAttribute('name') || 'query';
	(input as HTMLInputElement).setAttribute('name', '');

	const { layout, disableStyles, controller, renderInput, overlayColor, className, offset, treePath } = props;

	const renderedInputRef: MutableRef<HTMLInputElement | null> = useRef(null);

	const subProps: AutocompleteFixedSubProps = {
		autocompleteTemplate: {
			// default props
			layout: layout,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		modal: {
			// default props
			className: 'autocomplete-fixed__modal',
			buttonSelector: buttonSelector,
			open: active,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		overlay: {
			// default props
			className: 'autocomplete-fixed__overlay',
			color: overlayColor,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		searchInput: {
			// default props
			className: 'autocomplete-fixed__search-input',
			inputName: inputName,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const getInputBounds = (inputElem: Element): inputBounds => {
		const elem = inputElem.getBoundingClientRect();
		return {
			top: elem.top + window.scrollY + (offset?.top || 0),
			left: elem.left + window.scrollX + (offset?.left || 0),
			width: elem.width,
			height: elem.height,
		};
	};

	const [inputBounds, setInputBounds] = useState<inputBounds>(getInputBounds(input as Element));

	const debouncedHandleResize = debounce(() => {
		setInputBounds(getInputBounds(input as Element));
	}, 10);

	window.addEventListener('resize', debouncedHandleResize);

	const styling = mergeStyles<AutocompleteFixedProps & { inputBounds: inputBounds }>({ ...props, inputBounds }, defaultStyles);

	const reset = () => {
		controller.setFocused();
	};

	const _input = useAcRenderedInput({
		input,
		controller,
		renderedInputRef,
		renderInput: Boolean(renderInput),
		buttonSelector,
		setActive: setActive,
	});

	return layout?.length && active ? (
		<CacheProvider>
			<div {...styling} className={classNames('ss__autocomplete-fixed', className)}>
				<Modal {...subProps.modal}>
					<Fragment>
						<div className="ss__autocomplete-fixed__inner">
							{renderInput ? <SearchInput {...subProps.searchInput} inputRef={renderedInputRef} /> : <></>}
							<AutocompleteTemplate {...props} {...subProps.autocompleteTemplate} input={_input!} controller={controller} />
						</div>

						<Overlay
							{...subProps.overlay}
							active={active}
							onClick={() => {
								reset();
								setActive(false);
							}}
						/>
					</Fragment>
				</Modal>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface inputBounds {
	top: number;
	left: number;
	width: number;
	height: number;
}

interface AutocompleteFixedSubProps {
	autocompleteTemplate: Partial<AutocompleteTemplateProps>;
	modal: Partial<ModalProps>;
	searchInput: Partial<SearchInputProps>;
	overlay: Partial<OverlayProps>;
}

export interface AutocompleteFixedProps extends AutocompleteTemplateProps, ComponentProps {
	buttonSelector?: string | Element;
	overlayColor?: string;
	renderInput?: boolean;
	controller: AutocompleteController;
	offset?: Partial<Omit<inputBounds, 'height'>>;
}
