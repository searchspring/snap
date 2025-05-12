import { css } from '@emotion/react';
import type { FacetListOptionsProps } from '../../../../components/Molecules/FacetListOptions';
import { ThemeComponent } from '../../../../providers';
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
			'&.ss__facet-list-options__option--filtered': {
				fontWeight: 'initial',
				color: variables?.colors?.secondary,
			},
			'& .ss__facet-list-options__option__value': {
				'& .ss__facet-list-options__option__value__count': {
					fontSize: 'inherit',
					marginLeft: '5px',
				},
			},
		},
	});
};

// FacetListOptions component props
export const facetListOptions: ThemeComponent<'facetListOptions', FacetListOptionsProps> = {
	default: {
		props: {
			themeStyleScript: facetListOptionsStyleScript,
		},
	},
};
