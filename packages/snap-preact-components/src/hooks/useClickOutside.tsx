import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

export function useClickOutside<T extends HTMLElement>(callback: (e: Event) => void): preact.RefObject<T> {
	const callbackRef: preact.RefObject<CallableFunction> = useRef();
	const innerRef: preact.RefObject<T> = useRef();

	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		document.addEventListener('click', handleClick);

		return () => document.removeEventListener('click', handleClick);

		function handleClick(e) {
			if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target)) callbackRef.current(e);
		}
	}, []);

	return innerRef;
}
