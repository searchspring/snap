import { css } from '@emotion/react';
import type { RecommendationBundleEasyAddProps } from '../../../../components/Templates/RecommendationBundleEasyAdd';
import { recommendationBundleEasyAddThemeComponentProps } from '../../../themeComponents/recommendationBundleEasyAdd';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the RecommendationBundle component
const recommendationBundleEasyAddStyleScript = ({ theme }: RecommendationBundleEasyAddProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		border: `1px solid ${variables?.colors.accent}`,
		padding: '20px',

		'.ss__recommendation-bundle-easy-add__wrapper': {
			justifyContent: 'center',
		},

		'.ss__recommendation-bundle-easy-add__title': {
			textAlign: 'center',
			marginBottom: '20px',
		},
	});
};

// RecommendationBundleEasyAdd component props come from Template export
export const recommendationBundleEasyAdd: ThemeComponent<'recommendationBundleEasyAdd', RecommendationBundleEasyAddProps> = {
	default: {
		...recommendationBundleEasyAddThemeComponentProps.default,
		recommendationBundleEasyAdd: {
			...(recommendationBundleEasyAddThemeComponentProps.default?.['recommendationBundleEasyAdd'] || {}),
			ctaIcon: false,
			themeStyleScript: recommendationBundleEasyAddStyleScript,
		},
	},
	mobile: recommendationBundleEasyAddThemeComponentProps.mobile,
	desktop: recommendationBundleEasyAddThemeComponentProps.desktop,
	tablet: recommendationBundleEasyAddThemeComponentProps.tablet,
};
