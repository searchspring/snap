import { css, HorizontalFacetsProps } from '../../../../../index';

// CSS in JS style script for the Facets component
const horizontalFacetsStyleScript = ({ theme }: HorizontalFacetsProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		'& .ss__horizontal-facets__header': {
			display: 'flex',
			flexWrap: 'wrap',

			'& .ss__mobile-sidebar': {
				margin: '0 10px',
			},

			'& .ss__horizontal-facets__header__dropdown': {
				flex: '0 0 0%',
				padding: '5px 10px',
				margin: '0 0 10px 0',
				boxSizing: 'border-box',
				minWidth: '100px',

				'& .ss__icon': {
					transition: 'transform ease .5s',
				},

				'& .ss__horizontal-facets__header__dropdown__button': {
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				},

				'&.ss__dropdown--open': {
					backgroundColor: variables?.color?.active?.background,
					color: variables?.color?.active?.foreground,

					'& .ss__horizontal-facets__header__dropdown__button': {
						'& .ss__icon': {
							fill: variables?.color?.active?.accent,
							transform: 'rotate(180deg)',
						},
					},
				},
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
				named: {
					horizontalFacet: {
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
		},
	},
};
