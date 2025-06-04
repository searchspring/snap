import { h, Fragment } from 'preact';
import { MutableRef, useRef } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { css } from '@emotion/react';
import type { AutocompleteController } from '@searchspring/snap-controller';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { AutocompleteTemplate, AutocompleteTemplateProps } from '../../Organisms/AutocompleteTemplate';
import { SlideDirectionType, Slideout, SlideoutProps } from '../../Molecules/Slideout';
import classNames from 'classnames';
import { SearchInput, SearchInputProps } from '../../Molecules/SearchInput';
import { useAcRenderedInput } from '../../../hooks';

const defaultStyles: StyleScript<AutocompleteSlideoutProps> = ({}) => {
	return css({
		border: '1px solid #eee',

		'& .ss__autocomplete': {
			position: 'relative',
		},
		'& .input_wrapper input': {
			background: '#eee',
		},
	});
};

export const AutocompleteSlideout = observer((properties: AutocompleteSlideoutProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<AutocompleteSlideoutProps> = {
		slideDirection: 'left',
		overlayColor: 'rgba(0,0,0,0)',
		layout: [['button.see-more'], ['termsList'], ['content']],
		width: '500px',
		renderInput: true,
	};

	const props = mergeProps('autocompleteSlideout', globalTheme, defaultProps, properties);

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

	const { layout, disableStyles, slideDirection, controller, overlayColor, renderInput, className, treePath, width } = props;

	const renderedInputRef: MutableRef<HTMLInputElement | null> = useRef(null);

	const subProps: AutocompleteSlideoutSubProps = {
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
			className: 'autocomplete-slideout__search-input',
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

	const styling = mergeStyles<AutocompleteSlideoutProps>(props, defaultStyles);

	const _input = useAcRenderedInput({
		input,
		controller,
		renderedInputRef,
		renderInput: Boolean(renderInput),
		buttonSelector,
	});

	/***************************************/
	return layout?.length ? (
		<CacheProvider>
			<Slideout
				{...styling}
				{...subProps.slideout}
				className={classNames('ss__autocomplete-slideout', 'ss__autocomplete-slideout__slideout', className)}
			>
				{renderInput ? <SearchInput {...subProps.searchInput} inputRef={renderedInputRef} /> : <></>}
				<AutocompleteTemplate {...props} {...subProps.autocompleteTemplate} input={_input!} controller={controller} />
			</Slideout>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface AutocompleteSlideoutSubProps {
	autocompleteTemplate: Partial<AutocompleteTemplateProps>;
	slideout: Partial<SlideoutProps>;
	searchInput: Partial<SearchInputProps>;
}

export interface AutocompleteSlideoutProps extends AutocompleteTemplateProps, ComponentProps {
	overlayColor?: string;
	slideDirection?: SlideDirectionType;
	buttonSelector?: string | Element;
	renderInput?: boolean;
	controller: AutocompleteController;
}
