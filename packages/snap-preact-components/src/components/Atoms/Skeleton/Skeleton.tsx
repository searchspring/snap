/** @jsx jsx */
import { h } from 'preact';

import { jsx, css } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';
import { CSSProperties } from 'react';

const CSS = {
	skeleton: ({ width, height, round, bgcolor }) =>
		css({
			'@keyframes react-loading-skeleton': {
				from: {
					transform: 'translateX(-100%)',
				},
				to: {
					transform: 'translateX(100%)',
				},
			},

			width: `${width}px`,
			height: `${height}px`,
			borderRadius: round ? `${width}px` : '0.25rem',

			backgroundColor: bgcolor,
			display: 'inline-flex',
			lineHeight: '1',

			position: 'relative',
			overflow: 'hidden',
			zIndex: '1' as CSSProperties['zIndex'] /* Necessary for overflow: hidden to work correctly in Safari */,

			'&:after': {
				content: '""',
				display: 'block',
				position: 'absolute',
				left: '0',
				right: '0',
				height: '100%',
				backgroundRepeat: 'no-repeat',
				backgroundImage: `linear-gradient(90deg, ${bgcolor}, #f5f5f5, ${bgcolor})`,
				transform: 'translateX(-100%)',
				animationName: 'react-loading-skeleton',
				animationDirection: 'normal',
				animationDuration: '1.5s',
				animationTimingFunction: 'ease-in-out',
				animationIterationCount: 'infinite',
			},
		}),
};

export const Skeleton = observer((properties: SkeletonProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: SkeletonProps = {
		// default props
		bgcolor: '#ebebeb',
		// global theme
		...globalTheme?.components?.skeleton,
		// props
		...properties,
		...properties.theme?.components?.skeleton,
	};
	const { width, height, round, bgcolor, disableStyles, className, style } = props;

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.skeleton({ width, height, round, bgcolor }), style];
	} else if (style) {
		styling.css = [style];
	}
	return (
		<CacheProvider>
			<div {...styling} className={classnames('ss__skeleton', className)}></div>
		</CacheProvider>
	);
});

export interface SkeletonProps extends ComponentProps {
	width: number;
	height: number;
	round?: boolean;
	bgcolor?: string;
}
