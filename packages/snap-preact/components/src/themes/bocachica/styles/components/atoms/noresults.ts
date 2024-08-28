import { css } from '@emotion/react';
import type { NoResultsProps } from '../../../../../components/Atoms/NoResults';

// CSS in JS style script for the NoResults component
const noResultsStyleScript = ({ theme }: NoResultsProps) => {
	const variables = theme?.variables;

	return css({
		color: variables?.color?.secondary,
		' .ss__title': {
			color: variables?.color?.secondary,
		},
	});
};

// NoResults component props
export const noResults: Partial<NoResultsProps> = {
	styleScript: noResultsStyleScript,
};
