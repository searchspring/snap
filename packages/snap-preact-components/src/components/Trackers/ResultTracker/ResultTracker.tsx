/** @jsx jsx */
import { h } from 'preact';
import { jsx, css } from '@emotion/react';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
// import { useIntersection } from '../../../hooks';
import { ComponentProps, StylingCSS } from '../../../types';
import type { Product } from '@searchspring/snap-store-mobx';
import classnames from 'classnames';
import { AbstractController } from '@searchspring/snap-controller';
import { ProductClickEvent } from '@searchspring/snap-tracker';

const CSS = {
	ResultTracker: ({}: Partial<ResultTrackerProps>) => css({}),
};

export const ResultTracker = observer((properties: ResultTrackerProps): JSX.Element => {
	const { children, result, controller, className, disableStyles, style, styleScript } = properties;

	const resultRef = useRef(null);

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

	const { intellisuggestData, intellisuggestSignature } = result.attributes;
	const data: ProductClickEvent = {
		intellisuggestData: intellisuggestData as string,
		intellisuggestSignature: intellisuggestSignature as string,
		href: result.mappings.core?.url,
	};

	return (
		<div
			className={classnames('ss__result-tracker', className)}
			onClick={() => controller.tracker.track.product.click(data)}
			ref={resultRef}
			{...styling}
		>
			{children}
		</div>
	);
});

export interface ResultTrackerProps extends ComponentProps {
	children?: any;
	result: Product;
	controller: AbstractController;
}
