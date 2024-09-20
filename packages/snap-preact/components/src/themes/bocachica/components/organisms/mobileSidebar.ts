import { css } from '@emotion/react';
import type { MobileSidebarProps } from '../../../../components/Organisms/MobileSidebar';

// CSS in JS style script for the MobileSidebar component
const mobileSidebarStyleScript = ({ theme }: MobileSidebarProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__mobile-sidebar__title': {
			justifyContent: 'space-between',
			flexDirection: 'row',
			display: 'flex',

			'& .ss__icon': {
				cursor: 'pointer',
			},
		},

		'& .ss__mobile-sidebar__slideout__button': {
			cursor: 'pointer',
		},

		'& .ss__mobile-sidebar__cta-wrapper': {
			justifyContent: 'space-around',
			flexDirection: 'row',
			display: 'flex',
		},
	});
};

// MobileSidebar component props
export const mobileSidebar: Partial<MobileSidebarProps> = {
	styleScript: mobileSidebarStyleScript,
};
