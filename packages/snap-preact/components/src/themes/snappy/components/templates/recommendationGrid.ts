import { css } from '@emotion/react';
import type { RecommendationGridProps } from '../../../../components/Templates/RecommendationGrid';
import { recommendationGridThemeComponentProps } from '../../../../components/Templates/RecommendationGrid';

// CSS in JS style script for the RecommendationBundle component
const recommendationGridStyleScript = ({ theme }: RecommendationGridProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// RecommendationGrid component props come from Template export
export const recommendationGrid: ThemeComponent<'recommendationGrid', RecommendationGridProps> = {
	default: {
		props: {
			...recommendationGridThemeComponentProps.default?.props,
			themeStyleScript: recommendationGridStyleScript,
		},
		components: recommendationGridThemeComponentProps.default?.components,
	},
	mobile: recommendationGridThemeComponentProps.mobile,
	desktop: recommendationGridThemeComponentProps.desktop,
	tablet: recommendationGridThemeComponentProps.tablet,
};
