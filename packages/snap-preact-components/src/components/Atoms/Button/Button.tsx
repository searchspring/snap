/** @jsx jsx */
/** @jsx h */

import { h, Fragment, ComponentChildren } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useA11y } from '../../../hooks/useA11y';
import { defined, mergeProps } from '../../../utilities';
import { Icon, IconProps } from '../Icon';

const CSS = {
	button: ({ color, backgroundColor, borderColor, theme }: ButtonProps) =>
		css({
			display: 'inline-flex',
			padding: '5px 10px',
			position: 'relative',
			color: color || theme?.colors?.primary,
			outline: 0,
			backgroundColor: backgroundColor || '#fff',
			border: `1px solid ${borderColor || color || theme?.colors?.primary || '#333'}`,
			'&:hover': {
				cursor: 'pointer',
				backgroundColor: theme?.colors?.hover || '#f8f8f8',
			},
			'&.ss__button--disabled': {
				opacity: 0.7,
				borderColor: 'rgba(51,51,51,0.7)',
				backgroundColor: 'initial',
				'&:hover': {
					cursor: 'default',
				},
			},
		}),
	native: () => css({}),
};

export const Button = observer((properties: ButtonProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };
	const defaultProps = {
		disableA11y: false,
	};

	const props = mergeProps('button', globalTheme, defaultProps, properties);

	const {
		backgroundColor,
		borderColor,
		color,
		content,
		children,
		disabled,
		native,
		onClick,
		disableA11y,
		disableStyles,
		className,
		icon,
		style,
		styleScript,
	} = props;

	const subProps: ButtonSubProps = {
		icon: {
			// default props
			// global theme
			...globalTheme?.components?.icon,
			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
		},
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { backgroundColor, borderColor, color, disabled, native, theme };

	if (!disableStyles) {
		if (native) {
			styling.css = [CSS.native(), style];
		} else {
			styling.css = [CSS.button(stylingProps), style];
		}

		// add styleScript to styling
		if (styleScript) {
			styling.css = styling.css || [];
			styling.css.push(styleScript(stylingProps));
		}
	} else if (style) {
		styling.css = [style];
	}

	const elementProps = {
		...styling,
		className: classnames('ss__button', { 'ss__button--disabled': disabled }, className),
		disabled,
		onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => !disabled && onClick && onClick(e),
	};

	const a11yProps = {
		ref: (e: any) => useA11y(e),
	};

	return content || children || icon ? (
		<CacheProvider>
			{native ? (
				<button {...elementProps}>
					{content}
					{children}
					{icon && <Icon icon={icon} {...subProps.icon} />}
				</button>
			) : (
				<div {...(!disableA11y ? a11yProps : {})} {...elementProps} role={'button'} aria-disabled={disabled}>
					{content}
					{children}
					{icon && <Icon icon={icon} {...subProps.icon} />}
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

export interface ButtonProps extends ComponentProps {
	backgroundColor?: string;
	borderColor?: string;
	color?: string;
	icon?: string;
	content?: string | JSX.Element;
	children?: ComponentChildren;
	disabled?: boolean;
	native?: boolean;
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	disableA11y?: boolean;
}
