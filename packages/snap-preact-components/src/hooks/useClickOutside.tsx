import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

export function useClickOutside<T extends HTMLElement>(callback: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void): preact.RefObject<T> {
	// @ts-ignore
	const callbackRef: preact.RefObject<CallableFunction> = useRef();
	// @ts-ignore
	const innerRef: preact.RefObject<T> = useRef();

	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		document.addEventListener('click', handleClick);

		return () => document.removeEventListener('click', handleClick);

		function handleClick(e: MouseEvent) {
			if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target as HTMLElement)) callbackRef.current(e);
		}
	}, []);

	return innerRef;
}
