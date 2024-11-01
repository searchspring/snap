import { css } from '@emotion/react';
import type { SearchHeaderProps } from '../../../../components/Atoms/SearchHeader';

// CSS in JS style script for the SearchHeader component
const searchHeaderStyleScript = ({ theme }: SearchHeaderProps) => {
	const variables = theme?.variables;

	return css({
		paddingBottom: '10px',
		textAlign: 'center',
		'.ss__search-header__title': {
			color: variables?.colors?.primary,
			marginBottom: '5px',
		},
		'.ss__search-header__title--corrected': {
			color: variables?.colors?.secondary,
		},
	});
};

// SearchHeader component props
export const searchHeader: Partial<SearchHeaderProps> = {
	themeStyleScript: searchHeaderStyleScript,
};
