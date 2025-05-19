import { css } from '@emotion/react';
import type { RecommendationGridProps } from '../../../../components/Templates/RecommendationGrid';
import { recommendationGridThemeComponentProps } from '../../../themeComponents/recommendationGrid';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the RecommendationBundle component
const recommendationGridStyleScript = ({ theme }: RecommendationGridProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// RecommendationGrid component props come from Template export
export const recommendationGrid: ThemeComponent<'recommendationGrid', RecommendationGridProps> = {
	default: {
		...recommendationGridThemeComponentProps.default,
		recommendationGrid: {
			...(recommendationGridThemeComponentProps.default?.['recommendationGrid'] || {}),
			themeStyleScript: recommendationGridStyleScript,
		},
	},
	mobile: recommendationGridThemeComponentProps.mobile,
	desktop: recommendationGridThemeComponentProps.desktop,
	tablet: recommendationGridThemeComponentProps.tablet,
};
