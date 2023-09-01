import { css, SortByProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the SortBy component
const sortByStyleScript = ({ theme }: SortByProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({});
};

// SortBy component props
export const sortBy: Partial<SortByProps> = {
	styleScript: sortByStyleScript,
};
