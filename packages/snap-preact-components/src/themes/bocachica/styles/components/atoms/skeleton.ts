import { css, SkeletonProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Skeleton component
// TODO: animation typing
const skeletonStyleScript = ({ width, height, round, backgroundColor, animatedColor, animation, theme }: SkeletonProps & { animation: any }) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

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
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-skeleton--circle
export const skeleton: Omit<SkeletonProps, 'width' | 'height'> = {
	styleScript: skeletonStyleScript,
};
