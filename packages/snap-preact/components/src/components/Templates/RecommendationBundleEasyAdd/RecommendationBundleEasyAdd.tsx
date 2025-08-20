import { h } from 'preact';
import { css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

import { defined, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import { RecommendationBundle, RecommendationBundleProps } from '../RecommendationBundle';

const defaultStyles: StyleScript<RecommendationBundleEasyAddProps> = () => {
	return css({
		'.ss__recommendation-bundle-easy-add__wrapper__cta': {
			textAlign: 'center',
		},
	});
};

export const RecommendationBundleEasyAdd = observer((properties: RecommendationBundleEasyAddProps): JSX.Element => {
	//mergeprops only uses names that are passed via properties, so this cannot be put in the defaultProps
	const _properties = {
		name: properties.controller?.store?.profile?.tag?.toLowerCase(),
		...properties,
	};

	const { treePath, disableStyles, controller, style: _, styleScript: __, themeStyleScript: ___, ...additionalProps } = _properties;

	const subProps: RecommendationBundleEasyAddSubProps = {
		recommendationBundle: {
			// default props
			hideCheckboxes: true,
			seedText: '',
			ctaButtonText: 'Add Both',
			ctaInline: false,
			hideSeed: true,
			alias: 'recommendationBundleEasyAdd',
			// vertical: true,
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
			theme: _properties?.theme,
			treePath,
		},
	};

	const styling = mergeStyles<RecommendationBundleEasyAddProps>(_properties, defaultStyles);

	return <RecommendationBundle controller={controller} {...styling} {...subProps.recommendationBundle} {...additionalProps} />;
});

export type RecommendationBundleEasyAddProps = ComponentProps &
	Omit<
		RecommendationBundleProps,
		'hideSeed' | 'limit' | 'hideCheckboxes' | 'carousel' | 'separatorIcon' | 'separatorIconSeedOnly' | 'preselectedCount' | 'breakpoints'
	>;

interface RecommendationBundleEasyAddSubProps {
	recommendationBundle: Partial<RecommendationBundleProps>;
}
