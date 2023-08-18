import { css, SearchInputProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the SearchInput component
const searchInputStyleScript = ({ theme }: SearchInputProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: `1px solid ${variables?.color?.primary || '#ccc'}`,

		'& .ss__icon': {
			padding: '5px',
		},

		'& .ss__search-input__input': {
			width: '100%',
			outline: 'none',
			border: '0',
			boxSizing: 'border-box',
		},
	});
};

// SearchInput component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-searchinput--default
export const searchInput: SearchInputProps = {
	styleScript: searchInputStyleScript,
};
