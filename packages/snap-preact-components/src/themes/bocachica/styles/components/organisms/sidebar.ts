import { css, SidebarProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Sidebar component
const sidebarStyleScript = ({ theme }: SidebarProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		'& .ss__sidebar__title': {
			color: variables?.color?.primary,
		},
	});
};

// Sidebar component props
export const sidebar: Partial<SidebarProps> = {
	styleScript: sidebarStyleScript,
};
