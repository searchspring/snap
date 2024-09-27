import { h } from 'preact';
import { css } from '@emotion/react';
import { observer } from 'mobx-react';

import { defined, mergeProps } from '../../../utilities';
import { Theme, useTheme } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { RecommendationBundle, RecommendationBundleProps } from '../RecommendationBundle';

const CSS = {
	RecommendationBundleVertical: ({}: Partial<RecommendationBundleVerticalProps>) =>
		css({
			'.ss__recommendation-bundle__wrapper': {
				flexDirection: 'column',
			},
			'.ss__recommendation-bundle__wrapper__cta': {
				textAlign: 'center',
			},
		}),
};

export const RecommendationBundleVertical = observer((properties: RecommendationBundleVerticalProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RecommendationBundleVerticalProps> = {};

	const props = mergeProps('RecommendationBundleVertical', globalTheme, defaultProps, properties);

	const { treePath, styleScript, theme, style, disableStyles } = props;

	const subProps: RecommendationBundleVerticalSubProps = {
		recommendationBundle: {
			// default props
			className: 'ss__recommendation-bundle-vertical__recommendation-bundle',
			ctaInline: false,
			carousel: {
				enabled: false,
			},
			separatorIcon: false,

			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: props?.theme,
			treePath,
		},
	};

	const styling: { css?: StylingCSS } = {};
	const stylingProps = { ...props, theme };

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.RecommendationBundleVertical(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return <RecommendationBundle {...styling} {...subProps.recommendationBundle} {...props} />;
});

export type RecommendationBundleVerticalProps = Omit<RecommendationBundleProps, 'vertical' | 'ctaInline'> & ComponentProps;

interface RecommendationBundleVerticalSubProps {
	recommendationBundle: Partial<RecommendationBundleProps>;
}
