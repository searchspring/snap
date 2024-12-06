import { css } from '@emotion/react';
import type { RecommendationGridProps } from '../../../../components/Templates/RecommendationGrid';

// CSS in JS style script for the RecommendationGrid component
const recommendationGridStyleScript = ({ columns, gapSize }: Partial<RecommendationGridProps>) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars

	return css({
		overflow: 'auto',
		maxWidth: '100%',
		maxHeight: '100%',
		'.ss__recommendation-grid__results': {
			display: 'flex',
			flexFlow: 'row wrap',
			gap: gapSize,
			gridTemplateRows: 'auto',
			gridTemplateColumns: `repeat(${columns}, 1fr)`,

			'@supports (display: grid)': {
				display: 'grid',
			},
		},
	});
};

// RecommendationGrid component props
export const recommendationGrid: Partial<RecommendationGridProps> = {
	themeStyleScript: recommendationGridStyleScript,
};
