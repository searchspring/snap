import { Fragment, h } from 'preact';
import { useRef } from 'preact/hooks';
import { observer } from 'mobx-react-lite';
import { Theme, useTheme } from '../../../providers';
import { useIntersection } from '../../../hooks';
import type { RecommendationController } from '@searchspring/snap-controller';
import { ComponentProps } from '../../../types';
import type { Product } from '@searchspring/snap-store-mobx';

export const RecommendationProfileTracker = observer((properties: RecommendationProfileTrackerProps) => {
	const globalTheme: Theme = useTheme();

	const props: RecommendationProfileTrackerProps = {
		// default props
		// global theme
		...globalTheme?.components?.RecommendationProfileTracker,
		// props
		...properties,
		...properties.theme?.components?.RecommendationProfileTracker,
	};

	const { children, controller, results } = props;

	// do impression tracking for "profile"
	const componentRef = useRef(null);

	const inViewport = useIntersection(componentRef, '0px');

	if (inViewport) {
		controller.track.impression();
	}

	// takes care of rendering for results and profile
	controller.track.render(results);

	return children.length ? (
		<div onClick={(e) => controller.track.click(e)} ref={componentRef}>
			{children}
		</div>
	) : (
		<Fragment></Fragment>
	);
});

export interface RecommendationProfileTrackerProps extends ComponentProps {
	children: any;
	controller: RecommendationController;
	results?: Product[];
}
