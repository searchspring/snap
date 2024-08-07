import { h } from 'preact';
import { useState, StateUpdater } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, RootNodeProperties } from '../../../types';
import { defined, mergeProps } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { useA11y } from '../../../hooks/useA11y';

const CSS = {
	radio: ({ size }: Partial<RadioProps>) =>
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
		}),
	native: ({ size }: Partial<RadioProps>) =>
		css({
			width: size,
			height: size,
			display: 'flex',
			justifyContent: 'center',

			'.ss__radio__input': {
				height: `calc(${size} - 30%)`,
				width: `calc(${size} - 30%)`,
				margin: 'auto',
			},
		}),
};

export const Radio = observer((properties: RadioProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RadioProps> = {
		size: '20px',
		startChecked: false,
		disableA11y: false,
		checkedIcon: 'bullet',
		unCheckedIcon: 'bullet-o',
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
		treePath,
	} = props;

	const subProps: RadioSubProps = {
		activeIcon: {
			name: 'active',
			// default props
			className: 'ss__radio__icon--active',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				color: color,
				disableStyles,
				size: size,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		inactiveIcon: {
			name: 'inactive',
			// default props
			className: 'ss__radio__icon--inactive',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				color: color,
				disableStyles,
				size: size,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
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

	const styling: RootNodeProperties = { 'ss-name': props.name };
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
				<div className={classnames('ss__radio', { 'ss__radio--disabled': disabled }, className)} {...styling}>
					<input
						className={classnames('ss__radio__input')}
						aria-checked={checkedState}
						type="radio"
						onClick={(e) => clickFunc(e)}
						disabled={disabled}
						checked={checkedState}
					/>
				</div>
			) : (
				<span
					{...styling}
					className={classnames('ss__radio', { 'ss__radio--disabled': disabled }, className)}
					onClick={(e) => clickFunc(e)}
					ref={(e) => (!disableA11y ? useA11y(e) : null)}
					aria-label={`${disabled ? 'disabled' : ''} ${checkedState ? 'checked' : 'unchecked'} radio button`}
					role="radio"
					aria-checked={checkedState}
				>
					{checkedState ? (
						<Icon {...subProps.activeIcon} {...(typeof checkedIcon == 'string' ? { icon: checkedIcon } : (checkedIcon as Partial<IconProps>))} />
					) : (
						<Icon
							{...subProps.inactiveIcon}
							{...(typeof unCheckedIcon == 'string' ? { icon: unCheckedIcon } : (unCheckedIcon as Partial<IconProps>))}
						/>
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
	checkedIcon?: IconType | Partial<IconProps>;
	unCheckedIcon?: IconType | Partial<IconProps>;
	onClick?: (e: React.MouseEvent<HTMLInputElement | HTMLSpanElement, MouseEvent>) => void;
	size?: string;
	startChecked?: boolean;
	native?: boolean;
	disableA11y?: boolean;
}
