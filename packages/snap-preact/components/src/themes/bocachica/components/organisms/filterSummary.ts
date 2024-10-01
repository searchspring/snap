import { css } from '@emotion/react';
import type { FilterSummaryProps } from '../../../../components/Organisms/FilterSummary';

// CSS in JS style script for the FilterSummary component
const filterSummaryStyleScript = ({ theme }: FilterSummaryProps) => {
	const variables = theme?.variables;
	return css({
		margin: '10px 0 30px 0',
		'& .ss__filter-summary__filter': {
			margin: '5px 10px 5px 0',
		},
		'& .ss__filter-summary__title': {
			fontWeight: 'bold',
			color: variables?.colors?.secondary,
		},
	});
};

// FilterSummary component props
export const filterSummary: Partial<FilterSummaryProps> = {
	styleScript: filterSummaryStyleScript,
	title: 'Applied Filters',
};
