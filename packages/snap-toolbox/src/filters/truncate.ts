export function truncate(input: string, limit: number, append?: string): string {
	if (typeof input != 'string' || input.length <= limit) {
		return input;
	}

	const lastSpace = input.lastIndexOf(' ', limit);
	const trimIndex = lastSpace != -1 ? lastSpace : limit - 1;

	return input.substr(0, trimIndex) + (append ? append : '');
}
