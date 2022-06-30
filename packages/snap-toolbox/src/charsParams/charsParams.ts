export type ParameterObject = Record<string, boolean | string | string[] | number | number[]>;

export function charsParams(params: ParameterObject): number {
	if (typeof params != 'object') {
		throw new Error('function requires an object');
	}

	const count = Object.keys(params).reduce((count, key) => {
		const keyLength = key.length;
		const value = params[key];
		if (Array.isArray(value)) {
			return (
				count +
				(value as string[]).reduce((length, val) => {
					return length + keyLength + 1 + ('' + val).length;
				}, 0)
			);
		} else {
			return count + keyLength + 1 + ('' + value).length;
		}
	}, 1);

	return count;
}
