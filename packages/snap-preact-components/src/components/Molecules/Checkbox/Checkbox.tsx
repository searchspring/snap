/** @jsx jsx */
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, StylingCSS } from '../../../types';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Icon, IconProps } from '../../Atoms/Icon';

type ICheckboxStyles = {
	size?: string;
	color?: string;
	theme: Theme;
};

const CSS = {
	checkbox: ({ size, color, theme }: ICheckboxStyles) =>
		css({
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: size,
			width: size,
			border: `1px solid ${color || theme.colors?.primary || '#333'}`,
			'&.ss__checkbox--disabled': {
				opacity: 0.7,
			},
			'& .ss__checkbox__empty': {
				display: 'inline-block',
				width: `calc(${size} - 30%)`,
				height: `calc(${size} - 30%)`,
			},
		}),
	native: () => css({}),
};

export const Checkbox = observer((properties: CheckboxProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: CheckboxProps = {
		// default props
		size: '12px',
		startChecked: false,
		// global theme
		...globalTheme?.components?.checkbox,
		// props
		...properties,
		...properties.theme?.components?.checkbox,
	};

	const { checked, color, disabled, icon, iconColor, onClick, size, startChecked, native, disableStyles, className, style } = props;

	const subProps: CheckboxSubProps = {
		icon: {
			// default props
			className: 'ss__checkbox__icon',
			icon: 'check-thin',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				color: iconColor || color || theme.colors?.primary,
				disableStyles,
				icon,
				size: size && `calc(${size} - 30%)`,
			}),
			// component theme overrides
			theme: props.theme,
		},
	};

	let checkedState: boolean | undefined, setCheckedState: any;

	const stateful = checked === undefined;
	if (stateful) {
		[checkedState, setCheckedState] = useState<boolean | undefined>(startChecked);
	} else {
		checkedState = checked;
	}

	const clickFunc = (e: React.MouseEvent<HTMLInputElement | HTMLSpanElement, MouseEvent>) => {
		if (!disabled) {
			if (stateful) {
				setCheckedState((prev: boolean) => {
					return !prev;
				});
			}

			onClick && onClick(e);
		}
	};

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		if (native) {
			styling.css = [CSS.native(), style];
		} else {
			styling.css = [CSS.checkbox({ size, color, theme }), style];
		}
	} else if (style) {
		styling.css = [style];
	}
	return (
		<CacheProvider>
			{native ? (
				<input
					{...styling}
					className={classnames('ss__checkbox', { 'ss__checkbox--disabled': disabled }, className)}
					type="checkbox"
					onClick={(e) => clickFunc(e)}
					disabled={disabled}
					checked={checkedState}
				/>
			) : (
				<span {...styling} className={classnames('ss__checkbox', { 'ss__checkbox--disabled': disabled }, className)} onClick={(e) => clickFunc(e)}>
					{checkedState ? <Icon {...subProps.icon} /> : <span className="ss__checkbox__empty" />}
				</span>
			)}
		</CacheProvider>
	);
});

interface CheckboxSubProps {
	icon: IconProps;
}
export interface CheckboxProps extends ComponentProps {
	checked?: boolean;
	color?: string;
	disabled?: boolean;
	icon?: string;
	iconColor?: string;
	onClick?: (e: React.MouseEvent<HTMLInputElement | HTMLSpanElement, MouseEvent>) => void;
	size?: string;
	startChecked?: boolean;
	native?: boolean;
}
