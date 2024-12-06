import { Fragment, h } from 'preact';
import { jsx, css } from '@emotion/react';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
// import { useIntersection } from '../../../hooks';
import { ComponentProps, StyleScript } from '../../../types';
import type { Product } from '@searchspring/snap-store-mobx';
import classnames from 'classnames';
import { SearchController } from '@searchspring/snap-controller';
import { mergeStyles } from '../../../utilities';

const defaultStyles: StyleScript<SearchResultTrackerProps> = () => {
	return css({});
};

export const SearchResultTracker = observer((properties: SearchResultTrackerProps): JSX.Element => {
	const { children, result, controller, className } = properties;

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

	const styling = mergeStyles<SearchResultTrackerProps>(properties, defaultStyles);

	if (!controller) {
		console.error('No SearchController was passed to SearchResultTracker.');
	}

	return controller ? (
		<div
			className={classnames('ss__result-tracker', className)}
			onClick={(e: any) => controller.track.product.click(e, result)}
			ref={resultRef}
			{...styling}
		>
			{children}
		</div>
	) : (
		<Fragment>{children}</Fragment>
	);
});

export interface SearchResultTrackerProps extends ComponentProps {
	children?: any;
	result: Product;
	controller: SearchController;
}
