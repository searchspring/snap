import { useRef } from 'preact/hooks';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const useConstructor = (callBack = () => {}) => {
	const hasBeenCalled = useRef(false);
	if (hasBeenCalled.current) return;
	callBack();
	hasBeenCalled.current = true;
};
