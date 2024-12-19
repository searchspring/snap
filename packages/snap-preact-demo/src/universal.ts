import 'core-js/features/promise';
const promises = [];
if (!('fetch' in window)) {
	// @ts-ignore - types not important
	promises.push(import('whatwg-fetch') as any);
}
if (!('Symbol' in window) || !('flatMap' in Array.prototype) || !('includes' in Array.prototype)) {
	// @ts-ignore - types not important
	promises.push(import('core-js/stable') as any);
}
Promise.all(promises).then(() => {
	// @ts-ignore - types not important
	window.searchspring = window.searchspring || {};
	// @ts-ignore - types not important
	window.searchspring.build = 'universal';

	import('./index');
});
