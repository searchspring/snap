import { css } from '@emotion/react';
import type { FacetGridOptionsProps } from '../../../../components/Molecules/FacetGridOptions';
import Color from 'color';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the FacetGridOptions component
const facetGridOptionsStyleScript = ({ theme }: FacetGridOptionsProps) => {
	const variables = theme?.variables;
	const backgroundColorObj = new Color(variables?.colors.primary);
	const colorObj = backgroundColorObj.isDark() ? new Color('#fff') : new Color('#000');

	return css({
		a: {
			color: theme?.variables?.colors?.text,
		},

		'& .ss__facet-grid-options__option': {
			border: `1px solid ${backgroundColorObj.hex()}`,
			borderRadius: '3px',
			'&.ss__facet-grid-options__option--filtered': {
				background: backgroundColorObj.hex(),
				color: colorObj.hex(),
			},
			'&:hover:not(.ss__facet-grid-options__option--filtered)': {
				cursor: 'pointer',
			},
		},
	});
};

// FacetGridOptions component props
export const facetGridOptions: ThemeComponent<'facetGridOptions', FacetGridOptionsProps> = {
	default: {
		props: {
			themeStyleScript: facetGridOptionsStyleScript,
			gapSize: '5px',
			columns: 5,
		},
	},
};
