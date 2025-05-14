import { css } from '@emotion/react';
import type { RecommendationBundleProps } from '../../../../components/Templates/RecommendationBundle';
import { recommendationBundleThemeComponentProps } from '../../../themeComponents/recommendationBundle';
import { ThemeComponent } from '../../../../providers';
// CSS in JS style script for the RecommendationBundle component
const recommendationBundleStyleScript = ({ theme }: any) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		margin: '20px 0',

		'.ss__recommendation-bundle__wrapper__selector': {
			'& .ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge': {
				backgroundColor: variables?.colors.accent,
				color: '#fff',
			},
		},
	});
};

// RecommendationBundle component props come from Template export
export const recommendationBundle: ThemeComponent<'recommendationBundle', RecommendationBundleProps> = {
	default: {
		props: {
			...recommendationBundleThemeComponentProps.default?.props,
			themeStyleScript: recommendationBundleStyleScript,
		},
		components: recommendationBundleThemeComponentProps.default?.components,
	},
	mobile: recommendationBundleThemeComponentProps.mobile,
	desktop: recommendationBundleThemeComponentProps.desktop,
	tablet: recommendationBundleThemeComponentProps.tablet,
};
