import { css } from '@emotion/react';
import type { ToolbarProps } from '../../../../components/Organisms/Toolbar';

// CSS in JS style script for the Toolbar component
const toolbarStyleScript = () => {
	return css({
		justifyContent: 'space-between',
		alignItems: 'center',

		'&.ss__search__content__toolbar--top-toolbar': {
			alignItems: 'flex-end',
			justifyContent: 'flex-end',
		},

		'&.ss__search__content__toolbar--bottom-toolbar, &.ss__search-horizontal__content__toolbar--bottom-toolbar': {
			justifyContent: 'center',
		},
	});
};

// Toolbar component props
export const toolbar: Partial<ToolbarProps> = {
	themeStyleScript: toolbarStyleScript,
};
