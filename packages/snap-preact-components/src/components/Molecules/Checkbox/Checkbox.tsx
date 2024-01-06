import { h } from 'preact';
import { useState, StateUpdater } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, StylingCSS } from '../../../types';
import { defined } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Icon, IconProps } from '../../Atoms/Icon';
import { useA11y } from '../../../hooks/useA11y';
import { mergeProps } from '../../../utilities';

const CSS = {
	checkbox: ({ size, color, theme }: Partial<CheckboxProps>) =>
		css({
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: size,
			width: size,
			border: `1px solid ${color || theme?.variables?.color?.primary || '#333'}`,
			'&.ss__checkbox--disabled': {
				opacity: 0.7,
			},
			'& .ss__checkbox__empty': {
				display: 'inline-block',
				width: `calc(${size} - 30%)`,
				height: `calc(${size} - 30%)`,
			},
		}),
	native: ({}) => css({}),
};

export const Checkbox = observer((properties: CheckboxProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<CheckboxProps> = {
		size: '12px',
		startChecked: false,
		disableA11y: false,
	};

	const props = mergeProps('checkbox', globalTheme, defaultProps, properties);

	const {
		checked,
		color,
		disabled,
		icon,
		iconColor,
		onClick,
		size,
		startChecked,
		native,
		disableA11y,
		disableStyles,
		className,
		style,
		styleScript,
		theme,
	} = props;

	const subProps: CheckboxSubProps = {
		icon: {
			// default props
			className: 'ss__checkbox__icon',
			icon: 'check-thin',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				color: iconColor || color || theme?.variables?.color?.primary,
				disableStyles,
				icon,
				size: size && `calc(${size} - 30%)`,
			}),
			// component theme overrides
			theme: props.theme,
		},
	};

	let checkedState: boolean | undefined, setCheckedState: undefined | StateUpdater<boolean | undefined>;

	const stateful = checked === undefined;
	if (stateful) {
		[checkedState, setCheckedState] = useState<boolean | undefined>(startChecked);
	} else {
		checkedState = checked;
	}

	const clickFunc = (e: React.MouseEvent<HTMLInputElement | HTMLSpanElement, MouseEvent>) => {
		if (!disabled) {
			if (stateful) {
				setCheckedState &&
					setCheckedState((prev?: boolean) => {
						return !prev;
					});
			}

			onClick && onClick(e);
		}
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		if (native) {
			styling.css = [CSS.native(stylingProps), style];
		} else {
			styling.css = [CSS.checkbox(stylingProps), style];
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
					aria-checked={checkedState}
					onClick={(e) => clickFunc(e)}
					disabled={disabled}
					checked={checkedState}
				/>
			) : (
				<span
					{...styling}
					className={classnames('ss__checkbox', { 'ss__checkbox--disabled': disabled }, className)}
					onClick={(e) => clickFunc(e)}
					ref={(e) => (!disableA11y ? useA11y(e) : null)}
					aria-label={`${disabled ? 'disabled' : ''} ${checkedState ? 'checked' : 'unchecked'} checkbox`}
					role="checkbox"
					aria-checked={checkedState}
				>
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
	disableA11y?: boolean;
}
