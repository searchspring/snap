import { css } from '@emotion/react';
import type { SearchHorizontalProps } from '../../../../components/Templates/SearchHorizontal';
import { searchHorizontalThemeComponentProps } from '../../../../components/Templates/SearchHorizontal';

// CSS in JS style script for the Search component
const searchHorizontalStyleScript = ({ theme }: SearchHorizontalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// Search component props come from Template export
export const searchHorizontal: ThemeComponentProps<SearchHorizontalProps> = {
	...searchHorizontalThemeComponentProps,
	default: {
		...searchHorizontalThemeComponentProps.default,
		themeStyleScript: searchHorizontalStyleScript,
	},
};
