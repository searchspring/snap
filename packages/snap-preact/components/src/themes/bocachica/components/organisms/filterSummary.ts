import { css } from '@emotion/react';
import type { FilterSummaryProps } from '../../../../components/Organisms/FilterSummary';

// CSS in JS style script for the FilterSummary component
const filterSummaryStyleScript = ({ theme }: FilterSummaryProps) => {
	const variables = theme?.variables;
	return css({
		margin: '0 0 20px',
		'.ss__filter-summary__title': {
			fontWeight: 'bold',
			color: variables?.colors?.primary,
			fontSize: 'inherit',
		},
	});
};

// FilterSummary component props
export const filterSummary: ThemeComponent<'filterSummary', FilterSummaryProps> = {
	default: {
		props: {
			themeStyleScript: filterSummaryStyleScript,
			title: 'Applied Filters',
		},
	},
};
