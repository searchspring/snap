import { type Ref, useRef } from 'preact/hooks';
import { useIntersectionAdvanced, UseIntersectionOptions } from '../hooks';

const IMPRESSION_VISIBILITY_THRESHOLD = 0.7;
const IMPRESSION_MIN_VISIBLE_TIME = 1000;
export function createImpressionObserver(options?: UseIntersectionOptions): {
	ref: Ref<HTMLElement | null>;
	inViewport: boolean;
} {
	const ref = useRef<HTMLElement>(null);
	const inViewport = useIntersectionAdvanced(ref, {
		...options,
		fireOnce: true,
		threshold: IMPRESSION_VISIBILITY_THRESHOLD,
		minVisibleTime: IMPRESSION_MIN_VISIBLE_TIME,
	});
	return {
		ref,
		inViewport,
	};
}
