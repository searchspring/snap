/** @jsx jsx */
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
	radio: ({ size, color }: Partial<RadioProps>) =>
		css({
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: size,
			width: size,
			cursor: 'pointer',

			'&.ss__radio--disabled': {
				opacity: 0.5,
				cursor: 'none',
			},

			'& .ss__radio__empty': {
				display: 'inline-block',
				width: `calc(${size} - 30%)`,
				height: `calc(${size} - 30%)`,
			},

			'& .ss__radio__icon--active circle:first-of-type': {
				stroke: `${color || '#333'}`,
			},
			'& .ss__radio__icon--active circle:last-of-type': {
				fill: `${color || '#333'}`,
			},
			'& svg.ss__radio__icon--inactive circle': {
				stroke: `${color || '#333'}  !important`,
			},
		}),
	native: ({ size }: Partial<RadioProps>) =>
		css({
			height: size,
			width: size,
		}),
};

export const Radio = observer((properties: RadioProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RadioProps> = {
		size: '20px',
		startChecked: false,
		disableA11y: false,
	};

	const props = mergeProps('radio', globalTheme, defaultProps, properties);

	const {
		checked,
		color,
		disabled,
		checkedIcon,
		unCheckedIcon,
		onClick,
		size,
		startChecked,
		native,
		disableA11y,
		disableStyles,
		className,
		style,
		styleScript,
	} = props;

	const subProps: RadioSubProps = {
		activeIcon: {
			// default props
			className: 'ss__radio__icon--active',
			icon: checkedIcon || 'bullet',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				color: color,
				disableStyles,
				size: size && `calc(${size} - 30%)`,
			}),
			// component theme overrides
			theme: props.theme,
		},
		inactiveIcon: {
			// default props
			className: 'ss__radio__icon--inactive',
			icon: unCheckedIcon || 'bullet-o',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				color: color,
				disableStyles,
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
			styling.css = [CSS.radio(stylingProps), style];
		}
	} else if (style) {
		styling.css = [style];
	}

	return (
		<CacheProvider>
			{native ? (
				<input
					{...styling}
					className={classnames('ss__radio', { 'ss__radio--disabled': disabled }, className)}
					type="radio"
					onClick={(e) => clickFunc(e)}
					disabled={disabled}
					checked={checkedState}
				/>
			) : (
				<span
					{...styling}
					className={classnames('ss__radio', { 'ss__radio--disabled': disabled }, className)}
					onClick={(e) => clickFunc(e)}
					ref={(e) => (!disableA11y ? useA11y(e) : null)}
					aria-label={`${disabled ? 'disabled' : ''} ${checkedState ? 'checked' : 'unchecked'} checkbox`}
					role="radio"
				>
					{checkedState ? (
						<Icon {...subProps.activeIcon} name="ss__radio__icon--active" />
					) : (
						<Icon {...subProps.inactiveIcon} name="ss__radio__icon--inactive" />
					)}
				</span>
			)}
		</CacheProvider>
	);
});

interface RadioSubProps {
	activeIcon: Partial<IconProps>;
	inactiveIcon: Partial<IconProps>;
}
export interface RadioProps extends ComponentProps {
	checked?: boolean;
	color?: string;
	disabled?: boolean;
	checkedIcon?: string;
	unCheckedIcon?: string;
	onClick?: (e: React.MouseEvent<HTMLInputElement | HTMLSpanElement, MouseEvent>) => void;
	size?: string;
	startChecked?: boolean;
	native?: boolean;
	disableA11y?: boolean;
}
