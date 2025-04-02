/** @jsx jsx */
import { h, ComponentChildren } from 'preact';
import { jsx, css } from '@emotion/react';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react';
import { Theme, useTheme } from '../../../providers';
import { useIntersectionAdvanced } from '../../../hooks';
import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import { ComponentProps, StylingCSS } from '../../../types';
import type { Banner, Product } from '@searchspring/snap-store-mobx';
import classnames from 'classnames';

const CSS = {
	ResultTracker: () => css({}),
};

export const ResultTracker = observer((properties: ResultTrackerProps): JSX.Element => {
	const globalTheme: Theme = useTheme();
	const defaultTrack = {
		render: true,
		impression: true,
		click: true,
	};

	const props: ResultTrackerProps = {
		// default props
		// global theme
		...globalTheme?.components?.ResultTracker,
		// props
		...properties,
		...properties.theme?.components?.ResultTracker,
	};

	const { children, result, track, controller, className, disableStyles, style } = props;

	const mergedTrack = {
		...defaultTrack,
		...track,
	};
	const resultRef = useRef(null);
	const resultInViewport = useIntersectionAdvanced(resultRef, {
		key: result.id,
		rootMargin: '0px',
		fireOnce: true,
		threshold: 0.75,
		startDelay: 2000,
		minVisibleTime: 150,
	});
	if (resultInViewport && mergedTrack.impression) {
		if (result.type === 'product' && controller?.track) {
			controller?.track?.product?.impression(result as Product);
		} else {
			// track banner in future
		}
	}

	const styling: { css?: StylingCSS } = {};
	if (!disableStyles) {
		styling.css = [CSS.ResultTracker(), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<div
			key={result.id}
			className={classnames('ss__result-tracker', `ss__${controller?.type}-result-tracker`, className)}
			onClick={(e: any) => {
				if (mergedTrack.click) {
					if (result.type === 'product') {
						controller?.track?.product?.click(e, result as Product);
					}
				}
			}}
			ref={resultRef}
			{...styling}
		>
			{children}
		</div>
	);
});

export interface ResultTrackerProps extends ComponentProps {
	children: ComponentChildren;
	result: Product | Banner;
	controller: SearchController | AutocompleteController | RecommendationController;
	track?: {
		render?: boolean;
		impression?: boolean;
		click?: boolean;
	};
}
