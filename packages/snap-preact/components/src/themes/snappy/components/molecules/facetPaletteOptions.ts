import { css } from '@emotion/react';
import type { FacetPaletteOptionsProps } from '../../../../components/Molecules/FacetPaletteOptions';

// CSS in JS style script for the FacetPaletteOptions component
const facetPaletteStyleScript = ({ theme }: FacetPaletteOptionsProps) => {
	return css({
		a: {
			color: theme?.variables?.colors?.text,
		},
		'.ss__facet-palette-options__option': {
			'&:hover': {
				cursor: 'pointer',
				'.ss__facet-palette-options__option__palette': {
					opacity: 0.7,
				},
				'.ss__facet-palette-options__option__wrapper': {
					borderColor: 'transparent !important',
				},
			},
			'.ss__facet-palette-options__option__wrapper': {
				borderRadius: '50%',
				overflow: 'hidden',
				padding: '0px',
			},

			'.ss__facet-palette-options__option__palette': {
				border: '2px solid #e6e6e6',

				'.ss__facet-palette-options__icon': {
					opacity: 1,
					stroke: 'gray',
					strokeWidth: '2px',
				},
			},
		},
		'&.ss__facet-palette-options--grid': {
			'.ss__facet-palette-options__option--filtered': {
				'.ss__facet-palette-options__option__wrapper': {
					border: '0px',
				},
			},
		},
	});
};

// FacetPaletteOptions component props
export const facetPaletteOptions: ThemeComponent<'facetPaletteOptions', FacetPaletteOptionsProps> = {
	default: {
		props: {
			themeStyleScript: facetPaletteStyleScript,
			gapSize: '3px',
			hideLabel: true,
			columns: 5,
			hideIcon: false,
		},
		components: {
			'*facetPaletteOptions icon': {
				size: '50%',
				icon: 'check-thin',
			},
		},
	},
};
