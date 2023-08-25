import { css, FilterSummaryProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the FilterSummary component
const filterSummaryStyleScript = ({ theme }: FilterSummaryProps) => {
	const variables = theme?.variables as BocachicaVariables;
	const { filterSummary } = variables;

	return css({
		'& .ss__filter-summary__filter': {
			margin: '5px 10px 5px 0',
		},
		'& .ss__filter-summary__title': {
			fontSize: '1.2em',
			color: filterSummary?.color?.text || variables?.color?.text,
		},
	});
};

// FilterSummary component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/organisms-filtersummary--regular
export const filterSummary: FilterSummaryProps = {
	styleScript: filterSummaryStyleScript,
};
