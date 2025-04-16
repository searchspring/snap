import { Product } from '@searchspring/snap-store-mobx';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import { useIntersectionAdvanced } from './useIntersectionAdvanced';
import { useRef, useEffect, MutableRef } from 'preact/hooks';

interface UseTrackingProps {
	controller: SearchController | AutocompleteController | RecommendationController;
	result: Product;
}

export function useTracking({ controller, result }: UseTrackingProps): { trackingRef: MutableRef<HTMLElement | null> } {
	if (!controller) {
		console.warn('Warning: No controller provided to useTracking');
	}

	if (!result) {
		console.warn('Warning: No result provided to useTracking');
	}

	const trackingRef = useRef<HTMLElement | null>(null);
	const resultInViewport = useIntersectionAdvanced(trackingRef, {
		fireOnce: true,
		threshold: 0.75,
		minVisibleTime: 1000,
	});

	useEffect(() => {
		if (resultInViewport) {
			// TODO: add support for disabling tracking events via config like in ResultTracker
			if (result.type === 'product') {
				controller?.track.product.impression(result);
			} else {
				// track banner in future
			}
		}
	}, [resultInViewport]);

	useEffect(() => {
		const currentRef = trackingRef.current;
		if (currentRef) {
			currentRef.setAttribute('sstracking', 'true');

			const handleClick = (e: MouseEvent) => {
				controller?.track.product.click(e, result);
			};

			currentRef.addEventListener('click', handleClick);

			return () => {
				currentRef.removeEventListener('click', handleClick);
			};
		}
	}, [result]);

	return { trackingRef };
}
