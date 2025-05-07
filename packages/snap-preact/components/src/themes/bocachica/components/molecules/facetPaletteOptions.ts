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
				'.ss__facet-palette-options__option__wrapper': {
					borderColor: 'transparent !important',
				},
			},
			'.ss__facet-palette-options__option__wrapper': {
				borderRadius: '3px',
				padding: '0px',
			},

			'.ss__facet-palette-options__option__palette': {
				borderRadius: '3px',
			},
		},
	});
};

// FacetPaletteOptions component props
export const facetPaletteOptions: ThemeComponent<'facetPaletteOptions', FacetPaletteOptionsProps> = {
	default: {
		props: {
			themeStyleScript: facetPaletteStyleScript,
			gapSize: '0px',
			columns: 5,
		},
	},
};
