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
	List: ({}: Partial<ListProps>) =>
		css({
			'& .ss__list__options-wrapper': {
				border: 'none',
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

			'.ss__list--selected': {
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
	const defaultProps: Partial<ListProps> = {};

	const props = mergeProps('list', globalTheme, defaultProps, properties);

	const { titleText, onSelect, hideCheckbox, disabled, selected, options, disableStyles, className, style, styleScript } = props;

	const subProps: ListSubProps = {
		checkbox: {
			// default props
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

	// selection state
	const [selection, setSelection] = useState<string | number | undefined>(selected);

	const makeSelection = (e: React.MouseEvent<HTMLElement>, option: option) => {
		if (onSelect) {
			onSelect(e, option!);
		}

		setSelection(option?.value);
	};

	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__list', className)}>
				{titleText && <h5 className="ss__list__title">{titleText}</h5>}

				<ul className="ss__list__options-wrapper">
					{options.map((option: option) => {
						return (
							<li
								className={`ss__list__option ${selection == option.value ? 'ss__list__option--selected' : ''} ${
									disabled ? 'ss__list__option--disabled' : ''
								}`}
								onClick={(e) => !disabled && makeSelection(e as any, option)}
							>
								{!hideCheckbox && <Checkbox {...subProps.checkbox} checked={option.value == selection} disableA11y={true} />}
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
	hideCheckbox?: boolean;
	onSelect?: (e: React.MouseEvent<HTMLElement>, option: option) => void;
	titleText?: string;
	disabled?: boolean;
	selected?: string | number;
}

type option = {
	value: string | number;
	label?: string;
	[otherOptions: string]: any;
};

interface ListSubProps {
	checkbox: Partial<CheckboxProps>;
}
