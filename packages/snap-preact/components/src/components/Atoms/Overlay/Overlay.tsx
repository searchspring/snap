import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { mergeProps, mergeStyles } from '../../../utilities';
import { useA11y } from '../../../hooks';

const defaultStyles: StyleScript<OverlayProps> = ({ transitionSpeed, color }) => {
	return css({
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
	});
};

export function Overlay(properties: OverlayProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<OverlayProps> = {
		color: 'rgba(0,0,0,0.8)',
		transitionSpeed: '0.25s',
	};

	const props = mergeProps('overlay', globalTheme, defaultProps, properties);

	const { active, onClick, disableA11y, className } = props;

	const styling = mergeStyles<OverlayProps>(props, defaultStyles);

	return (
		<CacheProvider>
			<div
				onClick={(e: React.MouseEvent<HTMLDivElement, Event>) => onClick && active && onClick(e)}
				ref={(e) => (!disableA11y ? useA11y(e) : null)}
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
	disableA11y?: boolean;
}
