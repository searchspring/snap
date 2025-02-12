import { css } from '@emotion/react';
import type { FacetListOptionsProps } from '../../../../components/Molecules/FacetListOptions';

// CSS in JS style script for the FacetListOptions component
const facetListOptionsStyleScript = ({ horizontal, theme }: FacetListOptionsProps) => {
	const variables = theme?.variables;

	return css({
		'& .ss__facet-list-options__option': {
			margin: horizontal ? '0 5px 5px 0' : '0 0 5px 0',
			color: variables?.colors?.secondary,
			border: horizontal ? `1px solid ${variables?.colors?.secondary || '#333'}` : undefined,
			padding: horizontal ? '0.5em 0.5em' : undefined,
			textDecoration: 'none',

			'&:hover': {
				cursor: 'pointer',
			},
		},
	});
};

// FacetListOptions component props
export const facetListOptions: ThemeComponentProps<FacetListOptionsProps> = {
	default: {
		themeStyleScript: facetListOptionsStyleScript,
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
