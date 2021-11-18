type ContextVariables = {
	[variable: string]: any;
};

export function getContext(evaluate: string[], script?: HTMLScriptElement | string): ContextVariables {
	if (!script || typeof script === 'string') {
		const scripts = Array.from(document.querySelectorAll((script as string) || 'script#searchspring-context,script[src*="snapui.searchspring.io"]'));
		script = scripts.filter((script) => script.innerHTML.length).pop() as HTMLScriptElement;
	}

	if (!script || typeof script !== 'object' || script.tagName !== 'SCRIPT') {
		throw new Error('getContext: did not find a script tag');
	}

	const scriptElem = script as HTMLScriptElement;

	// check script type
	if (!scriptElem.getAttribute('type')?.match(/^searchspring/) && !scriptElem.id?.match(/^searchspring/)) {
		throw new Error('getContext: script type or id attribute must start with "searchspring"');
	}

	if ((evaluate && !Array.isArray(evaluate)) || (evaluate && !evaluate.reduce((accu, name) => accu && typeof name === 'string', true))) {
		throw new Error('getContext: first parameter must be an array of strings');
	}

	const variables: Record<string, unknown> = {};

	// grab all element attributes and put into variables
	Object.values(scriptElem.attributes).map((attr) => {
		variables[attr.nodeName] = scriptElem.getAttribute(attr.nodeName);
	});

	try {
		// evaluate text and put into variables
		evaluate?.forEach((name) => {
			const fn = new Function(`
				var ${evaluate.join(', ')};
				${scriptElem.innerHTML}
				return ${name};
			`);

			variables[name] = fn();
		});
	} catch (err) {
		console.error('getContext: failed to parse variables - error in context');
		console.error(err);
	}

	return variables;
}
