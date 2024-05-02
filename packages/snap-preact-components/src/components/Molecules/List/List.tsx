/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS, ListOption } from '../../../types';
import { defined } from '../../../utilities';
import { useState } from 'react';
import { Checkbox, CheckboxProps } from '../Checkbox';
import { useA11y } from '../../../hooks';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	List: ({ horizontal, clickableDisabledOptions }: Partial<ListProps>) =>
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
				cursor: `${clickableDisabledOptions ? 'pointer' : 'none'}`,
				pointerEvents: `${clickableDisabledOptions ? 'initial' : 'none'}`,
				opacity: 0.5,
			},
			'.ss__list__option--selected': {
				fontWeight: 'bold',
			},
		}),
};

export function List(properties: ListProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: ListProps = {
		// default props
		multiSelect: true,
		// global theme
		...globalTheme?.components?.list,
		// props
		...properties,
		...properties.theme?.components?.list,
	};

	const {
		titleText,
		onSelect,
		native,
		multiSelect,
		hideOptionLabels,
		clickableDisabledOptions,
		hideOptionIcons,
		hideOptionCheckboxes,
		disabled,
		options,
		disableStyles,
		className,
		style,
		horizontal,
	} = props;

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
	if (!disableStyles) {
		styling.css = [CSS.List({ horizontal, clickableDisabledOptions }), style];
	} else if (style) {
		styling.css = [style];
	}

	if (selected && !Array.isArray(selected)) {
		selected = [selected];
	}
	// selection state
	const [selection, setSelection] = useState((selected as ListOption[]) || []);

	const makeSelection = (e: React.MouseEvent<HTMLElement>, option: ListOption) => {
		if (multiSelect) {
			let newArray: ListOption[];

			if (selection.find((select) => select.value === option.value)) {
				newArray = [...selection];
				newArray.splice(
					newArray.findIndex((select) => select.value === option.value),
					1
				);
			} else {
				newArray = [...selection, option];
			}

			if (onSelect) {
				onSelect(e, option, newArray);
			}
			setSelection(newArray);
		} else {
			if (onSelect) {
				onSelect(e, option, [option]);
			}
			setSelection([option]);
		}
	};

	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__list', disabled ? 'ss__list--disabled' : '', className)}>
				{titleText && <h5 className="ss__list__title">{titleText}</h5>}

				<ul className={`ss__list__options-wrapper`} role="listbox" aria-label={titleText}>
					{options.map((option: ListOption) => {
						const selected = selection.some((select: ListOption) => select.value == option.value);
						return (
							<li
								className={`ss__list__option ${selected ? 'ss__list__option--selected' : ''} ${option.disabled ? 'ss__list__option--disabled' : ''}`}
								ref={(e) => useA11y(e)}
								onClick={(e) => (clickableDisabledOptions || !disabled) && makeSelection(e as any, option)}
								title={option.label}
								role="option"
								aria-selected={selected}
							>
								{!hideOptionCheckboxes && <Checkbox {...subProps.checkbox} checked={selected} disableA11y={true} />}

								{option.icon && !hideOptionIcons && (
									<Icon
										{...subProps.icon}
										{...(typeof option.icon == 'string' ? { icon: option.icon as string } : (option.icon as Partial<IconProps>))}
									/>
								)}

								{!hideOptionLabels && (option.label || !option.icon) && (
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
	hideOptionCheckboxes?: boolean;
	hideOptionLabels?: boolean;
	hideOptionIcons?: boolean;
	onSelect?: (e: React.MouseEvent<HTMLElement>, option: ListOption, selected: ListOption[]) => void;
	titleText?: string;
	disabled?: boolean;
	horizontal?: boolean;
	native?: boolean;
	selected?: ListOption | ListOption[];
	clickableDisabledOptions?: boolean;
}

interface ListSubProps {
	checkbox: Partial<CheckboxProps>;
	icon: Partial<IconProps>;
}
