import { css, FacetPaletteOptionsProps } from '../../../../../index';
import { BocachicaVariables } from '../../../index';

// CSS in JS style script for the FacetPaletteOptions component
const facetPaletteStyleScript = ({ columns, gapSize, theme }: FacetPaletteOptionsProps) => {
	const variables = theme?.variables as BocachicaVariables;

	return css({
		display: 'flex',
		flexFlow: 'row wrap',
		gridTemplateColumns: `repeat(${columns}, calc((100% - (${columns! - 1} * ${gapSize}))/ ${columns}))`,
		gap: gapSize,

		'& .ss__facet-palette-options__option': {
			width: `calc(100% / ${columns} - ${2 * Math.round((columns! + 2) / 2)}px )`,
			marginRight: gapSize,
			marginBottom: gapSize,
			color: variables?.color?.text,

			[`:nth-of-type(${columns}n)`]: {
				marginRight: '0',
			},

			'&:hover': {
				cursor: 'pointer',
				'.ss__facet-palette-options__option__wrapper': {
					borderColor: '#EBEBEB',
				},
				'& .ss__facet-palette-options__option__palette': {
					'& .ss__facet-palette-options__icon': {
						opacity: 1,
					},
				},
			},
			'& .ss__facet-palette-options__option__wrapper': {
				border: `2px solid transparent`,
				borderRadius: '3px',
			},
			'&.ss__facet-palette-options__option--filtered': {
				'& .ss__facet-palette-options__option__wrapper': {
					borderColor: variables?.color?.primary || '#333',
					padding: '2px',
					borderWidth: '2px',
				},
			},
			'& .ss__facet-palette-options__option__palette': {
				paddingTop: '100%',
				boxShadow: `0px 0px 0 1px #EBEBEB`,
				borderRadius: '3px',
				position: 'relative',
				'& .ss__facet-palette-options__icon': {
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
			'& .ss__facet-palette-options__option__value': {
				display: 'block',
				textAlign: 'center',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
			},
		},
		'@supports (display: grid)': {
			display: 'grid',

			'& .ss__facet-palette-options__option': {
				margin: '0',
				width: 'initial',
			},
		},
	});
};

// FacetPaletteOptions component props
// https://searchspring.github.io/snap/packages/snap-preact-components/docs/?path=/docs/molecules-facetpaletteoptions--default
export const facetPaletteOptions: FacetPaletteOptionsProps = {
	styleScript: facetPaletteStyleScript,
	gapSize: '5px',
	columns: 5,
};
