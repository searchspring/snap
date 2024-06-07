import { css, FacetToggleProps } from '../../../../../index';

// CSS in JS style script for the FacetToggle component
const facetToggleStyleScript = ({ theme }: FacetToggleProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// FacetToggle component props
export const facetToggle: Partial<FacetToggleProps> = {
	styleScript: facetToggleStyleScript,
};
