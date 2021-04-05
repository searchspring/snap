export function stripHTML(input: string): string {
	if (typeof input != 'string') {
		return input;
	}

	return input
		.replace(/<(?:.|\n)*?>/gm, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}
