import { css } from '@emotion/react';
import type { ToolbarProps } from '../../../../components/Organisms/Toolbar';

// CSS in JS style script for the Toolbar component
const toolbarStyleScript = () => {
	const sidebarWidth = 'calc(300px + 1.5em)';
	return css({
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: '10px',

		'&.ss__search__content__toolbar--top-toolbar': {
			alignItems: 'flex-end',
			justifyContent: 'flex-end',
		},

		'&.ss__search__content__toolbar--bottom-toolbar, &.ss__search-horizontal__content__toolbar--bottom-toolbar': {
			justifyContent: 'center',
		},

		'.ss__toolbar__slot--top': {
			marginRight: sidebarWidth ? 'inherit' : 'auto',
			width: sidebarWidth ? sidebarWidth : 'inherit',
		},

		'&.ss__search__content__toolbar--middle-toolbar, &.ss__search__header-section__toolbar--top-toolbar': {
			display: 'flex',
			justifyContent: 'initial',
			justifyItems: 'initial',

			'.ss__toolbar__sort-by': {
				marginLeft: 'auto',
			},
			'.ss__select__dropdown__button': {
				padding: '6px 5px 6px 30px',
			},
		},
	});
};

// Toolbar component props
export const toolbar: Partial<ToolbarProps> = {
	themeStyleScript: toolbarStyleScript,
};
