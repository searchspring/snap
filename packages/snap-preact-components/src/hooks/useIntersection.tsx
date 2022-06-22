import { RefObject } from 'preact';
import { useState, useEffect, MutableRef } from 'preact/hooks';

export const useIntersection = (ref: MutableRef<HTMLElement | null>, rootMargin = '0px', fireOnce = false) => {
	// State and setter for storing whether element is visible
	const [isIntersecting, setIntersecting] = useState(false);
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				// Update our state when observer callback fires
				setIntersecting(entry.isIntersecting);

				if (fireOnce && entry.isIntersecting) {
					observer.unobserve((ref as MutableRef<HTMLElement>).current);
				}
			},
			{
				rootMargin,
			}
		);
		if (ref.current) {
			observer.observe(ref.current);
		}
		return () => {
			observer.unobserve((ref as MutableRef<HTMLElement>).current);
		};
	}, []); // Empty array ensures that effect is only run on mount and unmount
	return isIntersecting;
};
