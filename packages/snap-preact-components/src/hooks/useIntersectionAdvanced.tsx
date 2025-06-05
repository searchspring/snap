import { useState, useEffect, useRef, MutableRef } from 'preact/hooks';

interface UseIntersectionOptions {
	rootMargin?: string;
	fireOnce?: boolean;
	threshold?: number | number[];
	minVisibleTime?: number; // Minimum time in ms the element must be visible
	additionalEffectKeys?: unknown[];
}

export const useIntersectionAdvanced = (ref: MutableRef<HTMLElement | null>, options: UseIntersectionOptions = {}): boolean => {
	const { rootMargin = '0px', fireOnce = false, threshold = 0, minVisibleTime = 0 } = options;
	// State and setter for storing whether element is visible
	const [isIntersecting, setIntersecting] = useState<boolean>(false);

	// Timer reference to track visibility duration
	const visibleTimerRef = useRef<number | null>(null);
	// Track when the element started being visible
	const visibleStartRef = useRef<number | null>(null);

	useEffect(() => {
		setIntersecting(false);
		let observer: IntersectionObserver | null = null;

		if (!ref.current) return;

		observer = new IntersectionObserver(
			([entry]) => {
				// If element becomes visible
				if (entry.isIntersecting) {
					// Start tracking visibility time if minVisibleTime is set
					if (minVisibleTime > 0) {
						visibleStartRef.current = Date.now();
						// Clear any existing timer
						if (visibleTimerRef.current) {
							window.clearTimeout(visibleTimerRef.current);
						}

						// Set up a timer for the minimum visibility duration
						visibleTimerRef.current = window.setTimeout(() => {
							setIntersecting(true);

							if (fireOnce && ref.current && observer) {
								observer.unobserve(ref.current);
							}
						}, minVisibleTime);
					} else {
						// If no minimum time required, update state immediately
						setIntersecting(true);

						if (fireOnce && ref.current && observer) {
							observer.unobserve(ref.current);
						}
					}
				} else {
					// Element is no longer visible
					if (visibleTimerRef.current) {
						// Clear the timer if element goes out of view before minimum time
						window.clearTimeout(visibleTimerRef.current);
					}

					visibleTimerRef.current = null;
					visibleStartRef.current = null;

					setIntersecting(false);
				}
			},
			{
				rootMargin,
				threshold,
			}
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			setIntersecting(false);
			if (visibleTimerRef.current) {
				window.clearTimeout(visibleTimerRef.current);
			}

			// Clean up observer
			if (observer && ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [ref.current, ...(options?.additionalEffectKeys || [])]);

	return isIntersecting;
};
