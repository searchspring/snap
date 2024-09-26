import { h } from 'preact';
import { css } from '@emotion/react';
import { observer } from 'mobx-react';

import { defined, mergeProps } from '../../../utilities';
import { Theme, useTheme } from '../../../providers';
import { ComponentProps, StylingCSS } from '../../../types';
import { RecommendationBundle, RecommendationBundleProps } from '../RecommendationBundle';

const CSS = {
	RecommendationBundleEasyAdd: ({}: Partial<RecommendationBundleEasyAddProps>) =>
		css({
			'.ss__recommendation-bundle__wrapper__cta': {
				textAlign: 'center',
			},
		}),
};

export const RecommendationBundleEasyAdd = observer((properties: RecommendationBundleEasyAddProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RecommendationBundleEasyAddProps> = {};

	const props = mergeProps('RecommendationBundleEasyAdd', globalTheme, defaultProps, properties);

	const { treePath, styleScript, theme, style, disableStyles } = props;

	const subProps: RecommendationBundleEasyAddSubProps = {
		recommendationBundle: {
			// default props
			className: 'ss__recommendation-easy-add__recommendation-bundle',
			hideCheckboxes: true,
			seedText: '',
			ctaButtonText: 'Add Both',
			ctaInline: false,
			hideSeed: true,
			vertical: true,
			limit: 1,
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
		styling.css = [CSS.RecommendationBundleEasyAdd(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return <RecommendationBundle {...styling} {...props} {...subProps.recommendationBundle} />;
});

export type RecommendationBundleEasyAddProps = Omit<
	RecommendationBundleProps,
	'hideSeed' | 'limit' | 'hideCheckboxes' | 'carousel' | 'separatorIcon' | 'separatorIconSeedOnly' | 'preselectedCount'
> &
	ComponentProps;

interface RecommendationBundleEasyAddSubProps {
	recommendationBundle: Partial<RecommendationBundleProps>;
}
