import { css } from '@emotion/react';
import type { ToolbarProps } from '../../../../components/Organisms/Toolbar';

// CSS in JS style script for the Toolbar component
const toolbarStyleScript = () => {
	const sidebarWidth = 'calc(270px + 1.5em)';
	return css({
		'.ss__button--sidebar-toggle-button-wrapper': {
			marginRight: sidebarWidth ? 'inherit' : 'auto',
			width: sidebarWidth ? sidebarWidth : 'inherit',
		},
	});
};

// Toolbar component props
export const toolbar: ThemeComponentProps<ToolbarProps> = {
	default: {
		themeStyleScript: toolbarStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
