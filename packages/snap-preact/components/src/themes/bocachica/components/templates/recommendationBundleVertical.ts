import { css } from '@emotion/react';
import type { RecommendationBundleVerticalProps } from '../../../../components/Templates/RecommendationBundleVertical';
import { recommendationBundleVerticalThemeComponentProps } from '../../../themeComponents/recommendationBundleVertical';
import { ThemeComponent } from '../../../../providers';

// CSS in JS style script for the RecommendationBundle component
const recommendationBundleVerticalStyleScript = ({ theme }: RecommendationBundleVerticalProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const variables = theme?.variables;

	return css({
		border: `1px solid ${variables?.colors.accent}`,
		padding: '20px',

		'.ss__recommendation-bundle-vertical__title': {
			textAlign: 'center',
			marginBottom: '20px',
		},

		'.ss__recommendation-bundle-vertical__wrapper__selector--seed': {
			flexDirection: 'column',
			display: 'flex',
			marginBottom: '10px',
		},

		'.ss__recommendation-bundle-vertical__wrapper__selector': {
			'.ss__recommendation-bundle-vertical__wrapper__selector__icon': {
				position: 'relative',
				right: 'initial',
				top: 'initial',
				margin: '10px auto',
			},
		},
	});
};

// RecommendationBundleVertical component props come from Template export
export const recommendationBundleVertical: ThemeComponent<'recommendationBundleVertical', RecommendationBundleVerticalProps> = {
	default: {
		...recommendationBundleVerticalThemeComponentProps.default,
		recommendationBundleVertical: {
			...(recommendationBundleVerticalThemeComponentProps.default?.['recommendationBundleVertical'] || {}),
			limit: 3,
			separatorIcon: 'plus-thin',
			themeStyleScript: recommendationBundleVerticalStyleScript,
		},
	},
	mobile: recommendationBundleVerticalThemeComponentProps.mobile,
	desktop: recommendationBundleVerticalThemeComponentProps.desktop,
	tablet: recommendationBundleVerticalThemeComponentProps.tablet,
};
