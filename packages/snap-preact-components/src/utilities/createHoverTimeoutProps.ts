export const createHoverTimeoutProps = (callback?: () => void, options: { delay: number } = { delay: 333 }) => {
	let delayTimeout: number;

	return {
		onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
			clearTimeout(delayTimeout);
			delayTimeout = window.setTimeout(() => {
				(e.target as HTMLAnchorElement).focus();
				callback && callback();
			}, options.delay);
		},
		onMouseLeave: () => {
			clearTimeout(delayTimeout);
		},
	};
};
