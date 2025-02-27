import { css } from '@emotion/react';
import type { FilterSummaryProps } from '../../../../components/Organisms/FilterSummary';

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
export const filterSummary: ThemeComponentProps<FilterSummaryProps> = {
	default: {
		themeStyleScript: filterSummaryStyleScript,
		hideFacetLabel: true,
		hideClearAll: true,
		hideTitle: true,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
