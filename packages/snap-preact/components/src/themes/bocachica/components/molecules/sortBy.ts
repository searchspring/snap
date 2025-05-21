import { css } from '@emotion/react';
import type { SortByProps } from '../../../../components/Molecules/SortBy';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the SortBy component
const sortByStyleScript = () => {
	return css({
		'.ss__button__content': {
			gap: '7px',
		},
	});
};

// SortBy component props
export const sortBy: ThemeComponent<'sortBy', SortByProps> = {
	default: {
		sortBy: {
			themeStyleScript: sortByStyleScript,
		},
		'sortBy icon': {
			size: '12px',
		},
	},
};
