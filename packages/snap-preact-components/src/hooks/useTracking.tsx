import { Product } from '@searchspring/snap-store-mobx';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import { useEffect, type Ref } from 'preact/hooks';
import { createImpressionObserver } from '../utilities';

interface UseTrackingProps {
	controller: SearchController | AutocompleteController | RecommendationController;
	result: Product;
}

export function useTracking({ controller, result }: UseTrackingProps): { trackingRef: Ref<HTMLElement | null> } {
	if (!controller) {
		console.warn('Warning: No controller provided to useTracking');
	}

	if (!result) {
		console.warn('Warning: No result provided to useTracking');
	}

	const { ref, inViewport } = createImpressionObserver();
	useEffect(() => {
		if (inViewport) {
			// TODO: add support for disabling tracking events via config like in ResultTracker
			if (result.type === 'product') {
				controller?.track.product.impression(result);
			} else {
				// track banner in future
			}
		}
	}, [inViewport]);

	useEffect(() => {
		const currentRef = ref.current;
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

	return { trackingRef: ref };
}
