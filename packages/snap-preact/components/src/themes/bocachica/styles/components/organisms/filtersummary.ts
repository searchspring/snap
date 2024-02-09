import { css, FilterSummaryProps } from '../../../../../index';

// CSS in JS style script for the FilterSummary component
const filterSummaryStyleScript = ({ theme }: FilterSummaryProps) => {
	const variables = theme?.variables;

	return css({
		margin: '10px 0 30px 0',
		'& .ss__filter-summary__filter': {
			margin: '5px 10px 5px 0',
			'& .ss__filter__button': {
				backgroundColor: variables?.color?.active?.background || '#ccc',
				color: variables?.color?.active?.foreground,
				border: 'none',

				'& .ss__filter__button__icon': {
					fill: variables?.color?.active?.accent,
				},
			},
		},
		'& .ss__filter-summary__title': {
			fontSize: '1.2em',
			fontWeight: 'bold',
			color: variables?.color?.secondary,
		},
	});
};

// FilterSummary component props
export const filterSummary: Partial<FilterSummaryProps> = {
	styleScript: filterSummaryStyleScript,
	title: 'Applied Filters',
};
