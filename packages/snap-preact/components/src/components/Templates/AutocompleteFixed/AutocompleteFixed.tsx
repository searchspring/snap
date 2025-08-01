import { h, Fragment } from 'preact';
import { MutableRef, useEffect, useRef, useState } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { css } from '@emotion/react';
import type { AutocompleteController } from '@searchspring/snap-controller';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { AutocompleteLayout, AutocompleteLayoutProps } from '../../Organisms/AutocompleteLayout';
import { Modal, ModalProps } from '../../Molecules/Modal';
import classNames from 'classnames';
import { SearchInput, SearchInputProps } from '../../Molecules/SearchInput';
import { Overlay, OverlayProps } from '../../Atoms/Overlay';
import { debounce } from '@searchspring/snap-toolbox';
import { useA11y } from '../../../hooks';
import { useAcRenderedInput } from '../../../hooks/useAcRenderedInput';

const defaultStyles: StyleScript<AutocompleteFixedProps & { inputBounds: inputBounds }> = ({ inputBounds, offset, renderInput, width }) => {
	return css({
		position: 'absolute',
		left: '0',
		width: '100%',
		height: '100%',
		right: '0',
		top: '0',
		zIndex: 1001,

		'& .ss__autocomplete-fixed__inner': {
			position: 'absolute',
			left: `calc(0px + ${offset?.left || 0}px)`,
			top: `calc(0px + ${renderInput ? '0px' : `${inputBounds.height}px`} + ${offset?.top || 0}px)`,
			width: `calc(100% + ${offset?.width || 0}px)`,
			zIndex: 1001,
			maxWidth: '100vw',

			'.ss__search-input': {
				background: '#fff',
				width: `${inputBounds.width}px`,
				height: `${inputBounds.height}px`,
				border: '0px',
			},
		},
		'& .ss__autocomplete-fixed__inner__layout-wrapper': {
			width: width,
			overflowY: 'scroll',
			maxHeight: `calc(90vh - ${inputBounds.top || 0}px - ${renderInput ? `${inputBounds.height}px` : '0px'} + ${offset?.top || 0}px)`,
		},

		'& .ss__overlay': {
			zIndex: 1000,
		},
		'& .ss__search-input__button--close-search-icon': {
			border: 'none',
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
	const [inputName, setInputName] = useState('query');

	let input: string | Element | null | undefined = props.input;
	let buttonSelector = props.buttonSelector;
	let inputPlaceholderText: string | null | undefined = undefined;

	if (input) {
		if (typeof input === 'string') {
			input = document.querySelector(input);
		}
		const existingInputName = (input as HTMLInputElement)?.getAttribute('name');
		if (existingInputName) {
			setInputName(existingInputName);
			(input as HTMLInputElement).setAttribute('name', '');
		}
		inputPlaceholderText = (input as HTMLInputElement)?.getAttribute('placeholder');
	}

	if (!buttonSelector && input) {
		buttonSelector = input;
	}

	const { layout, disableStyles, controller, renderInput, overlayColor, className, offset, treePath } = props;

	const renderedInputRef: MutableRef<HTMLInputElement | null> = useRef(null);

	const reset = () => {
		controller.setFocused();
		setActive(false);
	};

	const subProps: AutocompleteFixedSubProps = {
		autocompleteLayout: {
			// default props
			layout: layout,
			onReset: () => reset(),
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
			lockScroll: false,
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
			placeholderText: inputPlaceholderText || undefined,
			submitSearchButton: {
				onClick: () => {
					() => reset();
					window.location.href = controller.store.state.url.link.href;
				},
			},
			clearSearchButton: {
				icon: 'close-thin',
			},
			closeSearchButton: {
				onClick: () => reset(),
			},
			inputName: inputName,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath: `${treePath} modal`,
		},
	};

	const getInputBounds = (inputElem: Element): inputBounds => {
		if (inputElem) {
			const elem = inputElem.getBoundingClientRect();
			return {
				top: elem.top + window.scrollY + (offset?.top || 0),
				left: elem.left + window.scrollX + (offset?.left || 0),
				width: elem.width,
				height: elem.height,
			};
		} else {
			//fallback if input element is not found
			return {
				top: 0,
				left: 0,
				width: 0,
				height: 0,
			};
		}
	};

	const [inputBounds, setInputBounds] = useState<inputBounds>(getInputBounds(input as Element));

	const debouncedHandleResize = debounce(() => {
		setInputBounds(getInputBounds(input as Element));
	}, 10);

	useEffect(() => {
		window.addEventListener('resize', debouncedHandleResize);
	}, []);

	const styling = mergeStyles<AutocompleteFixedProps & { inputBounds: inputBounds }>({ ...props, inputBounds }, defaultStyles);

	let _input;
	if (input) {
		_input = useAcRenderedInput({
			input: input as Element,
			controller,
			renderedInputRef,
			renderInput: Boolean(renderInput),
			buttonSelector,
			setActive: setActive,
		});
	}

	const acProps = {
		...props,
	};
	delete acProps.width;

	return layout?.length && active ? (
		<CacheProvider>
			<div {...styling} className={classNames('ss__autocomplete-fixed', className)}>
				<Modal {...subProps.modal}>
					<Fragment>
						<div className="ss__autocomplete-fixed__inner" ref={(e) => useA11y(e, 0, true, reset)}>
							{renderInput ? (
								<SearchInput {...subProps.searchInput} value={controller.store.state.input || ('' as string)} inputRef={renderedInputRef} />
							) : (
								<></>
							)}
							<div className="ss__autocomplete-fixed__inner__layout-wrapper">
								<AutocompleteLayout
									{...acProps}
									{...subProps.autocompleteLayout}
									input={_input!}
									controller={controller}
									treePath={`${treePath} modal`}
								/>
							</div>
						</div>

						<Overlay
							{...subProps.overlay}
							active={active}
							onClick={() => {
								reset();
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
	autocompleteLayout: Partial<AutocompleteLayoutProps>;
	modal: Partial<ModalProps>;
	searchInput: Partial<SearchInputProps>;
	overlay: Partial<OverlayProps>;
}

export interface AutocompleteFixedProps extends AutocompleteLayoutProps, ComponentProps {
	buttonSelector?: string | Element;
	overlayColor?: string;
	renderInput?: boolean;
	controller: AutocompleteController;
	offset?: Partial<Omit<inputBounds, 'height'>>;
}
