import 'core-js/features/promise';
const promises = [];
if (!('fetch' in window) || !('Symbol' in window)) {
	promises.push(import('whatwg-fetch'));
	promises.push(import('core-js/stable'));
}
Promise.all(promises).then(() => {
	import('./index');
});
