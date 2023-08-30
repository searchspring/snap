export function unescapeHTML(value: string) {
	return value
		.replace(/&gt;/g, `>`)
		.replace(/&lt;/g, `<`)
		.replace(/&#0?39;/g, `'`)
		.replace(/&apos;/g, `'`)
		.replace(/&#0?34;/g, `"`)
		.replace(/&quot;/g, `"`)
		.replace(/&amp;/g, `&`);
}
