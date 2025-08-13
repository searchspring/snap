import { css } from '@emotion/react';
import type { SortByProps } from '../../../../components/Molecules/SortBy';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the SortBy component
const sortByStyleScript = ({ theme }: SortByProps) => {
	const variables = theme?.variables;

	return css({
		'.ss__button__content': {
			gap: '7px',
		},
		'.ss__dropdown.ss__dropdown--open': {
			'.ss__dropdown__button': {
				boxShadow: 'none',
			},
		},
		'.ss__dropdown': {
			'.ss__dropdown__content': {
				width: 'max-content',
			},
			'.ss__select__dropdown__button': {
				background: '#e6e6e6',
				borderRadius: '25px',
				fontWeight: 'initial',
				padding: '10px 5px 10px 15px',
				boxShadow: 'none',

				'&:hover': {
					background: '#e6e6e6',
				},

				'.ss__select__dropdown__button__icon': {
					background: 'white',
					padding: '5px',
					borderRadius: '50%',
					marginLeft: '15px',
				},
			},
		},

		[`@media (max-width: ${variables?.breakpoints.tablet}px)`]: {
			'.ss__button__content': {
				padding: '5px 10px',
			},
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
			icon: 'angle-down',
		},
	},
	tablet: {
		'sortBy select': {
			hideSelection: true,
		},
	},
	mobile: {
		'sortBy select': {
			hideSelection: true,
			separator: '',
		},
	},
};
