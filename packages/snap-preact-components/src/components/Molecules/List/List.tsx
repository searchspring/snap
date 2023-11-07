/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { useState } from 'react';
import { Checkbox, CheckboxProps } from '../Checkbox';

const CSS = {
	List: ({ horizontal }: Partial<ListProps>) =>
		css({
			'& .ss__list__options-wrapper': {
				border: 'none',
				display: `${horizontal ? 'flex' : 'initial'}`,
			},

			'.ss__list__title': {
				margin: '0px',
				padding: '5px',
			},

			'.ss__list__option': {
				cursor: 'pointer',
				'& label': {
					cursor: 'pointer',
				},
			},

			'.ss__list__options-wrapper--disabled, .ss__list__option--disabled': {
				cursor: 'none',
				pointerEvents: 'none',
				opacity: 0.5,
			},
			'.ss__list__option--selected': {
				fontWeight: 'bold',
			},

			ul: {
				listStyle: 'none',
				padding: '0px',
				margin: '0px',
			},

			li: {
				display: 'flex',
				alignItems: 'center',
				padding: '5px',
			},
			'li label': {
				padding: '0px 0px 0px 5px',
			},
		}),
};

export function List(properties: ListProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<ListProps> = {
		multiSelect: true,
	};

	const props = mergeProps('list', globalTheme, defaultProps, properties);

	const { titleText, onSelect, native, multiSelect, hideCheckbox, disabled, options, disableStyles, className, style, styleScript } = props;

	let selected = props.selected;

	const subProps: ListSubProps = {
		checkbox: {
			// default props
			native: native,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.List(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	if (selected && !Array.isArray(selected)) {
		selected = [selected];
	}
	// selection state
	const [selection, setSelection] = useState<(string | number)[]>((selected as (string | number)[]) || []);

	const makeSelection = (e: React.MouseEvent<HTMLElement>, option: option) => {
		if (multiSelect) {
			if (selection.includes(option.value)) {
				const newArray = [...selection];
				newArray.splice(newArray.indexOf(option.value), 1);

				if (onSelect) {
					onSelect(e, option!, selection);
				}
				setSelection(newArray);
			} else {
				const newArray = [...selection, option.value];

				if (onSelect) {
					onSelect(e, option!);
				}
				setSelection(newArray);
			}
		} else {
			setSelection([option.value]);
		}
	};

	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__list', className)}>
				{titleText && <h5 className="ss__list__title">{titleText}</h5>}

				<ul className={`ss__list__options-wrapper ${disabled ? 'ss__list__options-wrapper--disabled' : ''}`}>
					{options.map((option: option) => {
						return (
							<li
								className={`ss__list__option ${selection && selection.indexOf(option.value.toString()) > -1 ? 'ss__list__option--selected' : ''} ${
									option.disabled ? 'ss__list__option--disabled' : ''
								}`}
								onClick={(e) => !disabled && makeSelection(e as any, option)}
							>
								{!hideCheckbox && <Checkbox {...subProps.checkbox} checked={selection.indexOf(option.value.toString()) > -1} disableA11y={true} />}
								<label className="ss__list__option__label">{option.label || option.value}</label>
							</li>
						);
					})}
				</ul>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export interface ListProps extends ComponentProps {
	options: option[];
	multiSelect?: boolean;
	hideCheckbox?: boolean;
	onSelect?: (e: React.MouseEvent<HTMLElement>, option: option, optionList?: string | number | undefined | (string | number)[]) => void;
	titleText?: string;
	disabled?: boolean;
	horizontal?: boolean;
	native?: boolean;
	selected?: string | number | (string | number)[];
}

type option = {
	value: string | number;
	label?: string;
	disabled?: boolean;
	[otherOptions: string]: any;
};

interface ListSubProps {
	checkbox: Partial<CheckboxProps>;
}
