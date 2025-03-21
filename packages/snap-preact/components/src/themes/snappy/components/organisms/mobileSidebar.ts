import { css } from '@emotion/react';
import type { MobileSidebarProps } from '../../../../components/Organisms/MobileSidebar';

// CSS in JS style script for the MobileSidebar component
const mobileSidebarStyleScript = ({ theme }: MobileSidebarProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'.ss__mobile-sidebar__footer': {
			gap: '6px',
			padding: '10px',
			borderTop: '1px solid black',
			'.ss__button': {
				width: '100%',
				'.ss__button__content': {
					textAlign: 'center',
				},
			},
		},
		'.ss__mobile-sidebar__slideout.ss__slideout--active': {
			width: '80%',
			maxWidth: '320px',
		},
		'.ss__mobile-sidebar__header__close-button': {
			lineHeight: 1,
			padding: '5px',
		},

		[`@media (max-width: ${variables?.breakpoints[2]}px)`]: {
			'.ss__mobile-sidebar__body': {
				//83px is the height of the footer & footer
				height: 'calc(100vh - 140px)',
				overflow: 'scroll',
			},
			'.ss__per-page, .ss__sortby': {
				margin: '10px 10px 10px 0px',

				'.ss__dropdown': {
					'.ss__select__select .ss__select__select__option': {
						padding: '5px',
					},
					'.ss__select__dropdown__button': {
						padding: '0px',
					},
				},
			},
		},
	});
};

// MobileSidebar component props
export const mobileSidebar: ThemeComponentProps<MobileSidebarProps> = {
	default: {
		themeStyleScript: mobileSidebarStyleScript,
		hideSortBy: true,
		hideOpenButtonText: true,
		hideFilterSummary: true,
		openButtonIcon: 'filters',
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
