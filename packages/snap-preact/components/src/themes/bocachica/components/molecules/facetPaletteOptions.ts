import { css } from '@emotion/react';
import type { FacetPaletteOptionsProps } from '../../../../components/Molecules/FacetPaletteOptions';

// CSS in JS style script for the FacetPaletteOptions component
const facetPaletteStyleScript = ({ columns, horizontal, gapSize, gridSize, theme }: FacetPaletteOptionsProps) => {
	return css({
		display: 'flex',
		flexFlow: 'row wrap',
		gridTemplateColumns: columns
			? `repeat(${columns}, calc((100% - (${columns! - 1} * ${gapSize}))/ ${columns}))`
			: `repeat(auto-fill, minmax(${gridSize}, 1fr))`,
		gap: gapSize,

		'.ss__facet-palette-options__option--list': {
			display: 'flex',
			flexDirection: 'row',
		},

		'.ss__facet-palette-options__option': {
			width: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px )`,
			marginRight: gapSize,
			marginBottom: gapSize,
			[`:nth-of-type(${columns}n)`]: {
				marginRight: '0',
			},

			'.ss__facet-palette-options__option__wrapper': {
				border: `2px solid transparent`,
				borderRadius: '3px',
				padding: '2px',
			},

			'.ss__facet-palette-options__option__palette': {
				paddingTop: 'calc(100% - 2px)',
				border: '1px solid #EBEBEB',
				borderRadius: '3px',
				position: 'relative',
				'.ss__facet-palette-options__icon': {
					position: 'absolute',
					top: 0,
					right: 0,
					left: 0,
					margin: 'auto',
					bottom: 0,
					textAlign: 'center',
					stroke: 'black',
					strokeWidth: '3px',
					strokeLinejoin: 'round',
					opacity: 0,
				},
			},
			'.ss__facet-palette-options__option__value': {
				display: 'block',
				textAlign: 'center',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
			},
		},
		'@supports (display: grid)': {
			display: 'grid',

			'.ss__facet-palette-options__option': {
				margin: '0',
				width: 'initial',
			},
		},

		'&.ss__facet-palette-options--list': {
			display: 'flex',
			flexDirection: horizontal ? 'row' : 'column',

			'.ss__facet-palette-options__option__wrapper': {
				borderColor: 'transparent',
				width: '16px',
				height: 'fit-content',
			},

			'.ss__facet-palette-options__option--filtered': {
				'.ss__facet-palette-options__option__value': {
					fontWeight: 'bold',
				},
			},

			'.ss__facet-palette-options__option--list': {
				alignItems: 'center',
			},

			'.ss__facet-palette-options__option__value__count': {
				marginLeft: '5px',
			},

			'.ss__facet-palette-options__checkbox': {
				marginRight: '5px',
			},
		},

		'&.ss__facet-palette-options--grid': {
			'.ss__facet-palette-options__checkbox': {
				display: 'flex',
				textAlign: 'center',
				overflow: 'hidden',
				margin: 'auto',
				marginBottom: '5px',
			},

			'.ss__facet-palette-options__option--filtered': {
				'.ss__facet-palette-options__option__wrapper': {
					borderColor: theme?.variables?.colors?.primary || '#333' + ' !important',
					padding: '0px',
					borderWidth: '4px',
				},
			},

			'.ss__facet-palette-options__option': {
				'&:hover': {
					cursor: 'pointer',
					'.ss__facet-palette-options__option__wrapper': {
						borderColor: '#EBEBEB',
					},
					'.ss__facet-palette-options__option__palette': {
						'.ss__facet-palette-options__icon': {
							opacity: 1,
						},
					},
				},
			},
		},

		'.ss__facet-palette-options__option__value__count': {
			fontSize: '0.8em',
			display: 'block',
			textAlign: 'center',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
		},
	});
};

// FacetPaletteOptions component props
export const facetPaletteOptions: Partial<FacetPaletteOptionsProps> = {
	styleScript: facetPaletteStyleScript,
	gapSize: '3px',
	columns: 5,
};
