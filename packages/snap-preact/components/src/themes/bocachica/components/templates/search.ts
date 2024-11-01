import { css } from '@emotion/react';
import type { SearchProps } from '../../../../components/Templates/Search';

// CSS in JS style script for the Search component
const searchStyleScript = ({ theme }: SearchProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		display: 'flex',
		minHeight: '600px',

		'.ss__sidebar': {
			flex: '0 1 auto',
			width: '300px',
		},

		'.ss__search__content': {
			flex: '1 1 0%',
			padding: '0px 10px',
			width: '100%',
			boxSizing: 'border-box',
		},
	});
};

// Search component props
export const search: Partial<SearchProps> = {
	themeStyleScript: searchStyleScript,
};
