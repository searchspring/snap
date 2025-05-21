import { css } from '@emotion/react';
import type { FilterSummaryProps } from '../../../../components/Organisms/FilterSummary';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the FilterSummary component
const filterSummaryStyleScript = ({ theme }: FilterSummaryProps) => {
	const variables = theme?.variables;
	return css({
		flexWrap: 'wrap',
		'& .ss__filter-summary__title': {
			fontWeight: 'bold',
			color: variables?.colors?.secondary,
		},
	});
};

// FilterSummary component props
export const filterSummary: ThemeComponent<'filterSummary', FilterSummaryProps> = {
	default: {
		filterSummary: {
			themeStyleScript: filterSummaryStyleScript,
			hideFacetLabel: true,
			hideClearAll: true,
			hideTitle: true,
		},
	},
};
