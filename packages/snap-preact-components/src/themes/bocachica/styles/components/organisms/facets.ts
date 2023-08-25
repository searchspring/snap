import { css, FacetsProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the Facets component
const facetsStyleScript = ({ theme }: FacetsProps) => {
	// TODO: remove this comment when the variables are used
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables as BocachicaVariables;

	return css({});
};

// Facets component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/organisms-facets--default
export const facets: FacetsProps = {
	styleScript: facetsStyleScript,
};
