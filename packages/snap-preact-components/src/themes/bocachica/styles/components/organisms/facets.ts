import { css, FacetsProps } from '../../../../../index';

// CSS in JS style script for the Facets component
const facetsStyleScript = ({ theme }: FacetsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// Facets component props
export const facets: Partial<FacetsProps> = {
	styleScript: facetsStyleScript,
};
