import { css, HorizontalFacetsProps } from '../../../../../index';

// CSS in JS style script for the Facets component
const horizontalFacetsStyleScript = ({ theme }: HorizontalFacetsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__horizontal-facets__header': {
			display: 'flex',
			flexWrap: 'wrap',
			width: '100%',
			alignItems: 'baseline',
		},

		'& .ss__facet': {
			boxSizing: 'border-box',
			margin: '0px 0px 10px 0px',
			paddingInlineEnd: '20px',
			width: 'auto',
			// minWidth: '180px',
			// width: '33.3%',
			// maxWidth: '20%',

			'& .ss__facet__dropdown__icon': {
				margin: 'auto 0 auto 5px',
			},

			'& .ss__dropdown__content': {
				zIndex: '1',
				minWidth: '200px',
			},
		},
	});
};

// Facets component props
export const horizontalFacets: Partial<HorizontalFacetsProps> = {
	styleScript: horizontalFacetsStyleScript,
	theme: {
		components: {
			facet: {
				theme: {
					components: {
						facetGridOptions: {
							horizontal: true,
						},
						facetPaletteOptions: {
							horizontal: true,
						},
						facetListOptions: {
							horizontal: true,
							hideCheckbox: true,
						},
					},
				},
			},
		},
	},
};
