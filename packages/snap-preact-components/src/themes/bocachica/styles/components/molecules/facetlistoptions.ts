import { css, FacetListOptionsProps } from '../../../../../index';

// CSS in JS style script for the FacetListOptions component
const facetListOptionsStyleScript = ({ hideCheckbox, horizontal, theme }: FacetListOptionsProps) => {
	const variables = theme?.variables;

	return css({
		display: horizontal ? 'flex' : undefined,
		flexWrap: horizontal ? 'wrap' : undefined,

		'& .ss__facet-list-options__option': {
			display: horizontal ? undefined : 'flex',
			alignItems: horizontal ? undefined : 'center',

			margin: horizontal ? '0 5px 5px 0' : '0 0 5px 0',
			color: variables?.color?.secondary,

			flex: horizontal ? '0 1 auto' : undefined,
			border: horizontal ? `1px solid ${variables?.color?.secondary || '#333'}` : undefined,
			padding: horizontal ? '0.5em 0.5em' : undefined,

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
