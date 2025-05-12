import { css } from '@emotion/react';
import type { SearchProps } from '../../../../components/Templates/Search';
import { searchThemeComponentProps } from '../../../themeComponents/search';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Search component
const searchStyleScript = ({ theme }: SearchProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// Search component props come from Template export
export const search: ThemeComponent<'search', SearchProps> = {
	default: {
		props: {
			...searchThemeComponentProps.default?.props,
			themeStyleScript: searchStyleScript,
		},
		components: searchThemeComponentProps.default?.components,
	},
	mobile: searchThemeComponentProps.mobile,
	desktop: searchThemeComponentProps.desktop,
	tablet: searchThemeComponentProps.tablet,
};
