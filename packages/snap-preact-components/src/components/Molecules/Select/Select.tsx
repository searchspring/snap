/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { defined, mergeProps } from '../../../utilities';
import { ComponentProps, StylingCSS, ListOption } from '../../../types';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { useA11y } from '../../../hooks/useA11y';

const CSS = {
	select: ({ color, backgroundColor, borderColor, theme }: Partial<SelectProps>) =>
		css({
			display: 'inline-flex',
			color: color,
			'&.ss__select--disabled': {
				opacity: 0.7,
			},
			'& .ss__select__dropdown__button__icon': {
				margin: 'auto 0 auto 5px',
			},
			'& .ss__select__label': {
				marginRight: '5px',
			},

			'& .ss__select__selection__icon': {
				margin: '0px 5px 0px 0px',
			},

			'& .ss__select__select': {
				position: 'relative',
				zIndex: '10000',
				backgroundColor: backgroundColor || '#fff',
				listStyle: 'none',
				padding: '0',
				marginTop: '-1px',
				border: `1px solid ${borderColor || color || theme?.colors?.primary || '#333'}`,

				'.ss__select__dropdown__button': {
					alignItems: 'center',
				},

				'& .ss__select__select__option': {
					cursor: 'pointer',
					padding: '6px 8px',
					color: 'initial',
					display: 'flex',
					alignItems: 'center',

					'& .ss__select__select__option__icon': {
						margin: '0px 5px 0px 0px',
					},

					'&.ss__select__select__option--selected': {
						fontWeight: 'bold',
					},
					'&:hover': {
						backgroundColor: theme?.colors?.hover || '#f8f8f8',
					},
				},
			},
		}),
	native: ({}) => css({}),
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
		style,
		styleScript,
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
				size: '14px',
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	// open state
	const [open, setOpen] = useState<boolean>(Boolean(startOpen));

	// selection state
	const [selection, setSelection] = useState<ListOption | undefined>(selected);

	if (selection && clearSelection) {
		options = [
			{
				label: clearSelection,
				value: '',
			},
			...options,
		];
	}

	const makeSelection = (e: React.ChangeEvent<HTMLSelectElement>, option?: ListOption) => {
		if (option != selection) {
			onSelect && onSelect(e, option);
		}

		setSelection(option);

		!stayOpenOnSelection && setOpen(false);
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		if (native) {
			styling.css = [CSS.native(stylingProps), style];
		} else {
			styling.css = [CSS.select(stylingProps), style];
		}
	} else if (style) {
		styling.css = [style];
	}

	const selectedOptions = options.filter((option) => selection?.value === option.value);

	// options can be an Array or ObservableArray - but should have length
	return typeof options == 'object' && options?.length ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__select', { 'ss__select--disabled': disabled }, className)}>
				{native ? (
					<>
						{label && !hideLabelOnSelection && (
							<span className="ss__select__label">
								{label}
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
										return (
											option.label == selectedOptionElement.text &&
											(option.value == selectedOptionElement.value || option.label == selectedOptionElement.value || option.value == index)
										);
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
								<option
									className="ss__select__select__option"
									selected={selection?.value === option.value || selection?.label == option.label}
									value={(typeof option.value == 'number' || typeof option.value == 'string' ? option.value : option.label) ?? index}
								>
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
							<Button {...subProps.button} disableA11y={true}>
								{label && !hideLabelOnSelection && (
									<span
										className="ss__select__label"
										ref={(e) => useA11y(e)}
										aria-label={`${label} dropdown, ${options.length} options ${
											selectedOptions.length ? `, Currently selected option is ${selectedOptions[0].label}` : ''
										}`}
										aria-expanded={open}
										role="button"
									>
										{label}
										{separator && selection && <span className="ss__select__label__separator">{separator}</span>}
									</span>
								)}

								{selection && !hideSelection && (
									<>
										{selection.icon && !hideOptionIcons && (
											<Icon
												{...subProps.icon}
												className="ss__select__selection__icon"
												{...(typeof selection.icon == 'string' ? { icon: selection.icon as string } : (selection.icon as Partial<IconProps>))}
											/>
										)}
										{!hideOptionLabels && <span className="ss__select__selection">{selection?.label}</span>}
									</>
								)}
								{!hideIcon && <Icon {...subProps.icon} icon={open ? iconClose : iconOpen} />}
							</Button>
						}
					>
						<ul className="ss__select__select">
							{options.map((option, idx) => (
								<li
									ref={(e) => useA11y(e)}
									role={'link'}
									aria-disabled={option.disabled}
									aria-label={`${selection?.value === option.value ? 'selected option,' : ''} option ${idx + 1} of ${options.length}, ${
										option.label
									}`}
									title={option.label}
									className={classnames('ss__select__select__option', {
										'ss__select__select__option--selected': selection?.value === option.value,
									})}
									onClick={(e) => !disabled && makeSelection(e as any, option)}
								>
									{option.icon && !hideOptionIcons && (
										<Icon
											{...subProps.icon}
											className="ss__select__select__option__icon"
											{...(typeof option.icon == 'string' ? { icon: option.icon as string } : (option.icon as Partial<IconProps>))}
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
	iconClose?: IconType | string;
	iconOpen?: IconType | string;
	label?: string | JSX.Element;
	native?: boolean;
	onSelect?: (e: React.ChangeEvent<HTMLSelectElement>, option: ListOption | undefined) => void;
	selected?: ListOption;
	separator?: string | JSX.Element;
	startOpen?: boolean;
	stayOpenOnSelection?: boolean;
	hideSelection?: boolean;
	hideIcon?: boolean;
	hideOptionIcons?: boolean;
	hideOptionLabels?: boolean;
}
