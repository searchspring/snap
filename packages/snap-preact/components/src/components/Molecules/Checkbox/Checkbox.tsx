import { h } from 'preact';
import { useState, StateUpdater } from 'preact/hooks';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, StyleScript } from '../../../types';
import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { Icon, IconProps, IconType } from '../../Atoms/Icon';
import { useA11y } from '../../../hooks/useA11y';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';

const defaultStyles: StyleScript<CheckboxProps> = ({ size, color, theme, native }) => {
	const pixelSize = isNaN(Number(size)) ? size : `${size}px`;

	if (!native) {
		return css({
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			height: pixelSize,
			width: pixelSize,
			border: `1px solid ${color || theme?.variables?.colors?.primary || '#333'}`,
			'&.ss__checkbox--disabled': {
				opacity: 0.7,
			},
			'& .ss__checkbox__empty': {
				display: 'inline-block',
				width: `calc(${size} - 30%)`,
				height: `calc(${size} - 30%)`,
			},
		});
	} else {
		return css({});
	}
};

export const Checkbox = observer((properties: CheckboxProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps: Partial<CheckboxProps> = {
		size: '12px',
		startChecked: false,
		disableA11y: false,
		treePath: globalTreePath,
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
		theme,
		treePath,
		lang,
		style: _,
		styleScript: __,
		themeStyleScript: ___,
		name: ____,
		...additionalProps
	} = props;

	const pixelSize = isNaN(Number(size)) ? size : `${size}px`;

	const subProps: CheckboxSubProps = {
		icon: {
			// default props
			className: 'ss__checkbox__icon',
			icon: 'check-thin',
			// inherited props
			...defined({
				color: iconColor || color || theme?.variables?.colors?.primary,
				disableStyles,
				icon,
				size: pixelSize && `calc(${pixelSize} - 30%)`,
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

	const styling = mergeStyles<CheckboxProps>(props, defaultStyles);

	//initialize lang
	const defaultLang = {
		checkbox: {},
	};

	//deep merge with props.lang
	const _lang = deepmerge(defaultLang, lang || {});
	const mergedLang = useLang(_lang as any, {
		checkedState,
		disabled,
	});

	return (
		<CacheProvider>
			{native ? (
				<input
					{...styling}
					className={classnames(
						'ss__checkbox',
						'ss__checkbox--native',
						{ 'ss__checkbox--disabled': disabled, 'ss__checkbox--active': checkedState },
						className
					)}
					type="checkbox"
					aria-checked={checkedState}
					onClick={(e) => clickFunc(e)}
					disabled={disabled}
					checked={checkedState}
				/>
			) : (
				<span
					{...styling}
					className={classnames('ss__checkbox', { 'ss__checkbox--disabled': disabled, 'ss__checkbox--active': checkedState }, className)}
					onClick={(e) => clickFunc(e)}
					ref={(e) => (!disableA11y ? useA11y(e) : null)}
					aria-disabled={disabled}
					role="checkbox"
					aria-checked={checkedState}
					{...additionalProps}
					{...mergedLang.checkbox.all}
				>
					{checkedState ? (
						<Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon } : (icon as Partial<IconProps>))} />
					) : (
						<span className="ss__checkbox__empty" />
					)}
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
	icon?: IconType | Partial<IconProps>;
	iconColor?: string;
	onClick?: (e: React.MouseEvent<HTMLInputElement | HTMLSpanElement, MouseEvent>) => void;
	size?: string | number;
	startChecked?: boolean;
	native?: boolean;
	disableA11y?: boolean;
	lang?: Partial<CheckboxLang>;
}

export interface CheckboxLang {
	checkbox: Lang<{
		checkedState: boolean;
		disabled: boolean;
	}>;
}
