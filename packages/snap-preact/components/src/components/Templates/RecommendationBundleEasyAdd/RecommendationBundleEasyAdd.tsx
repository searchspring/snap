import { h } from 'preact';
import { css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

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

export const recommendationBundleEasyAddThemeComponentProps: ThemeComponent<
	'recommendationBundleEasyAddThemeComponentProps',
	RecommendationBundleEasyAddProps
> = {
	default: {},
	mobile: {},
	tablet: {},
	desktop: {},
};

export const RecommendationBundleEasyAdd = observer((properties: RecommendationBundleEasyAddProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultProps: Partial<RecommendationBundleEasyAddProps> = {};

	//mergeprops only uses names that are passed via properties, so this cannot be put in the defaultProps
	const _properties = {
		name: properties.controller?.store?.profile?.display?.template?.component?.toLowerCase(),
		...properties,
	};

	const props = mergeProps('recommendationBundleEasyAdd', globalTheme, defaultProps, _properties);

	const { treePath, disableStyles, controller, style: _, styleScript: __, themeStyleScript: ___, ...additionalProps } = props;

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

	return <RecommendationBundle controller={controller} {...styling} {...subProps.recommendationBundle} {...additionalProps} />;
});

export type RecommendationBundleEasyAddProps = ComponentProps &
	Omit<
		RecommendationBundleProps,
		'hideSeed' | 'limit' | 'hideCheckboxes' | 'carousel' | 'separatorIcon' | 'separatorIconSeedOnly' | 'preselectedCount'
	>;

interface RecommendationBundleEasyAddSubProps {
	recommendationBundle: Partial<RecommendationBundleProps>;
}
