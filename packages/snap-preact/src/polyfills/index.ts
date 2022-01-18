export const polyfills = async (): Promise<void> => {
	return new Promise((resolve) => {
		const promises = [];

		if (!('fetch' in window)) {
			promises.push(import('whatwg-fetch'));
		}
		if (!('IntersectionObserver' in window)) {
			promises.push(import('intersection-observer'));
		}
		if (!('Symbol' in window) || !('flatMap' in Array.prototype) || !('includes' in Array.prototype)) {
			promises.push(import('core-js/stable'));
		}

		Promise.all(promises).then(() => {
			resolve();
		});
	});
};
