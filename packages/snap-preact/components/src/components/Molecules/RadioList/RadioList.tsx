import { Fragment, h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties, ListOption } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { useState } from 'react';
import { Radio, RadioProps } from '../Radio/Radio';
import { Lang, useA11y, useLang } from '../../../hooks';
import { Icon, IconProps } from '../../Atoms/Icon';
import deepmerge from 'deepmerge';

const CSS = {
	radioList: ({}: Partial<RadioListProps>) =>
		css({
			'& .ss__radio-list__options-wrapper': {
				border: 'none',
				listStyle: 'none',
				padding: '0px',
				margin: '0px',
			},

			'.ss__radio-list__title': {
				margin: '0px',
				padding: '5px',
			},

			'.ss__radio-list__option': {
				cursor: 'pointer',
				display: 'flex',
				alignItems: 'center',
				padding: '5px',

				'& .ss__radio-list__option__label, .ss__radio-list__option__icon': {
					cursor: 'pointer',
					padding: '0px 0px 0px 5px',
				},
			},

			'&.ss__radio-list--disabled, .ss__radio-list__option--disabled': {
				cursor: 'none',
				pointerEvents: 'none',
				opacity: 0.5,
			},

			'.ss__radio-list__option--selected': {
				fontWeight: 'bold',
			},
		}),
};

export function RadioList(properties: RadioListProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RadioListProps> = {};

	const props = mergeProps('radioList', globalTheme, defaultProps, properties);

	const {
		titleText,
		onSelect,
		hideOptionRadios,
		hideOptionIcons,
		hideOptionLabels,
		native,
		disabled,
		selected,
		options,
		disableStyles,
		className,
		style,
		styleScript,
		treePath,
	} = props;

	const subProps: RadioListSubProps = {
		Radio: {
			className: 'ss__radio-list__option__radio',
			native: native,
			disableA11y: true,
			disabled: disabled,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		Icon: {
			className: 'ss__radio-list__option__icon',
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = { ...props };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.radioList(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	// selection state
	const [selection, setSelection] = useState<ListOption | undefined>(selected);

	// reset selection if 'selected' prop changes
	try {
		if (selection && selected) {
			const selectionstr = JSON.stringify(selection);
			const selectedstr = JSON.stringify(selected);
			if (selectionstr !== selectedstr) {
				setSelection(selected);
			}
		}
	} catch (e) {
		// noop
	}

	const makeSelection = (e: React.MouseEvent<HTMLElement>, option: ListOption) => {
		if (onSelect) {
			onSelect(e, option!);
		}

		setSelection(option);
	};

	//initialize lang
	const defaultLang = {};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		options,
		selectedOptions: selection,
	});

	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__radio-list', disabled ? 'ss__radio-list--disabled' : '', className)}>
				{(titleText || lang?.title?.value) && (
					<h5 className="ss__radio-list__title" {...mergedLang.title?.all}>
						{titleText}
					</h5>
				)}

				<ul className={`ss__radio-list__options-wrapper`} role="listbox" aria-label={titleText}>
					{options.map((option: ListOption) => {
						const selected = selection && selection.value == option.value;
						return (
							<li
								className={`ss__radio-list__option ${selected ? 'ss__radio-list__option--selected' : ''} ${
									option.disabled ? 'ss__radio-list__option--disabled' : ''
								}`}
								ref={(e) => useA11y(e)}
								onClick={(e) => !disabled && makeSelection(e, option)}
								title={option.label}
								role="option"
								aria-selected={selected}
							>
								{!hideOptionRadios && <Radio {...subProps.Radio} checked={selected} disableA11y={true} />}

								{option.icon && !hideOptionIcons && (
									<Icon {...subProps.Icon} {...(typeof option.icon == 'string' ? { icon: option.icon } : (option.icon as Partial<IconProps>))} />
								)}

								{!hideOptionLabels && (option.label || !option.icon) && (
									<label className="ss__radio-list__option__label">{option.label || option.value}</label>
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

export interface RadioListProps extends ComponentProps {
	options: ListOption[];
	native?: boolean;
	hideOptionRadios?: boolean;
	hideOptionLabels?: boolean;
	hideOptionIcons?: boolean;
	onSelect?: (e: React.MouseEvent<HTMLElement>, option: ListOption) => void;
	titleText?: string;
	disabled?: boolean;
	selected?: ListOption;
	lang?: Partial<RadioListLang>;
}

export interface RadioListLang {
	title?: Lang<{
		options: ListOption[];
		selectedOptions: ListOption[];
	}>;
}

interface RadioListSubProps {
	Radio: Partial<RadioProps>;
	Icon: Partial<IconProps>;
}
