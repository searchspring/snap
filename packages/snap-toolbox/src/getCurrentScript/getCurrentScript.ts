export function getCurrentScript(selector = 'script[src="//snapui"]'): Element {
	// get currently executing script src using document.currentScript
	if (typeof document.currentScript === 'object') {
		return document.currentScript;
	}

	// fallback to selecting by src for browsers without that support (IE)
	return document.querySelector(selector);
}
