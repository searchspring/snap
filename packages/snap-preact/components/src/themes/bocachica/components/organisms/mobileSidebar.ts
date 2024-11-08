import { css } from '@emotion/react';
import type { MobileSidebarProps } from '../../../../components/Organisms/MobileSidebar';

// CSS in JS style script for the MobileSidebar component
const mobileSidebarStyleScript = ({ theme }: MobileSidebarProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__mobile-sidebar__header': {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'baseline',

			'& .ss__mobile-sidebar__header__close-button': {
				cursor: 'pointer',
			},
		},
		'.ss__mobile-sidebar__title': {
			justifyContent: 'space-between',
			flexDirection: 'row',
			display: 'flex',

			'& .ss__icon': {
				cursor: 'pointer',
			},
		},

		'.ss__mobile-sidebar__slideout__button': {
			cursor: 'pointer',
		},

		'.ss__mobile-sidebar__footer': {
			display: 'flex',
			gap: '6px',
			justifyContent: 'center',
			flexDirection: 'row',
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
export const mobileSidebar: Partial<MobileSidebarProps> = {
	themeStyleScript: mobileSidebarStyleScript,
};
