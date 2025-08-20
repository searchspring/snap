import { css } from '@emotion/react';
import type { SearchHorizontalProps } from '../../../../components/Templates/SearchHorizontal';
import { searchHorizontalThemeComponentProps } from '../../../themeComponents/searchHorizontal';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the Search component
const searchHorizontalStyleScript = ({ theme }: SearchHorizontalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__search-horizontal__header-section': {
			marginBottom: '0px',
		},
	});
};

// Search component props come from Template export
export const searchHorizontal: ThemeComponent<'searchHorizontal', SearchHorizontalProps> = {
	default: {
		...searchHorizontalThemeComponentProps.default,
		searchHorizontal: {
			...(searchHorizontalThemeComponentProps.default?.['searchHorizontal'] || {}),
			themeStyleScript: searchHorizontalStyleScript,
		},
		'searchHorizontal results': {
			columns: 5,
		},
	},
	mobile: {
		...searchHorizontalThemeComponentProps.mobile,
		'searchHorizontal results': {
			columns: 2,
		},
	},
	tablet: {
		...searchHorizontalThemeComponentProps.tablet,
		'searchHorizontal results': {
			columns: 3,
		},
	},
	desktop: {
		...searchHorizontalThemeComponentProps.desktop,
		'searchHorizontal results': {
			columns: 4,
		},
	},
};
