import { css } from '@emotion/react';
import type { SidebarProps } from '../../../../../components/Organisms/Sidebar';

// CSS in JS style script for the Sidebar component
const sidebarStyleScript = ({ theme }: SidebarProps) => {
	const variables = theme?.variables;

	return css({
		boxSizing: 'border-box',
		width: '320px',
		paddingInlineEnd: '60px',

		'& .ss__sidebar__title': {
			color: variables?.color?.primary,
		},
	});
};

// Sidebar component props
export const sidebar: Partial<SidebarProps> = {
	styleScript: sidebarStyleScript,
};
