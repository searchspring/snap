import { h, Fragment } from 'preact';
import { MutableRef, useRef, useState } from 'preact/hooks';

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
import { useA11y } from '../../../hooks';
import { useAcRenderedInput } from '../../../hooks/useAcRenderedInput';

const defaultStyles: StyleScript<AutocompleteModalProps> = ({ width, height, theme }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		position: 'fixed',
		left: '0',
		width: '100%',
		height: '100%',
		right: '0',
		top: '0',
		zIndex: 1001,

		'& .ss__autocomplete-modal__inner': {
			position: 'absolute',
			left: 0,
			right: 0,
			top: '10vh',
			maxHeight: '80vh',
			overflow: 'scroll',
			marginLeft: 'auto',
			marginRight: 'auto',
			background: '#fff',
			zIndex: 1001,
			width: width,
			height: height,
			maxWidth: '100vw',
		},
		'& .ss__overlay': {
			zIndex: 1000,
		},
		'& .ss__autocomplete': {
			position: 'relative',
		},
		'& .ss__search-input': {
			margin: '1px',
		},
		'& .input_wrapper input': {
			background: '#eee',
		},
		'& .ss__search-input__button--close-search-icon': {
			border: 'none',
		},

		[`@media (max-width: ${variables?.breakpoints.desktop}px)`]: {
			'& .ss__autocomplete-modal__inner': {
				top: '0',
				maxHeight: '100vh',
			},
		},
	});
};

export const AutocompleteModal = observer((properties: AutocompleteModalProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<AutocompleteModalProps> = {
		layout: [['c1', 'c2', 'c3']],
		overlayColor: 'rgba(0,0,0,0.8)',
		width: '950px',
		renderInput: true,
	};

	const props = mergeProps('autocompleteModal', globalTheme, defaultProps, properties);

	const [active, setActive] = useState(false);
	const [inputName, setInputName] = useState('query');

	let input: string | Element | null | undefined = props.input;
	let buttonSelector = props.buttonSelector;

	if (input) {
		if (typeof input === 'string') {
			input = document.querySelector(input);
		}
		const existingInputName = (input as HTMLInputElement)?.getAttribute('name');
		if (existingInputName) {
			setInputName(existingInputName);
			(input as HTMLInputElement).setAttribute('name', '');
		}
	}

	if (!buttonSelector && input) {
		buttonSelector = input;
	}

	const { layout, disableStyles, overlayColor, controller, renderInput, className, internalClassName, treePath } = props;

	const renderedInputRef: MutableRef<HTMLInputElement | null> = useRef(null);

	const reset = () => {
		controller.setFocused();
		setActive(false);
	};

	const subProps: AutocompleteModalSubProps = {
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
			internalClassName: 'autocomplete-modal__modal',
			buttonSelector: buttonSelector,
			onOverlayClick: () => reset(),
			overlayColor: overlayColor,
			open: active,
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
			internalClassName: 'autocomplete-modal__search-input',
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
				icon: 'angle-left',
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

	const styling = mergeStyles<AutocompleteModalProps>(props, defaultStyles);

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
	delete acProps.className;
	delete acProps.internalClassName;
	delete acProps.style;
	delete acProps.styleScript;
	delete acProps.themeStyleScript;

	return layout?.length && active ? (
		<CacheProvider>
			<div {...styling} className={classNames('ss__autocomplete-modal', className, internalClassName)}>
				<Modal {...subProps.modal}>
					<Fragment>
						<div className="ss__autocomplete-modal__inner" ref={(e) => useA11y(e, 0, true, reset)}>
							{renderInput ? (
								<SearchInput {...subProps.searchInput} value={controller.store.state.input || ('' as string)} inputRef={renderedInputRef} />
							) : (
								<></>
							)}
							<AutocompleteLayout
								{...acProps}
								{...subProps.autocompleteLayout}
								input={_input!}
								controller={controller}
								treePath={`${treePath} modal`}
							/>
						</div>
					</Fragment>
				</Modal>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface AutocompleteModalSubProps {
	autocompleteLayout: Partial<AutocompleteLayoutProps>;
	modal: Partial<ModalProps>;
	searchInput: Partial<SearchInputProps>;
}

export interface AutocompleteModalProps extends AutocompleteLayoutProps, ComponentProps {
	buttonSelector?: string | Element;
	overlayColor?: string;
	renderInput?: boolean;
	height?: string;
	controller: AutocompleteController;
}
