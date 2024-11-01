import { h } from 'preact';
import { css } from '@emotion/react';
import { observer } from 'mobx-react';

import { defined, mergeProps, mergeStyles } from '../../../utilities';
import { Theme, useTheme } from '../../../providers';
import { ComponentProps, StyleScript } from '../../../types';
import { RecommendationBundle, RecommendationBundleProps } from '../RecommendationBundle';

const defaultStyles: StyleScript<RecommendationBundleEasyAddProps> = () => {
	return css({
		'.ss__recommendation-bundle__wrapper__cta': {
			textAlign: 'center',
		},
	});
};

export const RecommendationBundleEasyAdd = observer((properties: RecommendationBundleEasyAddProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RecommendationBundleEasyAddProps> = {};

	const props = mergeProps('recommendationBundleEasyAdd', globalTheme, defaultProps, properties);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { treePath, styleScript, theme, style, disableStyles, ...additionalProps } = props;

	const subProps: RecommendationBundleEasyAddSubProps = {
		recommendationBundle: {
			// default props
			className: 'ss__recommendation-bundle-easy-add',
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

	const styling = mergeStyles<RecommendationBundleEasyAddProps>(props, defaultStyles);

	return <RecommendationBundle {...styling} {...subProps.recommendationBundle} {...additionalProps} />;
});

export type RecommendationBundleEasyAddProps = Omit<
	RecommendationBundleProps,
	'hideSeed' | 'limit' | 'hideCheckboxes' | 'carousel' | 'separatorIcon' | 'separatorIconSeedOnly' | 'preselectedCount'
> &
	ComponentProps;

interface RecommendationBundleEasyAddSubProps {
	recommendationBundle: Partial<RecommendationBundleProps>;
}
