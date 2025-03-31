import { h, Fragment, ComponentChildren } from 'preact';

import { css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, StyleScript } from '../../../types';
import { Theme, useTheme, CacheProvider, useTreePath } from '../../../providers';
import { useA11y } from '../../../hooks/useA11y';
import { cloneWithProps, defined, mergeProps, mergeStyles } from '../../../utilities';
import { Icon, IconProps, IconType } from '../Icon';
import { Lang, useLang } from '../../../hooks';
import deepmerge from 'deepmerge';
import Color from 'color';

const defaultStyles: StyleScript<ButtonProps> = ({ native, color, backgroundColor, borderColor, theme }) => {
	const lightenedPrimaryColorObj = new Color(backgroundColor || color || theme?.variables?.colors?.primary).lightness(95);

	// no styling on native
	if (native) {
		return css({});
	}

	return css({
		display: 'inline-flex',
		alignItems: 'center',
		gap: '5px',
		padding: '5px 10px',
		position: 'relative',
		color: color || theme?.variables?.colors?.primary,
		outline: 0,
		backgroundColor: backgroundColor || '#fff',
		border: `1px solid ${borderColor || color || theme?.variables?.colors?.primary || '#333'}`,
		'&:not(.ss__button--disabled):hover': {
			cursor: 'pointer',
			backgroundColor: lightenedPrimaryColorObj.hex() || '#f8f8f8',
		},
		'&.ss__button--disabled': {
			opacity: 0.3,
			backgroundColor: 'initial',
			'&:hover': {
				cursor: 'default',
			},
		},
		'.ss__button__content': {
			width: '100%',
		},
		label: {
			cursor: 'pointer',
		},
	});
};

export const Button = observer((properties: ButtonProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const globalTreePath = useTreePath();

	const defaultProps = {
		disableA11y: false,
		treePath: globalTreePath,
	};

	const props = mergeProps('button', globalTheme, defaultProps, properties);

	const {
		content,
		children,
		disabled,
		native,
		onClick,
		disableA11y,
		disableStyles,
		className,
		icon,
		lang,
		treePath,
		style: _,
		styleScript: __,
		themeStyleScript: ___,
		...additionalProps
	} = props;

	const subProps: ButtonSubProps = {
		icon: {
			className: 'ss__button__icon',
			// default props
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling = mergeStyles<ButtonProps>(props, defaultStyles);

	const elementProps = {
		...styling,
		className: classnames('ss__button', { 'ss__button--native': native, 'ss__button--disabled': disabled }, className),
		disabled,
		onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => !disabled && onClick && onClick(e),
		...additionalProps,
	};

	const a11yProps = {
		ref: (e: any) => useA11y(e),
	};

	//initialize lang
	const defaultLang = {};

	//deep merge with props.lang
	const langs = deepmerge(defaultLang, lang || {});
	const mergedLang = useLang(langs as any, {});

	return content || children || icon || lang?.button?.value ? (
		<CacheProvider>
			{native ? (
				<button {...elementProps}>
					<span className="ss__button__content" {...mergedLang.button?.all}>
						{cloneWithProps(content, { treePath })}
						{cloneWithProps(children, { treePath })}
					</span>
					{icon && <Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon } : (icon as Partial<IconProps>))} />}
				</button>
			) : (
				<div {...(!disableA11y ? a11yProps : {})} {...elementProps} role={'button'} aria-disabled={disabled}>
					{content || children || mergedLang.button.value ? (
						<span className="ss__button__content" {...mergedLang.button?.all}>
							{cloneWithProps(content, { treePath })}
							{cloneWithProps(children, { treePath })}
						</span>
					) : undefined}
					{icon && <Icon {...subProps.icon} {...(typeof icon == 'string' ? { icon: icon } : (icon as Partial<IconProps>))} />}
				</div>
			)}
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

interface ButtonSubProps {
	icon: Partial<IconProps>;
}

export interface ButtonProps extends ComponentProps<ButtonProps> {
	backgroundColor?: string;
	borderColor?: string;
	color?: string;
	icon?: IconType | Partial<IconProps>;
	content?: string | JSX.Element;
	children?: ComponentChildren;
	disabled?: boolean;
	native?: boolean;
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	disableA11y?: boolean;
	lang?: Partial<ButtonLang>;
}

export interface ButtonLang {
	button?: Lang<never>;
}

export type ButtonNames = 'close' | 'apply' | 'clear' | 'slideout' | 'sidebar-toggle' | 'sidebar-close' | 'close-filters' | 'apply-filters';
