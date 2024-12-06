import { css } from '@emotion/react';
import type { FacetHierarchyOptionsProps } from '../../../../components/Molecules/FacetHierarchyOptions';

// CSS in JS style script for the FacetHierarchyOptions component
const facetHierarchyOptionsStyleScript = ({ horizontal, theme }: FacetHierarchyOptionsProps) => {
	const variables = theme?.variables;

	if (horizontal) {
		return css({
			display: 'flex',
			flexWrap: 'wrap',
			'.ss__facet-hierarchy-options__option': {
				margin: '0 5px 5px 0',
				color: variables?.colors?.secondary,
				flex: '0 1 auto',
				border: `1px solid ${variables?.colors?.secondary || '#333'}`,
				padding: '0.5em 0.5em',
				textDecoration: 'none',
				'&.ss__facet-hierarchy-options__option--filtered': {
					fontWeight: 'bold',
					marginRight: '2em',
					'&:hover': {
						cursor: 'default',
					},
				},
				'&.ss__facet-hierarchy-options__option--return': {
					'&:before': {
						content: `'\\0000ab'`,
						padding: '0 2px 0 0',
						color: variables?.colors?.accent,
					},
				},
				'.ss__facet-hierarchy-options__option__value': {
					'.ss__facet-hierarchy-options__option__value__count': {
						fontSize: '0.8em',
						marginLeft: '6px',
					},
				},
			},
		});
	}

	return css({
		'.ss__facet-hierarchy-options__option': {
			display: 'flex',
			padding: '6px 0',
			textDecoration: 'none',
			alignItems: 'center',
			color: variables?.colors?.secondary,

			'&:hover': {
				cursor: 'pointer',
			},
			'&.ss__facet-hierarchy-options__option--filtered': {
				fontWeight: 'bold',
				'&:hover': {
					cursor: 'default',
				},
				'~ .ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)': {
					paddingLeft: '16px',
				},
			},
			'&.ss__facet-hierarchy-options__option--return': {
				'&:before': {
					content: `'\\0000ab'`,
					padding: '0 2px 0 0',
					color: variables?.colors?.accent,
				},
			},
			'.ss__facet-hierarchy-options__option__value': {
				'.ss__facet-hierarchy-options__option__value__count': {
					fontSize: '0.8em',
					marginLeft: '6px',
				},
			},
		},
	});
};

// FacetHierarchyOptions component props
export const facetHierarchyOptions: Partial<FacetHierarchyOptionsProps> = {
	themeStyleScript: facetHierarchyOptionsStyleScript,
};
