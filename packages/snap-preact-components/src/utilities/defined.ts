export function defined(properties: Record<string, any>): Record<string, any> {
	const definedProps = {};
	Object.keys(properties).map((key) => {
		if (properties[key] !== undefined) {
			definedProps[key] = properties[key];
		}
	});

	return definedProps;
}
