import { css, FacetListOptionsProps } from '../../../../../index';

// CSS in JS style script for the FacetListOptions component
const facetListOptionsStyleScript = ({ hideCheckbox, theme }: FacetListOptionsProps) => {
	const variables = theme?.variables;

	return css({
		'& .ss__facet-list-options__option': {
			display: 'flex',
			margin: '0 0 5px 0',
			alignItems: 'center',
			color: variables?.color?.secondary,

			'&:hover': {
				cursor: 'pointer',
			},
			'&.ss__facet-list-options__option--filtered': {
				fontWeight: 'bold',
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
export const facetListOptions: Partial<FacetListOptionsProps> = {
	styleScript: facetListOptionsStyleScript,
};
