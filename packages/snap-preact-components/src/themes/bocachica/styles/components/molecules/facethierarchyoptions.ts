import { css, FacetHierarchyOptionsProps } from '../../../../../index';

// CSS in JS style script for the FacetHierarchyOptions component
const facetHierarchyOptionsStyleScript = ({ theme }: FacetHierarchyOptionsProps) => {
	const variables = theme?.variables;

	return css({
		'& .ss__facet-hierarchy-options__option': {
			display: 'flex',
			padding: '6px 0',
			textDecoration: 'none',
			alignItems: 'center',
			color: variables?.color?.secondary,

			'&:hover': {
				cursor: 'pointer',
			},
			'&.ss__facet-hierarchy-options__option--filtered': {
				fontWeight: 'bold',
				'&:hover': {
					cursor: 'default',
				},
				'& ~ .ss__facet-hierarchy-options__option:not(.ss__facet-hierarchy-options__option--filtered)': {
					paddingLeft: '16px',
				},
			},
			'&.ss__facet-hierarchy-options__option--return': {
				'&:before': {
					content: `'\\0000ab'`,
					padding: '0 2px 0 0',
					color: variables?.color?.accent,
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
export const facetHierarchyOptions: Partial<FacetHierarchyOptionsProps> = {
	styleScript: facetHierarchyOptionsStyleScript,
};
