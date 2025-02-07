import { css } from '@emotion/react';
import type { SearchInputProps } from '../../../../components/Molecules/SearchInput';

// CSS in JS style script for the SearchInput component
const searchInputStyleScript = ({ theme }: SearchInputProps) => {
	const variables = theme?.variables;

	return css({
		border: `1px solid ${variables?.colors?.secondary || '#ccc'}`,
	});
};

// SearchInput component props
export const searchInput: Partial<SearchInputProps> = {
	themeStyleScript: searchInputStyleScript,
};
