/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Icon, IconProps } from '../../Atoms/Icon';
import { useState } from 'react';

const CSS = {
	radioList: ({}: Partial<RadioListProps>) =>
		css({
			'& .ss__radio-list__options-wrapper': {
				border: 'none',
			},

			'.ss__radio-list__title': {
				margin: '0px',
				padding: '5px',
			},

			'.ss__radio-list__option': {
				cursor: 'pointer',
				'& label': {
					cursor: 'pointer',
				},
			},

			'.ss__radio-list__option--selected': {
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

export function RadioList(properties: RadioListProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RadioListProps> = {};

	const props = mergeProps('radioList', globalTheme, defaultProps, properties);

	const { titleText, onSelect, hideRadios, native, disabled, selected, options, disableStyles, className, style, styleScript } = props;

	const subProps: RadioListSubProps = {
		CheckedIcon: {
			// default props
			width: 20,
			height: 20,
			viewBox: undefined,
			icon: 'bullet',
			className: 'ss__list__option__radio__icon--checked',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
		UncheckedIcon: {
			// default props
			width: 20,
			height: 20,
			viewBox: undefined,
			icon: 'selected-bullet',
			className: 'ss__list__option__radio__icon--unchecked',
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
		styling.css = [CSS.radioList(stylingProps), style];
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
			<div {...styling} className={classnames('ss__radio-list', className)}>
				{titleText && <h5 className="ss__radio-list__title">{titleText}</h5>}

				<ul className="ss__radio-list__options-wrapper">
					{options.map((option: option) => {
						return (
							<li
								className={`ss__radio-list__option ${selection == option.value ? 'ss__radio-list__option--selected' : ''} ${
									disabled ? 'ss__radio-list__option--disabled' : ''
								}`}
								onClick={(e) => !disabled && makeSelection(e as any, option)}
							>
								{!hideRadios &&
									(native ? (
										<input
											className="ss__radio-list__option__radio"
											type="radio"
											id={option.value.toString()}
											disabled={disabled}
											name={option.value.toString()}
											checked={option.value == selection}
										/>
									) : option.value == selection ? (
										<Icon name={'ss__radio-list__option__radio__icon--checked'} {...subProps.CheckedIcon} />
									) : (
										<Icon name={'ss__radio-list__option__radio__icon--unchecked'} {...subProps.UncheckedIcon} />
									))}
								<label className="ss__radio-list__option__label">{option.label || option.value}</label>
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

export interface RadioListProps extends ComponentProps {
	options: option[];
	native?: boolean;
	hideRadios?: boolean;
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

interface RadioListSubProps {
	CheckedIcon: Partial<IconProps>;
	UncheckedIcon: Partial<IconProps>;
}
