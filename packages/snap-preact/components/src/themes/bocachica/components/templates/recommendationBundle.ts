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

		'.ss__recommendation-bundle__title': {
			textAlign: 'center',
		},

		'.ss__recommendation-bundle__wrapper__selector': {
			'& .ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge': {
				backgroundColor: variables?.colors.accent,
				color: '#fff',
			},
		},
		'.ss__recommendation-bundle__wrapper__cta': {
			border: `1px solid ${variables?.colors.accent}`,
			borderRadius: '5px',
			alignItems: 'center',
			flexDirection: 'column',
			justifyContent: 'center',
			height: 'fit-content',
			padding: '20px 0px',
			verticalAlign: 'middle',
			display: 'flex',
			alignSelf: 'center',
		},

		'.ss__recommendation-bundle__wrapper__cta__subtotal': {
			margin: '15px 0px',
		},
	});
};

// RecommendationBundle component props come from Template export
export const recommendationBundle: ThemeComponent<'recommendationBundle', RecommendationBundleProps> = {
	default: {
		...recommendationBundleThemeComponentProps.default,
		recommendationBundle: {
			...(recommendationBundleThemeComponentProps.default?.['recommendationBundle'] || {}),
			themeStyleScript: recommendationBundleStyleScript,
		},
	},
	mobile: recommendationBundleThemeComponentProps.mobile,
	desktop: recommendationBundleThemeComponentProps.desktop,
	tablet: recommendationBundleThemeComponentProps.tablet,
};
