import { h, Fragment } from 'preact';
import { MutableRef, useEffect, useRef, useState } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { css } from '@emotion/react';
import type { AutocompleteController } from '@searchspring/snap-controller';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { AutocompleteLayout, AutocompleteLayoutProps } from '../../Organisms/AutocompleteLayout';
import { SlideDirectionType, Slideout, SlideoutProps } from '../../Molecules/Slideout';
import classNames from 'classnames';
import { SearchInput, SearchInputProps } from '../../Molecules/SearchInput';
import { useA11y } from '../../../hooks';
import { useAcRenderedInput } from '../../../hooks/useAcRenderedInput';

const defaultStyles: StyleScript<AutocompleteSlideoutProps> = ({}) => {
	return css({
		border: '1px solid #eee',

		'& .ss__autocomplete': {
			position: 'relative',
		},
		'& .input_wrapper input': {
			background: '#eee',
		},
		'& .ss__search-input__button--close-search-icon': {
			border: 'none',
		},
	});
};

export const AutocompleteSlideout = observer((properties: AutocompleteSlideoutProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<AutocompleteSlideoutProps> = {
		slideDirection: 'left',
		overlayColor: 'rgba(0,0,0,0.8)',
		layout: [['button.see-more'], ['termsList'], ['content']],
		width: '500px',
		renderInput: true,
	};

	const props = mergeProps('autocompleteSlideout', globalTheme, defaultProps, properties);

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

	const { layout, disableStyles, slideDirection, controller, overlayColor, renderInput, className, internalClassName, treePath, width } = props;

	const renderedInputRef: MutableRef<HTMLInputElement | null> = useRef(null);

	const reset = () => {
		setActive(false);
		controller.setFocused();
	};

	const subProps: AutocompleteSlideoutSubProps = {
		autocompleteLayout: {
			// default props
			onReset: () => reset(),
			layout: layout,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		slideout: {
			// default props
			width: width,
			rerender: false,
			overlayColor: overlayColor,
			slideDirection: slideDirection,
			buttonSelector: buttonSelector,
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
			internalClassName: 'autocomplete-slideout__search-input',
			inputName: inputName,
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
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			treePath: `${treePath} slideout`,
			theme: props?.theme,
		},
	};

	const styling = mergeStyles<AutocompleteSlideoutProps>(props, defaultStyles);

	const [active, setActive] = useState(false);

	let _input;
	if (input) {
		useEffect(() => {
			(input as Element).addEventListener('click', () => setActive(true));
		});

		_input = useAcRenderedInput({
			input: input as Element,
			controller,
			renderedInputRef,
			renderInput: Boolean(renderInput),
			buttonSelector,
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

	/***************************************/
	return layout?.length ? (
		<CacheProvider>
			<Slideout
				{...styling}
				{...subProps.slideout}
				className={classNames('ss__autocomplete-slideout', 'ss__autocomplete-slideout__slideout', className, internalClassName)}
				active={active}
			>
				<div ref={(e) => useA11y(e, 0, true, reset)}>
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
						treePath={`${treePath} slideout`}
					/>
				</div>
			</Slideout>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});
interface AutocompleteSlideoutSubProps {
	autocompleteLayout: Partial<AutocompleteLayoutProps>;
	slideout: Partial<SlideoutProps>;
	searchInput: Partial<SearchInputProps>;
}

export interface AutocompleteSlideoutProps extends AutocompleteLayoutProps, ComponentProps {
	overlayColor?: string;
	slideDirection?: SlideDirectionType;
	buttonSelector?: string | Element;
	renderInput?: boolean;
	controller: AutocompleteController;
}
