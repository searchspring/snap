import { h } from 'preact';

import { jsx, css, keyframes, Keyframes } from '@emotion/react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Theme, useTheme, CacheProvider } from '../../../providers';
import { ComponentProps, RootNodeProperties } from '../../../types';
import { mergeProps } from '../../../utilities';

const CSS = {
	skeleton: ({ width, height, round, backgroundColor, animatedColor, animation }: Partial<SkeletonProps> & { animation: Keyframes }) =>
		css({
			width: width,
			height: height,
			borderRadius: round ? width : '0.25rem',

			backgroundColor: backgroundColor,
			display: 'inline-flex',
			lineHeight: '1',

			position: 'relative',
			overflow: 'hidden',
			zIndex: '1' /* Necessary for overflow: hidden to work correctly in Safari */,

			'&:after': {
				content: '""',
				display: 'block',
				position: 'absolute',
				left: '0',
				right: '0',
				height: '100%',
				backgroundRepeat: 'no-repeat',
				backgroundImage: `linear-gradient(90deg, ${backgroundColor}, ${animatedColor}, ${backgroundColor})`,
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
	const defaultProps: Partial<SkeletonProps> = {
		backgroundColor: '#ebebeb',
		animatedColor: '#f5f5f5',
	};

	const props = mergeProps('skeleton', globalTheme, defaultProps, properties);

	const { disableStyles, className, style, styleScript } = props;

	const styling: RootNodeProperties = { 'ss-name': props.name };
	const stylingProps = props;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.skeleton({ animation: CSS.animation, ...stylingProps }), style];
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
	backgroundColor?: string;
	animatedColor?: string;
}
