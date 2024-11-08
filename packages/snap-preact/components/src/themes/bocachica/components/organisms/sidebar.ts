import { css } from '@emotion/react';
import type { SidebarProps } from '../../../../components/Organisms/Sidebar';

// CSS in JS style script for the Sidebar component
const sidebarStyleScript = ({ theme }: SidebarProps) => {
	const variables = theme?.variables;

	return css({
		boxSizing: 'border-box',
		width: '300px',

		'& .ss__sidebar__title': {
			color: variables?.colors?.primary,
		},
	});
};

// Sidebar component props
export const sidebar: Partial<SidebarProps> = {
	themeStyleScript: sidebarStyleScript,
};
