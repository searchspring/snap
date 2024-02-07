import { useEffect, useRef } from 'preact/hooks';

export const useFuncDebounce = (func: () => any, delay: number) => {
	// Use a ref to store the function
	const funcRef = useRef(func);
	funcRef.current = func;

	useEffect(() => {
		const handler = setTimeout(() => {
			funcRef.current();
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [func, delay]); // re-call effect if func or delay changes

	// No return value because we're debouncing a function, not a value
};
