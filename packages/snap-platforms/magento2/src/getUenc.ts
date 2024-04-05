export const getUenc = () => {
	const uenc = typeof btoa == 'function' ? btoa(window.location.href) : '';
	return uenc;
};
