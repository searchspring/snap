/** @jsx jsx */
import { h, Fragment } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ComponentProps } from '../../../types';
import { Theme, useTheme } from '../../../providers/theme';

const CSS = {
	button: ({ color, backgroundColor, borderColor, style }) =>
		css({
			display: 'inline-flex',
			padding: '5px 10px',
			position: 'relative',
			color: color,
			outline: 0,
			backgroundColor: `${backgroundColor}`,
			border: `1px solid ${borderColor || color || '#333'}`,
			'&:hover': {
				cursor: 'pointer',
			},
			'&.ss-button__disabled': {
				opacity: 0.3,
				'&:hover': {
					cursor: 'default',
				},
			},
			...style,
		}),
	style: ({ style }) =>
		css({
			...style,
		}),
};

export const Button = observer(
	(properties: ButtonProps): JSX.Element => {
		const globalTheme: Theme = useTheme();

		const props: ButtonProps = {
			// default props
			native: false,
			disableStyles: false,
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
					? CSS.style({ style })
					: CSS.button({
							color,
							backgroundColor,
							borderColor,
							style,
					  })),
			className: classnames('ss-button', { 'ss-button__disabled': disabled }, className),
			disabled,
			onClick: (e) => {
				!disabled && onClick && onClick(e);
			},
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
	disabled?: boolean;
	native?: boolean;
	onClick?: (e: Event) => void;
}
