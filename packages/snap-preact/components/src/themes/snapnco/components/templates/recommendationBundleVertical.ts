import { css } from '@emotion/react';
import type { RecommendationBundleVerticalProps } from '../../../../components/Templates/RecommendationBundleVertical';
import { recommendationBundleVerticalThemeComponentProps } from '../../../themeComponents/recommendationBundleVertical';

// CSS in JS style script for the RecommendationBundle component
const recommendationBundleVerticalStyleScript = ({ theme }: RecommendationBundleVerticalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({});
};

// RecommendationBundleVertical component props come from Template export
export const recommendationBundleVertical: ThemeComponent<'recommendationBundleVertical', RecommendationBundleVerticalProps> = {
	default: {
		props: {
			...recommendationBundleVerticalThemeComponentProps.default?.props,
			themeStyleScript: recommendationBundleVerticalStyleScript,
		},
		components: recommendationBundleVerticalThemeComponentProps.default?.components,
	},
	mobile: recommendationBundleVerticalThemeComponentProps.mobile,
	desktop: recommendationBundleVerticalThemeComponentProps.desktop,
	tablet: recommendationBundleVerticalThemeComponentProps.tablet,
};
