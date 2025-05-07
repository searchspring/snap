import { css } from '@emotion/react';
import type { SlideoutProps } from '../../../../components/Molecules/Slideout';

// CSS in JS style script for the Slideout component
const slideoutStyleScript = ({ isActive, width, slideDirection, theme }: SlideoutProps & { isActive: boolean }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		left: slideDirection == 'left' ? (isActive ? '0' : `-${width}`) : slideDirection != 'right' ? '0' : 'initial',
		right: slideDirection == 'right' ? (isActive ? '0' : `-${width}`) : 'initial',
		bottom: slideDirection == 'bottom' ? (isActive ? '0' : `-100vh`) : 'initial',
		top: slideDirection == 'top' ? (isActive ? '0' : `-100vh`) : slideDirection == 'bottom' ? 'initial' : '0',
		background: '#fff',
	});
};

// Slideout component props
export const slideout: ThemeComponent<'slideout', SlideoutProps> = {
	default: {
		props: {
			themeStyleScript: slideoutStyleScript,
		},
	},
};
