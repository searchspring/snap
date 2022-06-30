export const polyfills: Promise<void> = new Promise((resolve) => {
	const promises = [];

	if (!('IntersectionObserver' in window)) {
		promises.push(import('intersection-observer'!));
	}

	Promise.all(promises).then(() => {
		resolve();
	});
});
