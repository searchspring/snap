import { css } from '@emotion/react';
import type { PaginationInfoProps } from '../../../../components/Atoms/PaginationInfo';

// CSS in JS style script for the Pagination component
const paginationInfoStyleScript = ({ theme }: PaginationInfoProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// PaginationInfo component props
export const paginationInfo: Partial<PaginationInfoProps> = {
	styleScript: paginationInfoStyleScript,
};
