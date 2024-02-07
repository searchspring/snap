import { css, OverlayProps } from '../../../../../index';

// CSS in JS style script for the Overlay component
const overlayStyleScript = ({ color, transitionSpeed, theme }: OverlayProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

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

// Overlay component props
export const overlay: Partial<OverlayProps> = {
	styleScript: overlayStyleScript,
};
