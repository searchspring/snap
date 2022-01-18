import 'core-js/features/promise';
export function polyfills(): Promise<void> {
	return new Promise(function (resolve) {
		// eslint-disable-next-line no-var
		var promises = [];

		if (!('fetch' in window)) {
			promises.push(import('whatwg-fetch'));
		}
		if (!('IntersectionObserver' in window)) {
			promises.push(import('intersection-observer'));
		}
		if (!('Symbol' in window) || !('flatMap' in Array.prototype) || !('includes' in Array.prototype)) {
			promises.push(import('core-js/stable'));
		}

		Promise.all(promises).then(function () {
			resolve();
		});
	});
}
