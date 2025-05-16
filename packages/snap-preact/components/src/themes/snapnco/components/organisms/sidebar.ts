import { css } from '@emotion/react';
import type { SidebarProps } from '../../../../components/Organisms/Sidebar';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the Sidebar component
const sidebarStyleScript = ({ theme }: SidebarProps) => {
	const variables = theme?.variables;

	return css({
		boxSizing: 'border-box',
		width: '100%',
		margin: '0 40px 0 0',
		border: '1px solid #d6d6d6',
		borderRadius: '1.5em',
		padding: '15px',

		'& .ss__sidebar__title': {
			color: variables?.colors?.primary,
			borderBottom: '1px solid #d6d6d6',
			margin: '0px',
			fontSize: '20px',
			paddingBottom: '20px',
			marginBottom: '20px',
		},

		'.ss__layout': {
			margin: '0px',
			padding: '0px',
			border: '0px',
		},
	});
};

// Sidebar component props
export const sidebar: ThemeComponent<'sidebar', SidebarProps> = {
	default: {
		sidebar: {
			themeStyleScript: sidebarStyleScript,
		},
	},
};
