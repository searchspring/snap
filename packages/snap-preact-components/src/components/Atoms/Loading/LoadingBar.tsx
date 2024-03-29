/** @jsx jsx */
import { Fragment, h } from 'preact';

import { jsx, css, keyframes, Keyframes } from '@emotion/react';
import classnames from 'classnames';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';

const CSS = {
	loadingBar: ({ color, height, backgroundColor, theme, animation }: Partial<LoadingBarProps> & { animation: Keyframes }) =>
		css({
			height: height,
			position: 'fixed',
			top: '0',
			left: '0',
			right: '0',
			margin: 'auto',
			transition: 'opacity 0.3s ease',
			opacity: '1',
			visibility: 'visible',
			zIndex: '10000',
			background: backgroundColor || theme?.colors?.secondary || '#f8f8f8',

			'& .ss__loading-bar__bar': {
				position: 'absolute',
				top: '0',
				left: '-200px',
				height: '100%',
				background: `${color || theme?.colors?.primary || '#ccc'}`,
				animation: `${animation} 2s linear infinite`,
			},
		}),
	animation: keyframes({
		from: { left: '-200px', width: '30%' },
		'50%': { width: '30%' },
		'70%': { width: '70%' },
		'80%': { left: '50%' },
		'95%': { left: '120%' },
		to: { left: '100%' },
	}),
};

export function LoadingBar(properties: LoadingBarProps): JSX.Element {
	const globalTheme: Theme = useTheme();
	const theme = { ...globalTheme, ...properties.theme };

	const props: LoadingBarProps = {
		// default props
		height: '5px',
		// global theme
		...globalTheme?.components?.loadingbar,
		// props
		...properties,
		...properties.theme?.components?.loadingbar,
	};

	const { active, color, backgroundColor, height, disableStyles, className, style } = props;

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.loadingBar({ height, color, backgroundColor, theme, animation: CSS.animation }), style];
	} else if (style) {
		styling.css = [style];
	}
	return active ? (
		<CacheProvider>
			<div {...styling} className={classnames('ss__loading-bar', className)}>
				<div className="ss__loading-bar__bar"></div>
			</div>
		</CacheProvider>
	) : (
		<Fragment></Fragment>
	);
}

export interface LoadingBarProps extends ComponentProps {
	active: boolean;
	color?: string;
	backgroundColor?: string;
	height?: string;
}
