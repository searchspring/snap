/** @jsx jsx */
import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps } from '../../../types';
import { Theme, useTheme } from '../../../providers/theme';

const CSS = {
	button: ({ color, backgroundColor, borderColor, theme, style }) =>
		css({
			display: 'inline-flex',
			padding: '5px 10px',
			position: 'relative',
			color: color || theme.colors?.primary,
			outline: 0,
			backgroundColor: backgroundColor || '#fff',
			border: `1px solid ${borderColor || color || theme.colors?.primary}`,
			'&:hover': {
				cursor: 'pointer',
				backgroundColor: theme.colors?.hover,
			},
			'&.ss__button--disabled': {
				opacity: 0.7,
				borderColor: 'rgba(51,51,51,0.7)',
				backgroundColor: 'initial',
				'&:hover': {
					cursor: 'default',
				},
			},
			...style,
		}),
	native: ({ style }) =>
		css({
			...style,
		}),
};

export const Button = observer(
	(properties: ButtonProps): JSX.Element => {
		const globalTheme: Theme = useTheme();
		const theme = { ...globalTheme, ...properties.theme };

		const props: ButtonProps = {
			// default props
			// global theme
			...globalTheme?.components?.button,
			// props
			...properties,
			...properties.theme?.components?.button,
		};

		const { backgroundColor, borderColor, color, content, children, disabled, native, onClick, disableStyles, className, style } = props;

		const elementProps = {
			css:
				!disableStyles &&
				(native
					? CSS.native({ style })
					: CSS.button({
							color,
							backgroundColor,
							borderColor,
							theme,
							style,
					  })),
			className: classnames('ss__button', { 'ss__button--disabled': disabled }, className),
			disabled,
			onClick: (e) => !disabled && onClick && onClick(e),
		};

		return (
			(content || children) && (
				<>
					{native ? (
						<button {...elementProps}>
							{content}
							{children}
						</button>
					) : (
						<div {...elementProps}>
							{content}
							{children}
						</div>
					)}
				</>
			)
		);
	}
);

export interface ButtonProps extends ComponentProps {
	backgroundColor?: string;
	borderColor?: string;
	color?: string;
	content?: string | JSX.Element;
	children?: any;
	disabled?: boolean;
	native?: boolean;
	onClick?: (e: Event) => void;
}
