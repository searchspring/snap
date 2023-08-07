/** @jsx jsx */
import { Fragment, h, toChildArray } from 'preact';
import { jsx, css } from '@emotion/react';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { useIntersection } from '../../../../hooks';
import type { RecommendationController } from '@searchspring/snap-controller';
import { ComponentProps, StylingCSS } from '../../../../types';
import classnames from 'classnames';

const CSS = {
	RecommendationProfileTracker: () => css({}),
};

export const RecommendationProfileTracker = observer((properties: RecommendationProfileTrackerProps): JSX.Element => {
	const { children, controller, className, style, disableStyles } = properties;

	const childs = toChildArray(children);

	// do impression tracking for "profile"
	const componentRef = useRef(null);

	const inViewport = useIntersection(componentRef, '0px');

	if (inViewport) {
		controller.track.impression();
	}

	// takes care of rendering profile
	childs.length && controller.track.render();

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.RecommendationProfileTracker(), style];
	} else if (style) {
		styling.css = [style];
	}

	return childs.length ? (
		<div
			className={classnames('ss__recommendation-profile-tracker', className)}
			onClick={(e: any) => controller.track.click(e)}
			ref={componentRef}
			{...styling}
		>
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
