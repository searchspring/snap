import { css } from '@emotion/react';
import type { GridProps } from '../../../../components/Molecules/Grid';

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
		props: {
			themeStyleScript: gridStyleScript,
			hideShowLess: true,
			overflowButtonInGrid: true,
		},
	},
};
