/** @jsx jsx */
import { h } from 'preact';
import { jsx, css } from '@emotion/react';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme } from '../../../providers';
import { useIntersection } from '../../../hooks';
import type { RecommendationController } from '@searchspring/snap-controller';
import { ComponentProps, StylingCSS } from '../../../types';
import type { Product } from '@searchspring/snap-store-mobx';
import classnames from 'classnames';

const CSS = {
	RecommendationResultTracker: () => css({}),
};

export const RecommendationResultTracker = observer((properties: RecommendationResultTrackerProps): JSX.Element => {
	const globalTheme: Theme = useTheme();

	const props: RecommendationResultTrackerProps = {
		// default props
		// global theme
		...globalTheme?.components?.RecommendationResultTracker,
		// props
		...properties,
		...properties.theme?.components?.RecommendationResultTracker,
	};

	const { children, result, controller, className, disableStyles, style } = props;

	const resultRef = useRef(null);
	const resultInViewport = useIntersection(resultRef, '0px');

	if (resultInViewport) {
		if (!controller.events.impression) {
			controller.track.impression();
		}
		controller.track.product.impression(result);
	}

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.RecommendationResultTracker(), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<div
			className={classnames('ss__recommendation-result-tracker', className)}
			onClick={(e: any) => controller.track.product.click(e, result)}
			ref={resultRef}
			{...styling}
		>
			{children}
		</div>
	);
});

export interface RecommendationResultTrackerProps extends ComponentProps {
	children: any;
	result: Product;
	controller: RecommendationController;
}
