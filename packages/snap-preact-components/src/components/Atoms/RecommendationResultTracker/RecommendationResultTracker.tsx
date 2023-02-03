import { Fragment, h } from 'preact';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme } from '../../../providers';
import { useIntersection } from '../../../hooks';
import type { RecommendationController } from '@searchspring/snap-controller';
import { ComponentProps } from '../../../types';
import type { Product } from '@searchspring/snap-store-mobx';

export const RecommendationResultTracker = observer((properties: RecommendationResultTrackerProps) => {
	const globalTheme: Theme = useTheme();

	const props: RecommendationResultTrackerProps = {
		// default props
		// global theme
		...globalTheme?.components?.RecommendationResultTracker,
		// props
		...properties,
		...properties.theme?.components?.RecommendationResultTracker,
	};

	const { children, result, controller } = props;

	const resultRef = useRef(null);
	const resultInViewport = useIntersection(resultRef, '0px');

	if (resultInViewport) {
		if (!controller.events.impression) {
			controller.track.impression();
		}
		controller.track.product.impression(result);
	}

	return (
		<div onClick={(e) => controller.track.product.click(e, result)} ref={resultRef}>
			{children}
		</div>
	);
});

export interface RecommendationResultTrackerProps extends ComponentProps {
	children: any;
	result: Product;
	controller: RecommendationController;
}
