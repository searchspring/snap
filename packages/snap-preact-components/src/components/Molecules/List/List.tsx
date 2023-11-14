/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS, ListOption, layoutOptionValue } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { useState } from 'react';
import { Checkbox, CheckboxProps } from '../Checkbox';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	List: ({ horizontal }: Partial<ListProps>) =>
		css({
			'& .ss__list__options-wrapper': {
				border: 'none',
				listStyle: 'none',
				padding: '0px',
				margin: '0px',
				display: `${horizontal ? 'flex' : 'initial'}`,
			},

			'.ss__list__title': {
				margin: '0px',
				padding: '5px',
			},

			'.ss__list__option': {
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				padding: '5px',

				'& .ss__list__option__label , .ss__list__option__icon': {
					cursor: 'pointer',
					padding: '0px 0px 0px 5px',
				},
			},

			'&.ss__list--disabled, .ss__list__option--disabled': {
				cursor: 'none',
				pointerEvents: 'none',
				opacity: 0.5,
			},
			'.ss__list__option--selected': {
				fontWeight: 'bold',
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
		icon: {
			// default props
			className: 'ss__list__option__icon',
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
	const [selection, setSelection] = useState(selected || []);

	const makeSelection = (e: React.MouseEvent<HTMLElement>, option: ListOption) => {
		if (multiSelect) {
			if (selection.includes(option)) {
				const newArray = [...selection];
				newArray.splice(newArray.indexOf(option), 1);

				if (onSelect) {
					onSelect(e, option, newArray);
				}
				setSelection(newArray);
			} else {
				const newArray = [...selection, option];

				if (onSelect) {
					onSelect(e, option, newArray);
				}
				setSelection(newArray);
			}
		} else {
			setSelection([option]);
		}
	};

	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__list', disabled ? 'ss__list--disabled' : '', className)}>
				{titleText && <h5 className="ss__list__title">{titleText}</h5>}

				<ul className={`ss__list__options-wrapper`}>
					{options.map((option: ListOption) => {
						return (
							<li
								className={`ss__list__option ${selection && selection.indexOf(option) > -1 ? 'ss__list__option--selected' : ''} ${
									option.disabled ? 'ss__list__option--disabled' : ''
								}`}
								title={option.label}
								onClick={(e) => !disabled && makeSelection(e as any, option)}
							>
								{!hideCheckbox && <Checkbox {...subProps.checkbox} checked={selection.indexOf(option) > -1} disableA11y={true} />}

								{(option.value as layoutOptionValue)?.icon ? (
									<Icon
										{...subProps.icon}
										{...(typeof (option.value as layoutOptionValue).icon == 'string'
											? { icon: (option.value as layoutOptionValue).icon as string }
											: ((option.value as layoutOptionValue)?.icon as Partial<IconProps>))}
									/>
								) : (
									<label className="ss__list__option__label">{option.label || option.value}</label>
								)}
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
	options: ListOption[];
	multiSelect?: boolean;
	hideCheckbox?: boolean;
	onSelect?: (e: React.MouseEvent<HTMLElement>, option: ListOption, optionList: ListOption[]) => void;
	titleText?: string;
	disabled?: boolean;
	horizontal?: boolean;
	native?: boolean;
	selected?: ListOption | ListOption[];
}

interface ListSubProps {
	checkbox: Partial<CheckboxProps>;
	icon: Partial<IconProps>;
}
