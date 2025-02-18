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
export const sortBy: ThemeComponentProps<SortByProps> = {
	default: {
		themeStyleScript: sortByStyleScript,
		theme: {
			components: {
				icon: {
					size: '12px',
				},
			},
		},
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
