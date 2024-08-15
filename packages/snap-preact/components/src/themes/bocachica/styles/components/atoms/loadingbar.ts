import { css, keyframes } from '@emotion/react';
import type { LoadingBarProps } from '../../../../../components/Atoms/Loading';

// CSS in JS style script for the LoadingBar component
const loadingBarStyleScript = ({ color, height, backgroundColor, theme }: LoadingBarProps) => {
	const variables = theme?.variables;
	const animation = keyframes({
		from: { left: '-200px', width: '30%' },
		'50%': { width: '30%' },
		'70%': { width: '70%' },
		'80%': { left: '50%' },
		'95%': { left: '120%' },
		to: { left: '100%' },
	});
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
