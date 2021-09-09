/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';

const CSS = {
	overlay: ({ color, transitionSpeed }) =>
		//@ts-ignore
		css({
			transition: `background ${transitionSpeed} ease 0s, left 0s ease ${transitionSpeed}`,
			position: 'fixed',
			zIndex: '10003',
			height: '100%',
			width: '100%',
			top: '0',
			left: '-100%',
			'&.ss__overlay--active': {
				transition: `background ${transitionSpeed} ease, left 0s ease`,
				background: color,
				left: '0',
			},
		}),
};

export function Overlay(properties: OverlayProps): JSX.Element {
	const globalTheme: Theme = useTheme();

	const props: OverlayProps = {
		// default props
		color: 'rgba(0,0,0,0.8)',
		transitionSpeed: '0.25s',
		// global theme
		...globalTheme?.components?.overlay,
		// props
		...properties,
		...properties.theme?.components?.overlay,
	};

	const { active, color, transitionSpeed, onClick, disableStyles, className, style } = props;

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.overlay({ color, transitionSpeed }), style];
	} else if (style) {
		styling.css = [style];
	}
	return (
		<CacheProvider>
			<div
				onClick={(e: React.MouseEvent<HTMLDivElement, Event>) => onClick && active && onClick(e)}
				className={classnames('ss__overlay', { 'ss__overlay--active': active }, className)}
				{...styling}
			/>
		</CacheProvider>
	);
}

export interface OverlayProps extends ComponentProps {
	active: boolean;
	color?: string;
	transitionSpeed?: string;
	onClick?: (e: React.MouseEvent<HTMLDivElement, Event>) => void;
}
