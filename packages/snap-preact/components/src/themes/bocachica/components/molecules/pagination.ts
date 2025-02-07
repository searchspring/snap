import { css } from '@emotion/react';
import type { PaginationProps } from '../../../../components/Molecules/Pagination';

// CSS in JS style script for the Pagination component
const paginationStyleScript = ({ theme }: PaginationProps) => {
	const variables = theme?.variables;

	return css({
		'& .ss__pagination__page': {
			color: variables?.colors?.secondary,
			'&.ss__pagination__page--active': {
				textDecoration: 'underline',
			},
		},
	});
};

// Pagination component props
export const pagination: Partial<PaginationProps> = {
	themeStyleScript: paginationStyleScript,
};
