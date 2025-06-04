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
import { useAcRenderedInput } from '../../../hooks';

const defaultStyles: StyleScript<AutocompleteModalProps> = ({ width }) => {
	return css({
		border: '1px solid #eee',
		position: 'fixed',
		left: '0',
		width: '100%',
		hight: '100%',
		right: '0',
		top: '0',
		zIndex: 1001,

		'& .ss__autocomplete-modal__inner': {
			position: 'absolute',
			left: 0,
			right: 0,
			top: '10vh',
			marginLeft: 'auto',
			marginRight: 'auto',
			background: '#fff',
			zIndex: 1001,
			width: width,
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

	let input: string | Element | null | undefined = props.input;
	let buttonSelector = props.buttonSelector;

	let inputName = 'query';
	if (input) {
		if (typeof input === 'string') {
			input = document.querySelector(input);
		}
		const existingInputName = (input as HTMLInputElement)?.getAttribute('name');
		if (existingInputName) {
			inputName = existingInputName;
			(input as HTMLInputElement).setAttribute('name', '');
		}
	}

	if (!buttonSelector && input) {
		buttonSelector = input;
	}

	const { layout, disableStyles, controller, renderInput, overlayColor, className, treePath } = props;

	const renderedInputRef: MutableRef<HTMLInputElement | null> = useRef(null);

	const subProps: AutocompleteModalSubProps = {
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
			className: 'autocomplete-modal__modal',
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
			className: 'autocomplete-modal__overlay',
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
			className: 'autocomplete-modal__search-input',
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

	const styling = mergeStyles<AutocompleteModalProps>(props, defaultStyles);

	const reset = () => {
		controller.setFocused();
	};

	let _input;
	if (input) {
		_input = useAcRenderedInput({
			input,
			controller,
			renderedInputRef,
			renderInput: Boolean(renderInput),
			buttonSelector,
			setActive: setActive,
		});
	}

	return layout?.length && active ? (
		<CacheProvider>
			<div {...styling} className={classNames('ss__autocomplete-modal', className)}>
				<Modal {...subProps.modal}>
					<Fragment>
						<div className="ss__autocomplete-modal__inner">
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

interface AutocompleteModalSubProps {
	autocompleteTemplate: Partial<AutocompleteTemplateProps>;
	modal: Partial<ModalProps>;
	searchInput: Partial<SearchInputProps>;
	overlay: Partial<OverlayProps>;
}

export interface AutocompleteModalProps extends AutocompleteTemplateProps, ComponentProps {
	buttonSelector?: string | Element;
	overlayColor?: string;
	renderInput?: boolean;
	controller: AutocompleteController;
}
