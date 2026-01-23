import { Banner, BannerContent, ContentType, MerchandisingContentBanner, Product } from '@searchspring/snap-store-mobx';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import { useEffect, type Ref } from 'preact/hooks';
import { createImpressionObserver } from '../utilities';
import { TRACKING_ATTRIBUTE } from '../providers/withTracking';

interface UseTrackingProps {
	controller: SearchController | AutocompleteController | RecommendationController;
	result: Product;
	banner?: Banner;
	type?: ContentType;
	content?: BannerContent;
}

export function useTracking({ controller, result, banner, type, content }: UseTrackingProps): { trackingRef: Ref<HTMLElement | null> } {
	if (!controller) {
		console.warn('Warning: No controller provided to useTracking');
	}

	if (!result) {
		console.warn('Warning: No result provided to useTracking');
	}
	if (!result && !banner && (!type || !content)) {
		console.warn('Warning: No result or banner provided to withTracking');
	}

	const { ref, inViewport } = createImpressionObserver();
	useEffect(() => {
		if (inViewport) {
			// TODO: add support for disabling tracking events via config like in ResultTracker
			if (type && content && !result && ['search', 'autocomplete'].includes(controller?.type || '')) {
				(controller as SearchController | AutocompleteController)?.track.banner.impression(content[type]![0] as MerchandisingContentBanner);
			} else if (!result?.bundleSeed) {
				controller?.track.product.impression((result || banner)!);
			}
		}
	}, [inViewport]);

	useEffect(() => {
		const currentRef = ref.current;
		if (currentRef) {
			const handleClick = (e: MouseEvent) => {
				if (type && content && !result && ['search', 'autocomplete'].includes(controller?.type || '')) {
					(controller as SearchController | AutocompleteController)?.track.banner.click(e, content[type]![0] as MerchandisingContentBanner);
				} else {
					controller?.track.product.click(e, (result || banner)!);
				}
			};

			currentRef.setAttribute(TRACKING_ATTRIBUTE, 'true');
			currentRef.addEventListener('click', handleClick);
			return () => {
				currentRef.removeEventListener('click', handleClick);
			};
		}
	}, [controller, result, banner, type, content]);

	return { trackingRef: ref };
}
