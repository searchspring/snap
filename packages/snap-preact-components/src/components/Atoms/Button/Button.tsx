/** @jsx jsx */
/** @jsx h */

import { h, Fragment, ComponentChildren } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps, StylingCSS } from '../../../types';
import { Theme, useTheme, CacheProvider } from '../../../providers';
import { useA11y } from '../../../hooks/useA11y';
import { mergeProps } from '../../../utilities';

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
	native: ({}) => css({}),
};

export const Button = observer((properties: ButtonProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };
	const defaultProps = {
		disableA11y: false,
	};

	const props = mergeProps('button', globalTheme, defaultProps, properties);

	const { content, children, disabled, native, onClick, disableA11y, disableStyles, className, style, styleScript } = props;

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, theme };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		if (native) {
			styling.css = [CSS.native(stylingProps), style];
		} else {
			styling.css = [CSS.button(stylingProps), style];
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

	return content || children ? (
		<CacheProvider>
			{native ? (
				<button {...elementProps}>
					{content}
					{children}
				</button>
			) : (
				<div {...(!disableA11y ? a11yProps : {})} {...elementProps} role={'button'} aria-disabled={disabled}>
					{content}
					{children}
				</div>
			)}
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
});

export interface ButtonProps extends ComponentProps {
	backgroundColor?: string;
	borderColor?: string;
	color?: string;
	content?: string | JSX.Element;
	children?: ComponentChildren;
	disabled?: boolean;
	native?: boolean;
	onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	disableA11y?: boolean;
}
