/** @jsx jsx */
import { Fragment, h, toChildArray } from 'preact';
import { jsx, css } from '@emotion/react';
import { observer } from 'mobx-react';
import { Theme, useTheme } from '../../../../providers';
import type { RecommendationController } from '@searchspring/snap-controller';
import { ComponentProps, StylingCSS } from '../../../../types';
import classnames from 'classnames';

const CSS = {
	RecommendationProfileTracker: () => css({}),
};

/** @deprecated RecommendationProfileTracker is deprecated */
export const RecommendationProfileTracker = observer((properties: RecommendationProfileTrackerProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: RecommendationProfileTrackerProps = {
		// default props
		// global theme
		...globalTheme?.components?.RecommendationProfileTracker,
		// props
		...properties,
		...properties.theme?.components?.RecommendationProfileTracker,
	};

	const { children, className, style, disableStyles } = props;

	const childs = toChildArray(children);

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.RecommendationProfileTracker(), style];
	} else if (style) {
		styling.css = [style];
	}

	return childs.length ? (
		<div className={classnames('ss__recommendation-profile-tracker', className)} {...styling}>
			{children}
		</div>
	) : (
		<Fragment></Fragment>
	);
});

export interface RecommendationProfileTrackerProps extends ComponentProps {
	children: any;
	controller: RecommendationController;
}
