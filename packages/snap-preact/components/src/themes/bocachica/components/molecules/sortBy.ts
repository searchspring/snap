import { css } from '@emotion/react';
import type { SortByProps } from '../../../../components/Molecules/SortBy';

// CSS in JS style script for the SortBy component
const sortByStyleScript = ({ theme }: SortByProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// SortBy component props
export const sortBy: Partial<SortByProps> = {
	styleScript: sortByStyleScript,
};
