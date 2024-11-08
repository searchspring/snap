import { h } from 'preact';
import { useState, StateUpdater } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, StyleScript } from '../../../types';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { useA11y } from '../../../hooks/useA11y';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<RadioProps> = ({ size, native }) => {
	if (!native) {
		return css({
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: size,
			width: size,
			cursor: 'pointer',

			'&.ss__radio--disabled': {
				opacity: 0.3,
				cursor: 'default',
			},
		});
	} else {
		return css({});
	}
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
		startChecked,
		native,
		disableA11y,
		disableStyles,
		className,
		size,
		treePath,
	} = props;

	const subProps: RadioSubProps = {
		activeIcon: {
			name: 'active',
			// default props
			className: 'ss__radio__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				size,
				color,
				disableStyles,
			}),
			// component theme overrides
			theme: props.theme,
			treePath,
		},
		inactiveIcon: {
			name: 'inactive',
			// default props
			className: 'ss__radio__icon',
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				size,
				color,
				disableStyles,
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

	const styling = mergeStyles<RadioProps>(props, defaultStyles);

	//initialize lang
	const defaultLang = {
		radio: {},
	};

	//deep merge with props.lang
	const lang = deepmerge(defaultLang, props.lang || {});
	const mergedLang = useLang(lang as any, {
		disabled,
		checkedState,
	});

	return (
		<CacheProvider>
			{native ? (
				<div className={classnames('ss__radio', 'ss__radio--native', { 'ss__radio--disabled': disabled }, className)} {...styling}>
					<input
						className={classnames('ss__radio__input')}
						aria-checked={checkedState}
						type="radio"
						onClick={(e) => clickFunc(e)}
						disabled={disabled}
						checked={checkedState}
						tabIndex={!disableA11y ? 0 : -1}
					/>
				</div>
			) : (
				<span
					{...styling}
					className={classnames('ss__radio', { 'ss__radio--disabled': disabled, 'ss__radio--active': checkedState }, className)}
					onClick={(e) => clickFunc(e)}
					ref={(e) => (!disableA11y ? useA11y(e) : null)}
					{...mergedLang.radio?.all}
					role="radio"
					aria-checked={checkedState}
					aria-disabled={disabled}
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
	lang?: Partial<RadioLang>;
}

export interface RadioLang {
	radio: Lang<{
		disabled: boolean;
		checkedState: boolean;
	}>;
}
