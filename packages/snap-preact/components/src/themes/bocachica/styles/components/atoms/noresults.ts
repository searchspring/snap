import { css, NoResultsProps } from '../../../../../index';

// CSS in JS style script for the NoResults component
const noResultsStyleScript = ({ theme }: NoResultsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// NoResults component props
export const noResults: Partial<NoResultsProps> = {
	styleScript: noResultsStyleScript,
};
