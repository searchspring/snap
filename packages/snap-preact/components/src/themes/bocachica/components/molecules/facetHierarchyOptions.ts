import { css } from '@emotion/react';
import type { FacetHierarchyOptionsProps } from '../../../../components/Molecules/FacetHierarchyOptions';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the FacetHierarchyOptions component
const facetHierarchyOptionsStyleScript = ({ horizontal, theme }: FacetHierarchyOptionsProps) => {
	const variables = theme?.variables;

	if (horizontal) {
		return css({
			'.ss__facet-hierarchy-options__option': {
				color: variables?.colors?.secondary,
				border: `1px solid ${variables?.colors?.secondary || '#333'}`,
				padding: '0.5em 0.5em',

				'&.ss__facet-hierarchy-options__option--filtered': {
					fontWeight: 'bold',
					color: theme?.variables?.colors?.primary,
					marginRight: '2em',
				},
				'&.ss__facet-hierarchy-options__option--return': {
					'&:before': {
						color: variables?.colors?.accent,
					},
				},
			},
		});
	}

	return css({
		'.ss__facet-hierarchy-options__option': {
			color: variables?.colors?.secondary,

			'&.ss__facet-hierarchy-options__option--return': {
				'&:before': {
					color: variables?.colors?.accent,
				},
			},
		},
	});
};

// FacetHierarchyOptions component props
export const facetHierarchyOptions: ThemeComponent<'facetHierarchyOptions', FacetHierarchyOptionsProps> = {
	default: {
		props: {
			themeStyleScript: facetHierarchyOptionsStyleScript,
		},
	},
};
