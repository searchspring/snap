import { css } from '@emotion/react';
import type { SearchProps } from '../../../../../components/Templates/Search';

// CSS in JS style script for the Search component
const searchStyleScript = ({ mobileSidebarDisplayAt, theme }: SearchProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		display: 'flex',
		minHeight: '600px',

		'.ss__search__sidebar': {
			flex: '0 1 auto',
			width: '250px',
			margin: '0 40px 0 0',
		},

		'.ss_desktop': {
			[`@media only screen and (max-width: ${mobileSidebarDisplayAt})`]: {
				display: 'none',
			},
		},

		'.ss__search__content': {
			flex: '1 1 0%',
			padding: '0px 10px',
			width: '100%',
			boxSizing: 'border-box',
		},

		[`@media only screen and (max-width: ${mobileSidebarDisplayAt})`]: {
			flexDirection: 'column',
		},

		'.ss__search__content__toolbar--top-toolbar': {
			display: 'flex',
			justifyContent: 'flex-end',
			margin: '10px 0px',
		},

		'.ss__layout__select': {
			float: 'left',
		},
	});
};

// Search component props
export const search: Partial<SearchProps> = {
	styleScript: searchStyleScript,
};
