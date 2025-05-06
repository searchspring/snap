import { css } from '@emotion/react';
import { ThemeTemplate } from '../../../../providers';
import { ToolbarProps } from '../../../../components/Organisms/Toolbar';

// CSS in JS style script for the Toolbar component
const toolbarStyleScript = () => {
	return css({});
};

// Toolbar component props
export const toolbar: ThemeTemplate<'toolbar', ToolbarProps> = {
	default: {
		props: {
			themeStyleScript: toolbarStyleScript,
		},
	},
};
