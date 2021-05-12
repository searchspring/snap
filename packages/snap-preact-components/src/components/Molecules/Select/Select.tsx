/** @jsx jsx */
import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

import { observer } from 'mobx-react-lite';
import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme } from '../../../providers/theme';
import { defined } from '../../../utilities';
import { ComponentProps } from '../../../types';
import { Dropdown, DropdownProps } from '../../Atoms/Dropdown';
import { Button, ButtonProps } from '../../Atoms/Button';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';

const CSS = {
	select: ({ color, backgroundColor, borderColor, label, selection, hideLabelOnSelection, theme, style }) =>
		css({
			display: 'inline-flex',
			color: color,
			'&.ss-disabled': {
				opacity: 0.3,
				'& .ss-select__button': {
					opacity: 1,
				},
			},
			'& .ss-dropdown': {
				flex: '1 0 auto',
				'& .ss-dropdown__button': {
					zIndex: 1,
					position: 'relative',
				},
				'& .ss-dropdown__content': {
					zIndex: 3,
				},
			},
			'& .ss-select__button': {
				display: 'flex',
				flex: '1 0 auto',
				alignItems: 'center',
				justifyContent: 'space-between',
				'& .ss-select__button-icon': {
					order: 3,
					padding: '0 0 0 10px',
				},
				'& .ss-select__button-text': {
					order: 1,
				},
				'& .ss-select__button-label': {
					fontWeight: 'bold',
				},
				'& .ss-select__button-selected': {
					paddingLeft: label && !(selection && hideLabelOnSelection) ? '5px' : 0,
					fontWeight: label && !(selection && hideLabelOnSelection) ? 'normal' : 'bold',
				},
			},
			'& .ss-select__options': {
				backgroundColor: backgroundColor || '#fff',
				listStyle: 'none',
				padding: '0',
				marginTop: '-1px',
				border: `1px solid ${borderColor || color || theme.colors?.primary}`,
				'& .ss-select__option': {
					cursor: 'pointer',
					padding: '6px 8px',
					'&.ss-selected': {
						fontWeight: 'bold',
					},
					'&:hover': {
						backgroundColor: theme.colors?.hover,
					},
				},
			},
			...style,
		}),
	style: ({ style }) =>
		css({
			...style,
		}),
};

export const Select = observer(
	(properties: SelectProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: SelectProps = {
			// default props
			disableStyles: false,
			disableClickOutside: false,
			hideLabelOnSelection: false,
			iconOpen: 'angle-down',
			iconClose: 'angle-up',
			native: false,
			separator: ': ',
			startOpen: false,
			stayOpenOnSelection: false,
			// global theme
			...globalTheme?.components?.select,
			// props
			...properties,
			...properties.theme?.components?.select,
		};

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
			stayOpenOnSelection,
			disableStyles,
			className,
			style,
		} = props;
		let { options } = props;

		const subProps: SelectSubProps = {
			button: {
				// default props
				className: 'ss-select__button',
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
				...props.theme?.components?.button,
			},
			dropdown: {
				// global theme
				...globalTheme?.components?.dropdown,
				// inherited props
				...defined({
					disableStyles,
					disabled,
				}),
				// component theme overrides
				...props.theme?.components?.dropdown,
			},
			icon: {
				// default props
				className: 'ss-select__button-icon',
				size: '10px',
				// global theme
				...globalTheme?.components?.icon,
				// inherited props
				...defined({
					disableStyles,
					color: iconColor || color,
				}),
				// component theme overrides
				...props.theme?.components?.icon,
			},
		};

		// only single selection support for now
		let selection = selected;
		let setSelection;

		// open state
		const [open, setOpen] = useState(startOpen);

		// selection state
		const stateful = selection === undefined;
		if (stateful) {
			[selection, setSelection] = useState(undefined);
		} else {
			selection = Array.isArray(selected) ? selected[0] : selection;
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

		const makeSelection = (e: Event, option?: Option) => {
			option = option.value ? option : undefined;

			if (option != selection) {
				onSelect && onSelect(e, option);
			}

			if (stateful) {
				setSelection(option);
			}

			!stayOpenOnSelection && setOpen(false);
		};
		return (
			options &&
			Array.isArray(options) &&
			options.length && (
				<div
					css={
						!disableStyles && native
							? CSS.style({ style })
							: CSS.select({
									color,
									backgroundColor,
									borderColor,
									label,
									selection: selection || '',
									hideLabelOnSelection,
									theme,
									style,
							  })
					}
					className={classnames('ss-select', { 'ss-disabled': disabled }, className)}
				>
					{native ? (
						<>
							{label && <span className={'ss-select__label'}>{label}</span>}
							{label && separator && <span className={'ss-select__separator'}>{separator}</span>}

							<select
								className={'ss-select__options'}
								disabled={disabled || undefined}
								onChange={(e) => {
									const selectElement = e.target;
									const selectedOptionElement = selectElement.options[selectElement.selectedIndex];
									const selectedOption = options
										.filter((option, index) => {
											return option.label == selectedOptionElement.text && (option.value == selectedOptionElement.value || option.value == index);
										})
										.pop();

									!disabled && makeSelection(e as any, selectedOption);
								}}
							>
								{!selection && clearSelection && (
									<option className={'ss-select__option'} selected value="">
										{clearSelection}
									</option>
								)}
								{options.map((option, index) => (
									<option className={'ss-select__option'} selected={selection?.value === option.value} value={option.value ?? index}>
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
							onToggle={(e, state) => {
								setOpen((prev) => state ?? !prev);
							}}
							onClick={(e) => {
								setOpen((prev) => !prev);
							}}
							button={
								<Button {...subProps.button}>
									<span className={'ss-select__button-text'}>
										{!(selection && hideLabelOnSelection) && (
											<>
												{label && <span className={'ss-select__button-label'}>{label}</span>}
												{label && selection && <span className={'ss-select__button-separator'}>{separator}</span>}
											</>
										)}
										{selection && <span className={'ss-select__button-selected'}>{selection?.label}</span>}
									</span>
									<Icon {...subProps.icon} icon={open ? iconClose : iconOpen} />
								</Button>
							}
						>
							<ul className={'ss-select__options'}>
								{options.map((option) => (
									<li
										className={classnames('ss-select__option', { 'ss-selected': selection?.value === option.value })}
										onClick={(e) => {
											!disabled && makeSelection(e as any, option);
										}}
									>
										<span>{option.label}</span>
									</li>
								))}
							</ul>
						</Dropdown>
					)}
				</div>
			)
		);
	}
);

interface SelectSubProps {
	button?: ButtonProps;
	dropdown?: DropdownProps;
	icon?: IconProps;
}

export type Option = {
	label: string;
	value: string | number;
	[otherOptions: string]: any;
};
export interface SelectProps extends ComponentProps {
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
	onSelect?: (e: Event, option: Option) => void;
	options: Option[];
	selected?: Option;
	separator?: string | JSX.Element;
	startOpen?: boolean;
	stayOpenOnSelection?: boolean;
}
