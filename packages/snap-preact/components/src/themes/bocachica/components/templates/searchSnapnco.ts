import { css } from '@emotion/react';
import type { SearchSnapncoProps } from '../../../../components/Templates/SearchSnapnco';
import { searchSnapncoThemeComponentProps } from '../../../themeComponents/searchSnapnco';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Search component
const searchSnapncoStyleScript = ({ theme }: SearchSnapncoProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// Search component props come from Template export
export const searchSnapnco: ThemeComponent<'searchSnapnco', SearchSnapncoProps> = {
	default: {
		props: {
			...searchSnapncoThemeComponentProps.default?.props,
			themeStyleScript: searchSnapncoStyleScript,
		},
		components: searchSnapncoThemeComponentProps.default?.components,
	},
	mobile: searchSnapncoThemeComponentProps.mobile,
	desktop: searchSnapncoThemeComponentProps.desktop,
	tablet: searchSnapncoThemeComponentProps.tablet,
};
