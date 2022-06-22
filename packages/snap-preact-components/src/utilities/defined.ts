type DefinedProps = {
	[key: string]: any;
};

export function defined(properties: Record<string, any>): DefinedProps {
	const definedProps: DefinedProps = {};
	Object.keys(properties).map((key) => {
		if (properties[key] !== undefined) {
			definedProps[key] = properties[key];
		}
	});

	return definedProps;
}
