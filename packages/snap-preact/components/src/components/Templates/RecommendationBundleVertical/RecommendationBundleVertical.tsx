import { h } from 'preact';
import { css } from '@emotion/react';
import { observer } from 'mobx-react-lite';

import { defined, mergeStyles } from '../../../utilities';
import { ComponentProps, StyleScript } from '../../../types';
import { RecommendationBundle, RecommendationBundleProps } from '../RecommendationBundle';

const defaultStyles: StyleScript<RecommendationBundleVerticalProps> = () => {
	return css({
		'.ss__recommendation-bundle__wrapper': {
			flexDirection: 'column',
		},
		'.ss__recommendation-bundle__wrapper__cta': {
			textAlign: 'center',
		},
	});
};

export const RecommendationBundleVertical = observer((properties: RecommendationBundleVerticalProps): JSX.Element => {
	//mergeprops only uses names that are passed via properties, so this cannot be put in the defaultProps
	const _properties = {
		name: properties.controller?.store?.profile?.display?.template?.component?.toLowerCase(),
		...properties,
	};

	const { treePath, disableStyles, controller, style: _, styleScript: __, themeStyleScript: ___, ...additionalProps } = _properties;

	const subProps: RecommendationBundleVerticalSubProps = {
		recommendationBundle: {
			// default props
			className: 'ss__recommendation-bundle-vertical',
			ctaInline: false,
			carousel: {
				enabled: false,
			},
			separatorIcon: false,
			inherits: 'recommendationBundleVertical',

			// inherited props
			...defined({
				disableStyles,
			}),
			// component theme overrides
			theme: _properties?.theme,
			treePath,
		},
	};

	const styling = mergeStyles<RecommendationBundleVerticalProps>(_properties, defaultStyles);

	return <RecommendationBundle controller={controller} {...styling} {...subProps.recommendationBundle} {...additionalProps} />;
});

export type RecommendationBundleVerticalProps = Omit<RecommendationBundleProps, 'vertical' | 'ctaInline'> & ComponentProps;

interface RecommendationBundleVerticalSubProps {
	recommendationBundle: Partial<RecommendationBundleProps>;
}
