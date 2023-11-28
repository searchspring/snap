export const debounce = (func: (...props: any) => void, timeout = 200) => {
	let timer: number;
	return (...args: any) => {
		clearTimeout(timer);
		timer = window.setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};
