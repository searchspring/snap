// import { css } from '@emotion/react';
import type { RecommendationBundleProps } from '../../../../components/Templates/RecommendationBundle';
import { recommendationBundleThemeComponentProps } from '../../../../components/Templates/RecommendationBundle';

// CSS in JS style script for the Search component
// const recommendationBundleStyleScript = ({ theme }: SearchSnapncoProps) => {
// 	// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 	const variables = theme?.variables;

// 	return css({});
// };

// Search component props come from Template export
export const recommendationBundle: ThemeComponentProps<RecommendationBundleProps> = recommendationBundleThemeComponentProps;
