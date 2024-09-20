import { css } from '@emotion/react';
import type { SearchHeaderProps } from '../../../../components/Atoms/SearchHeader';

// CSS in JS style script for the SearchHeader component
const searchHeaderStyleScript = ({ theme }: SearchHeaderProps) => {
	const variables = theme?.variables;

	return css({
		textAlign: 'center',
		' .ss__search-header__title': {
			color: variables?.colors?.primary,
		},
	});
};

// SearchHeader component props
export const searchHeader: Partial<SearchHeaderProps> = {
	styleScript: searchHeaderStyleScript,
};
