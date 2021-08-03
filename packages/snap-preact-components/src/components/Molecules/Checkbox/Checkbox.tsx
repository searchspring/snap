/** @jsx jsx */
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps } from '../../../types';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider, cache } from '../../../providers';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	checkbox: ({ size, color, theme, style }) =>
		css({
			display: 'inline-flex',
			minHeight: size,
			minWidth: size,
			position: 'relative',
			border: `1px solid ${color || theme.colors?.primary || '#333'}`,
			'&.ss__checkbox--disabled': {
				opacity: 0.7,
			},
			'& .ss__checkbox__icon': {
				position: 'absolute',
				inset: '15%',
			},
			...style,
		}),
	native: ({ style }) =>
		css({
			...style,
		}),
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
				color: iconColor || color || theme.colors?.primary || '#333',
				disableStyles,
				icon,
				size: size && `calc(${size} - 30%)`,
			}),
			// component theme overrides
			...theme?.components?.icon,
		},
	};

	let checkedState, setCheckedState;

	const stateful = checked === undefined;
	if (stateful) {
		[checkedState, setCheckedState] = useState(startChecked);
	} else {
		checkedState = checked;
	}

	const clickFunc = (e) => {
		if (!disabled) {
			if (stateful) {
				setCheckedState((prev) => {
					return !prev;
				});
			}

			onClick && onClick(e);
		}
	};

	return (
		<CacheProvider value={cache}>
			{native ? (
				<input
					css={!disableStyles && CSS.native({ style })}
					className={classnames('ss__checkbox', { 'ss__checkbox--disabled': disabled }, className)}
					type="checkbox"
					onClick={(e) => clickFunc(e)}
					disabled={disabled}
					checked={checkedState}
				/>
			) : (
				<span
					css={!disableStyles && CSS.checkbox({ size, color, theme, style })}
					className={classnames('ss__checkbox', { 'ss__checkbox--disabled': disabled }, className)}
					onClick={(e) => clickFunc(e)}
				>
					{checkedState && <Icon {...subProps.icon} />}
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
	onClick?: (e: Event) => void;
	size?: string;
	startChecked?: boolean;
	native?: boolean;
}
