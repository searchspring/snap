import { h, ComponentType, FunctionComponent } from 'preact';
import type { Banner, MerchandisingContentBanner, Product } from '@searchspring/snap-store-mobx';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import type { ContentType, BannerContent } from '@searchspring/snap-store-mobx';
import { createImpressionObserver } from '../utilities';
import { useEffect, useCallback, useRef } from 'preact/hooks';

export const TRACKING_ATTRIBUTE = 'sstracking';
interface WithTrackingProps {
	controller?: SearchController | AutocompleteController | RecommendationController;
	result?: Product;
	banner?: Banner;
	type?: ContentType;
	content?: BannerContent;
	[key: string]: any;
}

export function withTracking<Props extends WithTrackingProps>(WrappedComponent: ComponentType<Props>) {
	const WithTracking: FunctionComponent<Props> = (props) => {
		const { controller, result, banner, type, content, ...restProps } = props;

		if (props.trackingRef) {
			// case where withTracking may get used more than once
			return <WrappedComponent {...props} />;
		}

		if (!controller && (!type || !content)) {
			console.warn('Warning: No controller provided to withTracking', props);
		}

		if (!result && !banner && (!type || !content)) {
			console.warn('Warning: No result or banner provided to withTracking');
		}

		const { ref, inViewport, updateRef } = createImpressionObserver();

		// Reset impression tracking when the result identity changes (e.g. new search context).
		// Each Product/Banner gets a new responseId per search response, so this naturally
		// resets when query/sort/filters change without needing global controller state.
		// Calling updateRef(ref.current) re-observes the same element with fresh state.
		const resultIdentity = (result || banner || (type && content?.[type]?.[0]))?.responseId;
		const prevIdentityRef = useRef(resultIdentity);

		// Tracks whether we're waiting for the observer to reset after an identity change.
		// Set synchronously during render to block impressions immediately when identity
		// changes, preventing a stale inViewport=true from firing before the observer resets.
		const awaitingReobservationRef = useRef(false);
		if (prevIdentityRef.current !== resultIdentity) {
			awaitingReobservationRef.current = true;
		}

		useEffect(() => {
			if (prevIdentityRef.current !== resultIdentity) {
				prevIdentityRef.current = resultIdentity;
				updateRef(ref.current);
			}
		}, [resultIdentity, updateRef]);

		useEffect(() => {
			if (awaitingReobservationRef.current && !inViewport) {
				awaitingReobservationRef.current = false;
			}
		}, [inViewport]);

		const isBannerTracking = type && content && !result && ['search', 'autocomplete'].includes(controller?.type || '');

		if (inViewport && !awaitingReobservationRef.current) {
			// TODO: add support for disabling tracking events via config like in ResultTracker
			if (isBannerTracking) {
				(controller as SearchController | AutocompleteController)?.track.banner.impression(content[type]![0] as MerchandisingContentBanner);
			} else if (!result?.bundleSeed) {
				controller?.track.product.impression((result || banner)!);
			}
		}

		const handleClick = useCallback(
			(e: MouseEvent) => {
				if (isBannerTracking) {
					(controller as SearchController | AutocompleteController)?.track.banner.click(e, content[type]![0] as MerchandisingContentBanner);
				} else {
					controller?.track.product.click(e, (result || banner)!);
				}
			},
			[controller, result, banner, type, content]
		);

		useEffect(() => {
			const currentRef = ref.current;
			if (currentRef) {
				currentRef.setAttribute(TRACKING_ATTRIBUTE, 'true');
				currentRef.addEventListener('click', handleClick, true); // Use capture phase
				return () => {
					currentRef.removeEventListener('click', handleClick, true);
				};
			}
		}, [ref, handleClick]);
		const trackingProps = {
			...restProps,
			controller,
			result,
			banner,
			type,
			content,
			trackingRef: useCallback(
				(el: HTMLElement | null) => {
					if (!ref.current) {
						updateRef(el);
					}
				},
				[ref, updateRef]
			),
		};

		return <WrappedComponent {...(trackingProps as Props)} />;
	};
	return WithTracking;
}
