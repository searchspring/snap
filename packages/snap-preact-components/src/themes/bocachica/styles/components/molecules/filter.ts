import { css, FilterProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Filter component
const filterStyleScript = ({ theme }: FilterProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({
		textDecoration: 'none',
		display: 'inline-flex',
		'& .ss__filter__button': {
			alignItems: 'center',
			'& .ss__filter__button__icon': {
				marginRight: '5px',
			},
		},
		'& .ss__filter__label': {
			marginRight: '5px',
			fontWeight: 'bold',
		},
	});
};

// Filter component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-filter--default
export const filter: FilterProps = {
	styleScript: filterStyleScript,
};
