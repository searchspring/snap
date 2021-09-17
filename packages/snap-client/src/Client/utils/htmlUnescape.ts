export function htmlUnescape(value: string) {
	return value
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&#0?39;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&');
}
