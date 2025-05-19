import { css } from '@emotion/react';
import type { SearchHeaderProps } from '../../../../components/Atoms/SearchHeader';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the SearchHeader component
const searchHeaderStyleScript = ({ theme }: SearchHeaderProps) => {
	const variables = theme?.variables;

	return css({
		'.ss__search-header__title': {
			color: variables?.colors?.primary,
			marginBottom: 0,
			fontWeight: 'initial',
			fontSize: '25px',
		},
		'.ss__search-header__title--corrected': {
			color: variables?.colors?.secondary,
		},
	});
};

// SearchHeader component props
export const searchHeader: ThemeComponent<'searchHeader', SearchHeaderProps> = {
	default: {
		searchHeader: {
			themeStyleScript: searchHeaderStyleScript,
			titleText: (data) => `Search Results` + (data.search?.query?.string ? ` for ${data.search?.query?.string}` : ``),
		},
	},
};
