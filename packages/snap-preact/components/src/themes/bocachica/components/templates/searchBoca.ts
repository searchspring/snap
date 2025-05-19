import { css } from '@emotion/react';
import type { SearchBocaProps } from '../../../../components/Templates/SearchBoca';
import { searchBocaThemeComponentProps } from '../../../themeComponents/searchBoca';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Search component
const searchBocaStyleScript = ({ theme }: SearchBocaProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;
	const sidebarWidth = 'calc(270px + 1.5em)';

	return css({
		'.ss__toolbar .ss__button--sidebar-toggle-button-wrapper': {
			marginRight: sidebarWidth ? 'inherit' : 'auto',
			width: sidebarWidth ? sidebarWidth : 'inherit',
		},
	});
};

// Search component props come from Template export
export const searchBoca: ThemeComponent<'searchBoca', SearchBocaProps> = {
	default: {
		...searchBocaThemeComponentProps.default,
		searchBoca: {
			...(searchBocaThemeComponentProps.default?.['searchBoca'] || {}),
			themeStyleScript: searchBocaStyleScript,
		},
	},
	mobile: searchBocaThemeComponentProps.mobile,
	desktop: searchBocaThemeComponentProps.desktop,
	tablet: searchBocaThemeComponentProps.tablet,
};
