import { css, FacetListOptionsProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the FacetListOptions component
const facetListOptionsStyleScript = ({ hideCheckbox, theme }: FacetListOptionsProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		'& .ss__facet-list-options__option': {
			display: 'flex',
			padding: '6px',
			textDecoration: 'none',
			alignItems: 'center',
			'&:hover': {
				cursor: 'pointer',
				background: variables?.color?.hover,
			},
			'&.ss__facet-list-options__option--filtered': {
				fontWeight: 'bold',
				color: variables?.color?.primary,
			},
			'& .ss__facet-list-options__option__value': {
				marginLeft: hideCheckbox ? '' : '8px',
				'& .ss__facet-list-options__option__value__count': {
					fontSize: '0.8em',
					marginLeft: '6px',
				},
			},
		},
	});
};

// FacetListOptions component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-facetlistoptions--default
export const facetListOptions: FacetListOptionsProps = {
	styleScript: facetListOptionsStyleScript,
};
