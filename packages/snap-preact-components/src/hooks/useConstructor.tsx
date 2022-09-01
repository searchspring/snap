import { useRef } from 'preact/hooks';

export const useConstructor = (callBack = () => {}) => {
	const hasBeenCalled = useRef(false);
	if (hasBeenCalled.current) return;
	callBack();
	hasBeenCalled.current = true;
};
