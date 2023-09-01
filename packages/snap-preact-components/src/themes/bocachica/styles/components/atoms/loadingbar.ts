import { type Keyframes } from '@emotion/react';
import { css, LoadingBarProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the LoadingBar component
const loadingBarStyleScript = ({ color, height, backgroundColor, animation, theme }: LoadingBarProps & { animation: Keyframes }) => {
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
		background: backgroundColor || '#f8f8f8',

		'& .ss__loading-bar__bar': {
			position: 'absolute',
			top: '0',
			left: '-200px',
			height: '100%',
			background: `${color || variables?.color?.accent || '#ccc'}`,
			animation: `${animation} 2s linear infinite`,
		},
	});
};

// LoadingBar component props
export const loadingBar: Partial<LoadingBarProps> = {
	styleScript: loadingBarStyleScript,
};
