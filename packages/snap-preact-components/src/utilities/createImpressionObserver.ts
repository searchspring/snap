import { type Ref, useRef } from 'preact/hooks';
import { useIntersectionAdvanced } from '../hooks';

export function createImpressionObserver(): {
	ref: Ref<HTMLElement | null>;
	inViewport: boolean;
} {
	const ref = useRef<HTMLElement>(null);
	const inViewport = useIntersectionAdvanced(ref, {
		fireOnce: true,
		threshold: 0.75,
		minVisibleTime: 1000,
	});
	return {
		ref,
		inViewport,
	};
}
