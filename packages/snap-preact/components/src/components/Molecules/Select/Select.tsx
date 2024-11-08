import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

import { observer } from 'mobx-react';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { ComponentProps, ListOption, StyleScript } from '../../../types';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { useA11y } from '../../../hooks/useA11y';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';
import Color from 'color';

const defaultStyles: StyleScript<SelectProps> = ({ color, backgroundColor, borderColor, theme, native }) => {
	const lightenedPrimary = new Color(backgroundColor || color || theme?.variables?.colors?.primary).lightness(95);
	if (!native) {
		return css({
			display: 'inline-flex',
			color: color,
			'&.ss__select--disabled': {
				opacity: 0.7,
			},

			'.ss__select__selection__icon': {
				margin: '0px 5px 0px 0px',
			},

			'.ss__button__content': {
				display: 'flex',
				alignItems: 'center',
				gap: '5px',
			},

			'.ss__select__select': {
				position: 'relative',
				zIndex: '10000',
				backgroundColor: backgroundColor || '#fff',
				listStyle: 'none',
				padding: '0',
				marginTop: '-1px',
				border: `1px solid ${borderColor || color || theme?.variables?.colors?.primary || '#333'}`,

				'.ss__select__dropdown__button': {
					alignItems: 'center',
				},

				'.ss__select__select__option': {
					cursor: 'pointer',
					padding: '6px 8px',
					color: 'initial',
					display: 'flex',
					alignItems: 'center',

					'&.ss__select__select__option--selected': {
						fontWeight: 'bold',
					},
					'&:hover': {
						backgroundColor: lightenedPrimary.hex() || '#f8f8f8',
					},
				},
			},
		});
	} else {
		return css({});
	}
};

export const Select = observer((properties: SelectProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const defaultProps: Partial<SelectProps> = {
		iconOpen: 'angle-down',
		iconClose: 'angle-up',
		separator: ': ',
		startOpen: false,
	};

	const props = mergeProps('select', globalTheme, defaultProps, properties);

	const {
		backgroundColor,
		borderColor,
		color,
		clearSelection,
		disableClickOutside,
		disabled,
		hideLabel,
		hideLabelOnSelection,
		iconColor,
		iconClose,
		iconOpen,
		label,
		native,
		onSelect,
		selected,
		separator,
		startOpen,
		hideIcon,
		hideOptionIcons,
		hideOptionLabels,
		hideSelection,
		stayOpenOnSelection,
		disableStyles,
		className,
		treePath,
	} = props;
	let { options } = props;

	const subProps: SelectSubProps = {
		dropdown: {
			className: 'ss__select__dropdown',
			// global theme
			...globalTheme?.components?.dropdown,
			// inherited props
			...defined({
				disableStyles,
				disabled,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		button: {
			// default props
			className: 'ss__select__dropdown__button',
			// global theme
			...globalTheme?.components?.button,
			// inherited props
			...defined({
				disableStyles,
				disabled,
				color,
				backgroundColor,
				borderColor,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
		icon: {
			// default props
			className: 'ss__select__dropdown__button__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
				color: iconColor || color,
				size: '12px',
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	// open state
	const [open, setOpen] = useState<boolean>(Boolean(startOpen));

	// selection state
	const [selection, setSelection] = useState<ListOption | undefined>(selected);

	// original selection state
	const [originalSelected] = useState(selected as ListOption);
	// reset selection if 'selected' prop changes
	try {
		if (selected) {
			const originalSelectedstr = JSON.stringify(originalSelected);
			const selectedstr = JSON.stringify(selected);
			const selectionstr = JSON.stringify(selection);
			if (originalSelectedstr !== selectedstr && selectedstr !== selectionstr) {
				setSelection(selected);
			}
		}
	} catch (e) {
		// noop
	}

	if (selection && clearSelection) {
		options = [
			{
				label: clearSelection,
				value: '',
			},
			...options,
		];
	}

	const makeSelection = (e: React.ChangeEvent<HTMLSelectElement> | React.MouseEvent<HTMLElement>, option?: ListOption) => {
		if (option != selection) {
			onSelect && onSelect(e, option);
		}

		setSelection(option);

		!stayOpenOnSelection && setOpen(false);
	};

	const styling = mergeStyles<SelectProps>(props, defaultStyles);

	const selectedOptions = options.filter((option) => selection?.value === option.value);

	//initialize lang
	const defaultLang = {
		buttonLabel: {
			value: label,
			attributes: {
				'aria-label': `${label} dropdown, ${options.length} options ${
					selectedOptions.length ? `, Currently selected option is ${selectedOptions[0].label}` : ''
				}`,
			},
		},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		options,
		selectedOptions,
		label,
		open,
	});

	// options can be an Array or ObservableArray - but should have length
	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__select', { 'ss__select--native': native }, { 'ss__select--disabled': disabled }, className)}>
				{native ? (
					<>
						{(label || lang.buttonLabel.value) && !hideLabel && !hideLabelOnSelection && (
							<span className="ss__select__label">
								<label {...mergedLang.buttonLabel?.all}></label>
								{separator && <span className="ss__select__label__separator">{separator}</span>}
							</span>
						)}

						<select
							className="ss__select__select"
							disabled={disabled || undefined}
							onChange={(e) => {
								const selectElement = e.target;
								const selectedOptionElement = selectElement.options[selectElement.selectedIndex];
								const selectedOption = options
									.filter((option, index) => {
										return option.label == selectedOptionElement.text && (option.value == selectedOptionElement.value || option.value == index);
									})
									.pop();
								!disabled && makeSelection(e, selectedOption);
							}}
						>
							{!selection && clearSelection && (
								<option className="ss__select__select__option" selected value="">
									{clearSelection}
								</option>
							)}
							{options.map((option, index) => (
								<option className="ss__select__select__option" selected={selection?.value === option.value} value={option.value ?? index}>
									{option.label}
								</option>
							))}
						</select>
					</>
				) : (
					<Dropdown
						{...subProps.dropdown}
						disableClickOutside={disableClickOutside}
						open={open}
						onToggle={(e, state) => setOpen((prev) => state ?? !prev)}
						onClick={() => setOpen((prev) => !prev)}
						disableA11y
						button={
							<Button {...subProps.button}>
								{(label || lang.buttonLabel.value) && !hideLabelOnSelection && !hideLabel && (
									<span className="ss__select__label" aria-expanded={open} {...mergedLang.buttonLabel.attributes}>
										<label {...mergedLang.buttonLabel.value}></label>
										{separator && selection && <span className="ss__select__label__separator">{separator}</span>}
									</span>
								)}

								{selection && !hideSelection && (
									<>
										{selection.icon && !hideOptionIcons && (
											<Icon
												{...subProps.icon}
												className="ss__select__selection__icon"
												name={'selection'}
												{...(typeof selection.icon == 'string' ? { icon: selection.icon } : (selection.icon as Partial<IconProps>))}
											/>
										)}
										{!hideOptionLabels && <span className="ss__select__selection">{selection?.label}</span>}
									</>
								)}
								{!hideIcon && (
									<Icon
										{...subProps.icon}
										name={open ? 'open' : 'close'}
										{...(open
											? { ...(typeof iconClose == 'string' ? { icon: iconClose } : (iconClose as Partial<IconProps>)) }
											: { ...(typeof iconOpen == 'string' ? { icon: iconOpen } : (iconOpen as Partial<IconProps>)) })}
									/>
								)}
							</Button>
						}
					>
						<ul
							className="ss__select__select"
							role="listbox"
							aria-label={typeof label == 'string' ? label : ''}
							ref={(e) => useA11y(e, -1, true, () => setOpen(false))}
						>
							{options.map((option) => (
								<li
									ref={(e) => useA11y(e)}
									aria-disabled={option.disabled}
									title={option.label}
									className={classnames('ss__select__select__option', {
										'ss__select__select__option--selected': selection?.value === option.value,
									})}
									onClick={(e) => !disabled && makeSelection(e, option)}
									role="option"
									aria-selected={selection?.value === option.value}
								>
									{option.icon && !hideOptionIcons && (
										<Icon
											{...subProps.icon}
											name={'option'}
											className="ss__select__select__option__icon"
											{...(typeof option.icon == 'string' ? { icon: option.icon } : (option.icon as Partial<IconProps>))}
										/>
									)}
									{!hideOptionLabels && <span>{option.label}</span>}
								</li>
							))}
						</ul>
					</Dropdown>
				)}
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface SelectSubProps {
	button: Partial<ButtonProps>;
	dropdown: Partial<DropdownProps>;
	icon: Partial<IconProps>;
}

export interface SelectProps extends ComponentProps {
	options: ListOption[];
	backgroundColor?: string;
	borderColor?: string;
	color?: string;
	clearSelection?: string;
	disableClickOutside?: boolean;
	disabled?: boolean;
	hideLabelOnSelection?: boolean;
	iconColor?: string;
	iconClose?: IconType | Partial<IconProps>;
	iconOpen?: IconType | Partial<IconProps>;
	label?: string | JSX.Element;
	hideLabel?: boolean;
	native?: boolean;
	onSelect?: (e: React.ChangeEvent<HTMLSelectElement> | React.MouseEvent<HTMLElement>, option?: ListOption) => void;
	selected?: ListOption;
	separator?: string | JSX.Element;
	startOpen?: boolean;
	stayOpenOnSelection?: boolean;
	hideSelection?: boolean;
	hideIcon?: boolean;
	hideOptionIcons?: boolean;
	hideOptionLabels?: boolean;
	lang?: Partial<SelectLang>;
}

export interface SelectLang {
	buttonLabel: Lang<{
		options: ListOption[];
		selectedOptions: ListOption[];
		label: string;
		open: boolean;
	}>;
}
