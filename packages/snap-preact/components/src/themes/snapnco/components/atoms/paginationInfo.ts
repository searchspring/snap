import { css } from '@emotion/react';
import type { PaginationInfoProps } from '../../../../components/Atoms/PaginationInfo';

// CSS in JS style script for the Pagination component
const paginationInfoStyleScript = ({ theme }: PaginationInfoProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		color: '#666666',
	});
};

// PaginationInfo component props
export const paginationInfo: ThemeComponentProps<PaginationInfoProps> = {
	default: {
		themeStyleScript: paginationInfoStyleScript,
		infoText: (data) => `Showing ${data.pagination?.begin}-${data.pagination?.end} of ${data.pagination?.totalResults} Products`,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
