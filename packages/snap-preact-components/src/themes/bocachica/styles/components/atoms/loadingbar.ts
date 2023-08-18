import { css, LoadingBarProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the LoadingBar component
// TODO: animation typing
const loadingBarStyleScript = ({ color, height, backgroundColor, animation, theme }: LoadingBarProps & { animation: any }) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
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
	});
};

// LoadingBar component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/atoms-loadingbar--active
export const loadingBar: Omit<LoadingBarProps, 'active'> = {
	styleScript: loadingBarStyleScript,
};
