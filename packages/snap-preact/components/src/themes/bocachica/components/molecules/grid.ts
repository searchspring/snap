import { css } from '@emotion/react';
import type { GridProps } from '../../../../components/Molecules/Grid';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the Grid component
const gridStyleScript = ({ theme }: Partial<GridProps>) => {
	return css({
		'.ss__grid__options': {
			'.ss__grid__option': {
				'&.ss__grid__option--selected': {
					border: `3px solid ${theme?.variables?.colors?.primary || '#333'}`,
					fontWeight: 'bold',
				},
			},
		},
	});
};

// Grid component props
export const grid: ThemeComponent<'grid', GridProps> = {
	default: {
		grid: {
			themeStyleScript: gridStyleScript,
			hideShowLess: true,
			overflowButtonInGrid: true,
		},
	},
};
