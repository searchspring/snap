import { css } from '@emotion/react';
import type { SortByProps } from '../../../../components/Molecules/SortBy';

// CSS in JS style script for the SortBy component
const sortByStyleScript = () => {
	return css({
		'& .ss__dropdown .ss__select__dropdown__button': {
			fontWeight: 'normal',
			color: '#666666',
			'.ss__select__selection': {
				color: 'black',
			},
		},
	});
};

// SortBy component props
export const sortBy: ThemeComponent<'sortBy', SortByProps> = {
	default: {
		props: {
			themeStyleScript: sortByStyleScript,
		},
		components: {
			'*sortBy icon': {
				size: '12px',
				icon: 'angle-down',
			},
		},
	},
	mobile: {
		components: {
			'*sortBy select': {
				hideSelection: true,
			},
		},
	},
};
