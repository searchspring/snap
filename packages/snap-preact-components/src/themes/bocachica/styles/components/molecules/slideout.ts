import { css, SlideoutProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Slideout component
const slideoutStyleScript = ({ isActive, width, transitionSpeed, slideDirection, theme }: SlideoutProps & { isActive: boolean }) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'block',
		position: 'fixed',
		transition: `${slideDirection ? slideDirection : 'left'} ${transitionSpeed}`,
		left: slideDirection == 'left' ? (isActive ? '0' : `-${width}`) : slideDirection != 'right' ? '0' : 'initial',
		right: slideDirection == 'right' ? (isActive ? '0' : `-${width}`) : 'initial',
		bottom: slideDirection == 'bottom' ? (isActive ? '0' : `-100vh`) : 'initial',
		top: slideDirection == 'top' ? (isActive ? '0' : `-100vh`) : slideDirection == 'bottom' ? 'initial' : '0',
		height: '100%',
		zIndex: '10004',
		width: width?.endsWith('%') && parseInt(width.split('%')[0]) > 90 ? width : '90%',
		maxWidth: width,
		padding: '10px',
		background: '#fff',
		boxSizing: 'border-box',
		overflowY: 'auto',
	});
};

// Slideout component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-slideout--default
export const slideout: SlideoutProps = {
	styleScript: slideoutStyleScript,
};
