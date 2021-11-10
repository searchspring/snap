export function getCurrentScript(selector?: string): HTMLScriptElement {
	// get currently executing script src using document.currentScript
	if ('currentScript' in document) {
		return document.currentScript as HTMLScriptElement;
	}

	// fallback to selecting by src for browsers without that support (IE)
	const script = document.querySelector(selector || 'script[src*="snapui.searchspring.io"]') as HTMLScriptElement;
	if (!script || typeof script !== 'object' || script.tagName !== 'SCRIPT') {
		throw new Error('getCurrentScript selector did not find a script tag');
	}

	return script;
}
