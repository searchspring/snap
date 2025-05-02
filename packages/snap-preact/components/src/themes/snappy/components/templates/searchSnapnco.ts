// import { css } from '@emotion/react';
import type { SearchSnapncoProps } from '../../../../components/Templates/SearchSnapnco';
import { searchSnapncoThemeComponentProps } from '../../../../components/Templates/SearchSnapnco';

// CSS in JS style script for the Search component
// const searchSnapncoStyleScript = ({ theme }: SearchSnapncoProps) => {
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	const variables = theme?.variables;

// 	return css({});
// };

// Search component props come from Template export
export const searchSnapnco: ThemeComponentProps<SearchSnapncoProps> = searchSnapncoThemeComponentProps;
