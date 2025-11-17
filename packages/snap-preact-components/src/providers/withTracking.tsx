import { h, ComponentType, FunctionComponent } from 'preact';
import type { Product } from '@searchspring/snap-store-mobx';
import type { SearchController, AutocompleteController, RecommendationController } from '@searchspring/snap-controller';
import { createImpressionObserver } from '../utilities';
import { useCallback } from 'preact/hooks';

interface WithTrackingProps {
	controller?: SearchController | AutocompleteController | RecommendationController;
	result?: Product;
	[key: string]: any;
}

export function withTracking<Props extends WithTrackingProps>(WrappedComponent: ComponentType<Props>) {
	const WithTracking: FunctionComponent<Props> = (props) => {
		const { controller, result, ...restProps } = props;

		if (!controller) {
			console.warn('Warning: No controller provided to withTracking');
		}

		if (!result) {
			console.warn('Warning: No result provided to withTracking');
		}

		let resetKey;
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

		const { ref, inViewport } = createImpressionObserver({ resetKey });

		if (inViewport) {
			// TODO: add support for disabling tracking events via config like in ResultTracker
			if (result?.type === 'product' && !result.bundleSeed) {
				controller?.track.product.impression(result as Product);
			} else {
				// track banner in future
			}
		}

		const currentRef = ref.current;
		if (currentRef) {
			const handleClick = useCallback((e: MouseEvent) => {
				controller?.track.product.click(e, result as Product);
			}, []);
			currentRef.setAttribute('sstracking', 'true');
			currentRef.removeEventListener('click', handleClick);
			currentRef.addEventListener('click', handleClick);
		}

		const trackingProps = {
			...restProps,
			controller,
			result,
			trackingRef: ref,
		};

		return <WrappedComponent {...(trackingProps as Props)} />;
	};
	return WithTracking;
}
