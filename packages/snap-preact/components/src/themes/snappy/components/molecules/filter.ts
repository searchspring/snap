import { css } from '@emotion/react';
import type { FilterProps } from '../../../../components/Molecules/Filter';

// CSS in JS style script for the Filter component
const filterStyleScript = ({ theme }: FilterProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__filter__button': {
			backgroundColor: 'white',
			color: '#959595',
			border: '2px solid #e6e6e6',

			'& .ss__filter__button__icon': {
				fill: '#5C5C5C',
				stroke: '#5C5C5C',
				margin: '0 10px 0 0',
			},

			'&:hover': {
				backgroundColor: 'white',
				color: '#959595',
				border: '2px solid #e6e6e6',
				opacity: 0.7,

				'& .ss__filter__button__icon': {
					fill: '#5C5C5C',
					stroke: '#5C5C5C',
				},
			},
		},
	});
};

// Filter component props
export const filter: ThemeComponentProps<FilterProps> = {
	default: {
		themeStyleScript: filterStyleScript,
		hideFacetLabel: true,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
