import { css } from '@emotion/react';
import type { ToolbarProps } from '../../../../components/Organisms/Toolbar';

// CSS in JS style script for the Toolbar component
const toolbarStyleScript = () => {
	const sidebarWidth = 'calc(300px + 1.5em)';
	return css({
		'.ss__toolbar__slot--0': {
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
