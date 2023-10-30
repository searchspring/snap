/** @jsx jsx */
import { h } from 'preact';
import { jsx, css } from '@emotion/react';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
// import { useIntersection } from '../../../hooks';
import { ComponentProps, StylingCSS } from '../../../types';
import type { Product } from '@searchspring/snap-store-mobx';
import classnames from 'classnames';
import { SearchController } from '@searchspring/snap-controller';

const CSS = {
	ResultTracker: ({}: Partial<SearchResultTrackerProps>) => css({}),
};

export const SearchResultTracker = observer((properties: SearchResultTrackerProps): JSX.Element => {
	const { children, result, controller, className, disableStyles, style, styleScript } = properties;

	const resultRef = useRef(null);

	// FUTURE
	// const resultInViewport = useIntersection(resultRef, '0px');
	// if (resultInViewport) {
	// intersection observer can trigger in any random order,
	// so we need to check if profile impression has been sent and send if not.
	// if (!controller.tracker.events.impression) {
	// controller.tracker.track.product.view();
	// console.log('track view')
	// }
	// }

	const styling: { css?: StylingCSS } = {};
	const stylingProps = properties;

	if (styleScript && !disableStyles) {
		styling.css = [styleScript(stylingProps), style];
	} else if (!disableStyles) {
		styling.css = [CSS.ResultTracker(stylingProps), style];
	} else if (style) {
		styling.css = [style];
	}

	return (
		<div
			className={classnames('ss__result-tracker', className)}
			onClick={(e: any) => controller.track.product.click(e, result)}
			ref={resultRef}
			{...styling}
		>
			{children}
		</div>
	);
});

export interface SearchResultTrackerProps extends ComponentProps {
	children?: any;
	result: Product;
	controller: SearchController;
}
