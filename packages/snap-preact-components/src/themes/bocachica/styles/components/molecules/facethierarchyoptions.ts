import { css, FacetHierarchyOptionsProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the FacetHierarchyOptions component
const facetHierarchyOptionsStyleScript = ({ theme }: FacetHierarchyOptionsProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		'& .ss__facet-hierarchy-options__option': {
			display: 'flex',
			padding: '6px 0',
			textDecoration: 'none',
			alignItems: 'center',
			'&:hover': {
				cursor: 'pointer',
				background: variables.color?.hover,
			},
			'&.ss__facet-hierarchy-options__option--filtered': {
				fontWeight: 'bold',
				color: variables.color?.primary,
				'&:hover': {
					cursor: 'default',
					background: 'unset',
				},
				'& ~ .ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)': {
					paddingLeft: '16px',
				},
			},
			'&.ss__facet-hierarchy-options__option--return': {
				'&:before': {
					content: `'\\0000ab'`,
					padding: '0 2px 0 0',
					color: variables.color?.primary,
				},
			},
			'& .ss__facet-hierarchy-options__option__value': {
				marginLeft: '8px',
				'& .ss__facet-hierarchy-options__option__value__count': {
					fontSize: '0.8em',
					marginLeft: '6px',
				},
			},
		},
	});
};

// FacetHierarchyOptions component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-facethierarchyoptions--default
export const facetHierarchyOptions: FacetHierarchyOptionsProps = {
	styleScript: facetHierarchyOptionsStyleScript,
};
