import { h } from 'preact';
import { jsx, css } from '@emotion/react';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react';
import { useIntersection } from '../../../../hooks';
import type { RecommendationController } from '@searchspring/snap-controller';
import { ComponentProps, RootNodeProperties } from '../../../../types';
import type { Product } from '@searchspring/snap-store-mobx';
import classnames from 'classnames';

const CSS = {
	RecommendationResultTracker: ({}: Partial<RecommendationResultTrackerProps>) => css({}),
};

export const RecommendationResultTracker = observer((properties: RecommendationResultTrackerProps): JSX.Element => {
	const defaultTrack = {
		impression: true,
		click: true,
	};

	const { children, result, track, controller, className, disableStyles, style, styleScript } = properties;

	const mergedTrack = {
		...defaultTrack,
		...track,
	};
	const resultRef = useRef(null);
	const resultInViewport = useIntersection(resultRef, '0px');

	if (!controller.events.render) {
		controller.log.warn('<RecommendationResultTracker> used without <RecommendationProfileTracker>');
	}

	controller.track.product.render(result);
	if (resultInViewport && mergedTrack.impression) {
		// intersection observer can trigger in any random order,
		// so we need to check if profile impression has been sent and send if not.
		if (!controller.events.impression) {
			controller.track.impression();
		}
		controller.track.product.impression(result);
	}

	const styling: RootNodeProperties = { 'ss-name': properties.name };
	const stylingProps = properties;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.RecommendationResultTracker(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<div
			className={classnames('ss__recommendation-result-tracker', className)}
			onClick={(e: any) => mergedTrack.click && controller.track.product.click(e, result)}
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
	track?: {
		impression?: boolean;
		click?: boolean;
	};
}
