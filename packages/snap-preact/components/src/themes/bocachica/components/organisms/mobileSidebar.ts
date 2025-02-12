import { css } from '@emotion/react';
import type { MobileSidebarProps } from '../../../../components/Organisms/MobileSidebar';

// CSS in JS style script for the MobileSidebar component
const mobileSidebarStyleScript = ({ theme }: MobileSidebarProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__mobile-sidebar__footer': {
			gap: '6px',
			'.ss__button': {
				width: '100%',
				'.ss__button__content': {
					textAlign: 'center',
				},
			},
		},
	});
};

// MobileSidebar component props
export const mobileSidebar: ThemeComponentProps<MobileSidebarProps> = {
	default: {
		themeStyleScript: mobileSidebarStyleScript,
	},
	mobile: {
		hideSortBy: false,
	},
	tablet: {},
	desktop: {},
};
