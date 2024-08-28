import { css } from '@emotion/react';
import type { HorizontalSearchProps } from '../../../../../components/Templates/HorizontalSearch';

// CSS in JS style script for the HorizontalSearch component
const horizontalSearchStyleScript = ({ theme }: HorizontalSearchProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// HorizontalSearch component props
export const horizontalSearch: Partial<HorizontalSearchProps> = {
	styleScript: horizontalSearchStyleScript,
};
