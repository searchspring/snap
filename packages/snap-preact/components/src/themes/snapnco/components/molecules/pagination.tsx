// import { css } from '@emotion/react';
import type { PaginationProps } from '../../../../components/Molecules/Pagination';
import { ThemeComponent } from '../../../../providers';

// // CSS in JS style script for the Pagination component
// const paginationStyleScript = ({ theme }: PaginationProps) => {
// 	const variables = theme?.variables;

// 	return css({});
// };

// Pagination component props
export const pagination: ThemeComponent<'pagination', PaginationProps> = {
	default: {
		props: {
			// themeStyleScript: paginationStyleScript,
		},
	},
};
