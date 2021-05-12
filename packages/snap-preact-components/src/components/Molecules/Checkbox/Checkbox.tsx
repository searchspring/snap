/** @jsx jsx */
import { h } from 'preact';
import { useState } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps } from '../../../types';
import { defined } from '../../../utilities';
import { Theme, useTheme } from '../../../providers/theme';
import { Icon, IconProps } from '../../Atoms/Icon';

const CSS = {
	checkbox: ({ size, color, theme, style }) =>
		css({
			display: 'inline-flex',
			minHeight: size,
			minWidth: size,
			position: 'relative',
			border: `1px solid ${color || theme.colors?.primary}`,
			'&.ss-checkbox__disabled': {
				opacity: 0.3,
			},
			'& .ss-checkbox__icon': {
				position: 'absolute',
				inset: '15%',
			},
			...style,
		}),
	style: ({ style }) =>
		css({
			...style,
		}),
};

export const Checkbox = observer(
	(properties: CheckboxProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: CheckboxProps = {
			// default props
			disabled: false,
			disableStyles: false,
			size: '12px',
			startChecked: false,
			native: false,
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
				className: 'ss-checkbox__icon',
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

		return native ? (
			<input
				className={classnames('ss-checkbox', { 'ss-checkbox__disabled': disabled }, className)}
				type="checkbox"
				onClick={(e) => clickFunc(e)}
				disabled={disabled}
				checked={checkedState}
				css={!disableStyles && CSS.style({ style })}
			/>
		) : (
			<span
				css={!disableStyles && CSS.checkbox({ size, color, theme, style })}
				className={classnames('ss-checkbox', { 'ss-checkbox__disabled': disabled }, className)}
				onClick={(e) => clickFunc(e)}
			>
				{checkedState && <Icon {...subProps.icon} />}
			</span>
		);
	}
);

interface CheckboxSubProps {
	icon?: IconProps;
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
