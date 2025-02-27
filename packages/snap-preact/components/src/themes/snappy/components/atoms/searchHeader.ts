import { css } from '@emotion/react';
import type { SearchHeaderProps } from '../../../../components/Atoms/SearchHeader';

// CSS in JS style script for the SearchHeader component
const searchHeaderStyleScript = ({ theme }: SearchHeaderProps) => {
	const variables = theme?.variables;

	return css({
		paddingBottom: '10px',
		'.ss__search-header__title': {
			color: variables?.colors?.primary,
			marginBottom: '5px',
			fontWeight: 'initial',
			fontSize: '25px',
		},
		'.ss__search-header__title--corrected': {
			color: variables?.colors?.secondary,
		},
	});
};

// SearchHeader component props
export const searchHeader: ThemeComponentProps<SearchHeaderProps> = {
	default: {
		themeStyleScript: searchHeaderStyleScript,
		titleText: (data) => `Search Results` + (data.search?.query?.string ? ` for ${data.search?.query?.string}` : ``),
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
