import { css, SearchInputProps } from '../../../../../index';

// CSS in JS style script for the SearchInput component
const searchInputStyleScript = ({ theme }: SearchInputProps) => {
	const variables = theme?.variables;

	return css({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: `1px solid ${variables?.color?.secondary || '#ccc'}`,

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
export const searchInput: Partial<SearchInputProps> = {
	styleScript: searchInputStyleScript,
};
