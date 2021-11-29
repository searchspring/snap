/** @jsx jsx */
import { h } from 'preact';

import { jsx, css, keyframes } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps } from '../../../types';
import { CSSProperties } from 'react';

const CSS = {
	skeleton: ({ width, height, round, bgcolor, secondaryColor, animation }) =>
		css({
			width: width,
			height: height,
			borderRadius: round ? width : '0.25rem',

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
				backgroundImage: `linear-gradient(90deg, ${bgcolor}, ${secondaryColor}, ${bgcolor})`,
				transform: 'translateX(-100%)',
				animation: `${animation} 1.5s linear infinite`,
				animationTimingFunction: 'ease-in-out',
			},
		}),
	animation: keyframes({
		from: {
			transform: 'translateX(-100%)',
		},
		to: {
			transform: 'translateX(100%)',
		},
	}),
};

export const Skeleton = observer((properties: SkeletonProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: SkeletonProps = {
		// default props
		bgcolor: '#ebebeb',
		secondaryColor: '#f5f5f5',
		// global theme
		...globalTheme?.components?.skeleton,
		// props
		...properties,
		...properties.theme?.components?.skeleton,
	};
	const { width, height, round, bgcolor, secondaryColor, disableStyles, className, style } = props;

	const styling: { css?: any } = {};
	if (!disableStyles) {
		styling.css = [CSS.skeleton({ width, height, round, bgcolor, secondaryColor, animation: CSS.animation }), style];
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
	width: string;
	height: string;
	round?: boolean;
	bgcolor?: string;
	secondaryColor?: string;
}
