// import { css } from '@emotion/react';
import type { PaginationInfoProps } from '../../../../components/Atoms/PaginationInfo';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Pagination component
// const paginationInfoStyleScript = ({ theme }: PaginationInfoProps) => {
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	const variables = theme?.variables;

// 	return css({});
// };

// PaginationInfo component props
export const paginationInfo: ThemeComponent<'paginationInfo', PaginationInfoProps> = {
	default: {
		props: {
			// themeStyleScript: paginationInfoStyleScript,
		},
	},
};
