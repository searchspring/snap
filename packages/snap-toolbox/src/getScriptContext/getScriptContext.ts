type ContextVariables = {
	[variable: string]: any;
};

export function getScriptContext(script: Element, evaluate?: string[]): ContextVariables {
	if (!script || typeof script !== 'object' || script.constructor.name != 'HTMLScriptElement') {
		throw new Error('script tag must be provided');
	}

	// check script type
	if (!script.getAttribute('type')?.match(/^searchspring/) && !script.id?.match(/^searchspring/)) {
		throw new Error('script type or id attribute must start with "searchspring"');
	}

	if ((evaluate && !Array.isArray(evaluate)) || (evaluate && !evaluate.reduce((accu, name) => accu && typeof name === 'string', true))) {
		throw new Error('getScriptContext second parameter must be an array of strings');
	}

	const variables: Record<string, unknown> = {};

	// grab all element attributes and put into variables
	script.getAttributeNames().map((attr) => {
		variables[attr] = script.getAttribute(attr);
	});

	try {
		// evaluate text and put into variables
		evaluate?.forEach((name) => {
			const fn = new Function(`
				var ${evaluate.join(', ')};
				${script.innerHTML}
				return ${name};
			`);

			variables[name] = fn();
		});
	} catch (err) {
		console.error('getScriptContext: failed to parse variables - error in context');
		console.error(err);
	}

	return variables;
}
