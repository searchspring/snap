import { h, ComponentType, FunctionComponent } from 'preact';
import type { Banner, MerchandisingContentBanner, Product } from '@searchspring/snap-store-mobx';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import type { ContentType, BannerContent } from '@searchspring/snap-store-mobx';
import { useIntersectionAdvanced } from '../hooks';
import { useEffect, useCallback, useState, useRef } from 'preact/hooks';

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
		const [isMounted, setIsMounted] = useState(false);

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

		let resetKey: string | undefined;
		if (controller?.type === 'search' || controller?.type === 'autocomplete') {
			const urlManager = (controller as SearchController | AutocompleteController).urlManager;
			resetKey = JSON.stringify({
				q: urlManager.state.query,
				p: urlManager.state.page,
				ps: urlManager.state.pageSize,
				s: urlManager.state.sort,
				f: urlManager.state.filter,
			});
		} else if (controller?.type === 'recommendation') {
			// For recommendations, use a combination of tag and other relevant state
			const recStore = (controller as RecommendationController).store;
			resetKey = JSON.stringify({
				tag: recStore.profile?.tag,
				ids: recStore.results.map((result) => result.id).join(','),
			});
		}

		if (resetKey) {
			resetKey += `-${isMounted}`;
		} else {
			resetKey = `${isMounted}`;
		}

		const ref = useRef<HTMLElement>(null);

		if (isMounted) {
			const inViewport = useIntersectionAdvanced(ref, {
				resetKey,
				fireOnce: false,
				threshold: 0.7,
				minVisibleTime: 1000,
			});

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
		}

		const setRef = useCallback(
			(node: any) => {
				if (ref) {
					// @ts-ignore - ref.current is read-only but we need to set it here
					ref.current = node;
					if (node) {
						setIsMounted(true);
					}
				}
			},
			[ref]
		);

		const handleClick = useCallback(
			(e: MouseEvent) => {
				if (type && content && !result && ['search', 'autocomplete'].includes(controller?.type || '')) {
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
		}, [ref, handleClick, isMounted]);
		const trackingProps = {
			...restProps,
			controller,
			result,
			banner,
			type,
			content,
			trackingRef: setRef,
		};

		return <WrappedComponent {...(trackingProps as Props)} />;
	};
	return WithTracking;
}
