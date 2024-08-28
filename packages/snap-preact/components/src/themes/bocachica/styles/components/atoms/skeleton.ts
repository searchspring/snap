import { css, keyframes } from '@emotion/react';
import type { SkeletonProps } from '../../../../../components/Atoms/Skeleton';

// CSS in JS style script for the Skeleton component
const skeletonStyleScript = ({ width, height, round, backgroundColor, animatedColor, theme }: SkeletonProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;
	const animation = keyframes({
		from: {
			transform: 'translateX(-100%)',
		},
		to: {
			transform: 'translateX(100%)',
		},
	});

	return css({
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
	});
};

// Skeleton component props
export const skeleton: Partial<SkeletonProps> = {
	styleScript: skeletonStyleScript,
};
