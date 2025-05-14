import { css } from '@emotion/react';
import type { SearchHorizontalProps } from '../../../../components/Templates/SearchHorizontal';
import { searchHorizontalThemeComponentProps } from '../../../themeComponents/searchHorizontal';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the Search component
const searchHorizontalStyleScript = ({ theme }: SearchHorizontalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// Search component props come from Template export
export const searchHorizontal: ThemeComponent<'searchHorizontal', SearchHorizontalProps> = {
	default: {
		props: {
			...searchHorizontalThemeComponentProps.default?.props,
			themeStyleScript: searchHorizontalStyleScript,
		},
		components: searchHorizontalThemeComponentProps.default?.components,
	},
	mobile: searchHorizontalThemeComponentProps.mobile,
	desktop: searchHorizontalThemeComponentProps.desktop,
	tablet: searchHorizontalThemeComponentProps.tablet,
};
