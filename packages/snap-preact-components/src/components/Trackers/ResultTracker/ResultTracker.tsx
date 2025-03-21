/** @jsx jsx */
import { h } from 'preact';
import { jsx, css } from '@emotion/react';
import { useRef, useEffect } from 'preact/hooks';
import { observer } from 'mobx-react';
import { Theme, useTheme } from '../../../providers';
import { useIntersection } from '../../../hooks';
import type { Controllers } from '@searchspring/snap-controller';
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
	const resultInViewport = useIntersection(resultRef, '0px');

	useEffect(() => {
		if (mergedTrack.render) {
			if (result.type === 'product') {
				// controller?.track?.product?.render(result);
			}
		}
	}, []);

	if (resultInViewport && mergedTrack.impression) {
		if (result.type === 'product') {
			// controller?.track?.product?.impression(result);
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
			className={classnames('ss__result-tracker', `ss__${controller.type}-result-tracker`, className)}
			// onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			// 	if (mergedTrack.click) {
			// 		if (result.type === 'product') {
			// 			controller?.track?.product?.click(e, result);
			// 		}
			// 	}
			// }}
			ref={resultRef}
			{...styling}
		>
			{children}
		</div>
	);
});

export interface ResultTrackerProps extends ComponentProps {
	children: any;
	result: Product | Banner;
	controller: Controllers;
	track?: {
		render?: boolean;
		impression?: boolean;
		click?: boolean;
	};
}
