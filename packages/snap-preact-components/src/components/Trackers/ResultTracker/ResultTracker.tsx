/** @jsx jsx */
import { h, ComponentChildren } from 'preact';
import { jsx, css } from '@emotion/react';
import { observer } from 'mobx-react';
import { Theme, useTheme } from '../../../providers';
import type { AutocompleteController, RecommendationController, SearchController } from '@searchspring/snap-controller';
import { ComponentProps, StylingCSS } from '../../../types';
import type { Banner, Product } from '@searchspring/snap-store-mobx';
import classnames from 'classnames';
import { createImpressionObserver } from '../../../utilities';
import { type Ref } from 'preact/hooks';

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

	const { ref, inViewport } = createImpressionObserver();
	if (inViewport && mergedTrack.impression) {
		if (result.type === 'product') {
			controller?.track.product.impression(result as Product);
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
			className={classnames('ss__result-tracker', `ss__${controller?.type}-result-tracker`, className)}
			onClick={(e: any) => {
				if (result.type === 'product' && mergedTrack.click) {
					controller?.track.product.click(e, result as Product);
				}
			}}
			ref={ref as Ref<HTMLDivElement>}
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
