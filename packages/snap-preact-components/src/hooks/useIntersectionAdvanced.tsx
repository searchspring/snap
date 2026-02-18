import { useState, useEffect, useRef, useCallback, MutableRef } from 'preact/hooks';

export interface UseIntersectionOptions {
	rootMargin?: string;
	fireOnce?: boolean;
	threshold?: number | number[];
	minVisibleTime?: number; // Minimum time in ms the element must be visible
}

const VISIBILITY_POLL_INTERVAL = 250;
export const useIntersectionAdvanced = (
	ref: MutableRef<HTMLElement | null>,
	options: UseIntersectionOptions = {}
): { inViewport: boolean; updateRef: (el: HTMLElement | null) => void } => {
	const { rootMargin = '0px', fireOnce = false, threshold = 0, minVisibleTime = 0 } = options;
	// State and setter for storing whether element is visible
	const [isIntersecting, setIntersecting] = useState<boolean>(false);

	// Timer reference to track visibility duration
	const visibleTimerRef = useRef<number | null>(null);
	// Track when the element started being visible
	const visibleStartRef = useRef<number | null>(null);

	const [counter, setCounter] = useState(0);
	const updateRef = useCallback((el: HTMLElement | null) => {
		ref.current = el;
		setCounter((c) => c + 1);
	}, []);

	useEffect(() => {
		setIntersecting(false);
		let observer: IntersectionObserver | null = null;
		let pollInterval: number | null = null;

		if (!ref.current) return;

		const clearPoll = () => {
			if (pollInterval) {
				window.clearInterval(pollInterval);
				pollInterval = null;
			}
		};

		const handleVisible = () => {
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
		};

		const handleHidden = () => {
			// Element is no longer visible
			if (visibleTimerRef.current) {
				// Clear the timer if element goes out of view before minimum time
				window.clearTimeout(visibleTimerRef.current);
			}

			visibleTimerRef.current = null;
			visibleStartRef.current = null;

			setIntersecting(false);
		};

		observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					if (ref.current && elementIsVisible(ref.current)) {
						clearPoll();
						handleVisible();
					} else {
						// Element is intersecting but not visible (e.g. opacity 0)
						// Treat as hidden but start polling for visibility
						handleHidden();

						if (!pollInterval) {
							pollInterval = window.setInterval(() => {
								if (!ref.current) {
									clearPoll();
									return;
								}
								if (elementIsVisible(ref.current)) {
									clearPoll();
									handleVisible();
								}
							}, VISIBILITY_POLL_INTERVAL);
						}
					}
				} else {
					// Element is no longer intersecting
					clearPoll();
					handleHidden();
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
			clearPoll();
			if (visibleTimerRef.current) {
				window.clearTimeout(visibleTimerRef.current);
			}

			// Clean up observer
			if (observer && ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [ref, counter]);

	return { inViewport: isIntersecting, updateRef };
};

function elementIsVisible(el: HTMLElement): boolean {
	if (el && 'checkVisibility' in el) {
		return el.checkVisibility({ contentVisibilityAuto: true, opacityProperty: true, visibilityProperty: true } as any);
	}
	return true;
}
