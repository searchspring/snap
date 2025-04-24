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
				border: '1px solid #d6d6d6',

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
export const facetPaletteOptions: ThemeComponentProps<FacetPaletteOptionsProps> = {
	default: {
		themeStyleScript: facetPaletteStyleScript,
		gapSize: '8px',
		hideLabel: true,
		columns: 5,
		hideIcon: false,
		theme: {
			components: {
				icon: {
					size: '50%',
					icon: 'check-thin',
				},
			},
		},
	},
	mobile: {},
	tablet: {},
	desktop: {},
};
