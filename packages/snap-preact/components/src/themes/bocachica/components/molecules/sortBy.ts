import { css } from '@emotion/react';
import type { SortByProps } from '../../../../components/Molecules/SortBy';

// CSS in JS style script for the SortBy component
const sortByStyleScript = () => {
	return css({
		'.ss__button__content': {
			gap: '7px',
		},
	});
};

// SortBy component props
export const sortBy: Partial<SortByProps> = {
	themeStyleScript: sortByStyleScript,
	theme: {
		components: {
			icon: {
				size: '12px',
			},
		},
	},
};
