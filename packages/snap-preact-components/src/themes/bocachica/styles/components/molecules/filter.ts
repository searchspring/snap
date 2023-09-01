import { css, FilterProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Filter component
const filterStyleScript = ({ theme }: FilterProps) => {
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
export const filter: Partial<FilterProps> = {
	styleScript: filterStyleScript,
};
