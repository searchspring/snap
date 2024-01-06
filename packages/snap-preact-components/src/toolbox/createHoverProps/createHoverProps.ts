export const createHoverProps = (callback?: () => void, options: { delay?: number; focusElem?: boolean } = { delay: 333, focusElem: true }) => {
	let delayTimeout: number;

	return {
		onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			clearTimeout(delayTimeout);
			delayTimeout = window.setTimeout(() => {
				options.focusElem && (e.target as HTMLElement).focus();
				callback && callback();
			}, options.delay || 333);
		},
		onMouseLeave: () => {
			clearTimeout(delayTimeout);
		},
	};
};
