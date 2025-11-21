import { useState, useEffect, useRef, MutableRef } from 'preact/hooks';

export interface UseIntersectionOptions {
	rootMargin?: string;
	fireOnce?: boolean;
	threshold?: number | number[];
	minVisibleTime?: number; // Minimum time in ms the element must be visible
	resetKey?: string;
}

const MAX_PARENT_DEPTH = 20;

// Shared parent observer system to avoid duplicate observations
const parentObserverCallbacks = new Map<Element, Set<() => void>>();
let sharedParentObserver: MutationObserver | null = null;

function getSharedParentObserver(): MutationObserver {
	if (!sharedParentObserver) {
		sharedParentObserver = new MutationObserver((mutations) => {
			// Call callbacks for all affected elements
			for (const mutation of mutations) {
				const callbacks = parentObserverCallbacks.get(mutation.target as Element);
				callbacks?.forEach((callback) => callback());
			}
		});
	}
	return sharedParentObserver;
}

function observeParents(element: HTMLElement, callback: () => void): () => void {
	const observer = getSharedParentObserver();
	const observedParents: Element[] = [];

	let parent = element.parentElement;
	let depth = 0;
	while (parent && depth < MAX_PARENT_DEPTH) {
		let callbacks = parentObserverCallbacks.get(parent);

		if (!callbacks) {
			callbacks = new Set();
			parentObserverCallbacks.set(parent, callbacks);
			observer.observe(parent, {
				attributes: true,
				attributeFilter: ['style', 'class', 'hidden'],
				attributeOldValue: false,
			});
		}

		callbacks.add(callback);
		observedParents.push(parent);
		parent = parent.parentElement;
		depth++;
	}

	return () => {
		for (const parent of observedParents) {
			const callbacks = parentObserverCallbacks.get(parent);
			if (callbacks) {
				callbacks.delete(callback);
				if (callbacks.size === 0) {
					parentObserverCallbacks.delete(parent);
				}
			}
		}
	};
}

export const useIntersectionAdvanced = (ref: MutableRef<HTMLElement | null>, options: UseIntersectionOptions = {}): boolean => {
	const { rootMargin = '0px', fireOnce = false, threshold = 0, minVisibleTime = 0, resetKey } = options;
	const [isIntersecting, setIntersecting] = useState<boolean>(false);
	const visibleTimerRef = useRef<number | null>(null);
	const lastResetKeyRef = useRef<string | undefined>(resetKey);

	// Reset state when resetKey changes
	useEffect(() => {
		if (resetKey !== lastResetKeyRef.current) {
			setIntersecting(false);
			if (visibleTimerRef.current) {
				window.clearTimeout(visibleTimerRef.current);
				visibleTimerRef.current = null;
			}
			lastResetKeyRef.current = resetKey;
		}
	}, [resetKey]);

	useEffect(() => {
		setIntersecting(false);
		let observer: IntersectionObserver | null = null;
		let mutationObserver: MutationObserver | null = null;
		let cleanupParentObserver: (() => void) | null = null;
		let isIntersectingViewport = false;

		if (!ref.current) return;

		const cleanupObservers = () => {
			if (!fireOnce) {
				return;
			}

			if (ref.current && observer) {
				observer.unobserve(ref.current);
			}
			if (mutationObserver) {
				mutationObserver.disconnect();
			}
			if (cleanupParentObserver) {
				cleanupParentObserver();
			}
		};

		const clearTimer = () => {
			if (visibleTimerRef.current) {
				window.clearTimeout(visibleTimerRef.current);
				visibleTimerRef.current = null;
			}
		};

		const handleVisible = () => {
			if (minVisibleTime > 0) {
				clearTimer();
				visibleTimerRef.current = window.setTimeout(() => {
					setIntersecting(true);
					cleanupObservers();
				}, minVisibleTime);
			} else {
				setIntersecting(true);
				cleanupObservers();
			}
		};

		const handleHidden = () => {
			clearTimer();
			setIntersecting(false);
		};

		const checkVisibility = () => {
			if (!ref.current) return;

			const isVisible = elementIsVisible(ref.current);
			const shouldBeVisible = isIntersectingViewport && isVisible;
			const isCurrentlyVisible = visibleTimerRef.current !== null || isIntersecting;

			if (shouldBeVisible && !isCurrentlyVisible) {
				handleVisible();
			} else if (!shouldBeVisible && isCurrentlyVisible) {
				handleHidden();
			}
		};

		mutationObserver = new MutationObserver(checkVisibility);
		observer = new IntersectionObserver(
			([entry]) => {
				isIntersectingViewport = entry.isIntersecting;
				checkVisibility();
			},
			{ rootMargin, threshold }
		);

		if (ref.current) {
			observer.observe(ref.current);
			mutationObserver.observe(ref.current, {
				attributes: true,
				attributeFilter: ['style', 'class', 'hidden', 'aria-hidden'],
				attributeOldValue: false,
			});
			cleanupParentObserver = observeParents(ref.current, checkVisibility);
		}

		return () => {
			setIntersecting(false);
			clearTimer();
			if (observer && ref.current) {
				observer.unobserve(ref.current);
			}
			if (mutationObserver) {
				mutationObserver.disconnect();
			}
			if (cleanupParentObserver) {
				cleanupParentObserver();
			}
		};
	}, [ref, resetKey]);

	return isIntersecting;
};

function elementIsVisible(el: HTMLElement): boolean {
	// Check if element is connected to the DOM
	if (!el.isConnected) {
		return false;
	}

	// Check for explicit hidden attributes
	if (el.hidden || el.getAttribute('aria-hidden') === 'true') {
		return false;
	}

	// Check for explicit hidden css properties
	const computedStyle = getComputedStyle(el);
	if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || parseFloat(computedStyle.opacity) === 0) {
		return false;
	}

	// Check parent elements for opacity: 0
	let parent = el.parentElement;
	let depth = 0;
	while (parent && depth < MAX_PARENT_DEPTH) {
		const parentStyle = getComputedStyle(parent);
		if (parseFloat(parentStyle.opacity) === 0) {
			return false;
		}
		parent = parent.parentElement;
		depth++;
	}

	// Assume visibile
	return true;
}
