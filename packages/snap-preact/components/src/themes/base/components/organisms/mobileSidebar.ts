// import { css } from '@emotion/react';
import type { MobileSidebarProps } from '../../../../components/Organisms/MobileSidebar';

// CSS in JS style script for the MobileSidebar component
// const mobileSidebarStyleScript = ({ }: MobileSidebarProps) => {
// 	return css({
// 	});
// };

// MobileSidebar component props
export const mobileSidebar: ThemeComponentProps<MobileSidebarProps> = {
	default: {
		// themeStyleScript: mobileSidebarStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
