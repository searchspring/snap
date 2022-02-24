type ContextVariables = {
	[variable: string]: any;
};

export function getContext(evaluate: string[] = [], script?: HTMLScriptElement | string): ContextVariables {
	if (!script || typeof script === 'string') {
		const scripts = Array.from(document.querySelectorAll((script as string) || 'script[id^=searchspring], script[src*="snapui.searchspring.io"]'));

		script = scripts
			.sort((a, b) => {
				// order them by innerHTML (so that popped script has innerHTML)
				return a.innerHTML.length - b.innerHTML.length;
			})
			.pop() as HTMLScriptElement;
	}

	if (!script || typeof script !== 'object' || script.tagName !== 'SCRIPT') {
		throw new Error('getContext: did not find a script tag');
	}

	const scriptElem = script as HTMLScriptElement;

	// check script type
	if (
		!scriptElem.getAttribute('type')?.match(/^searchspring/i) &&
		!scriptElem.id?.match(/^searchspring/i) &&
		!scriptElem.src?.match(/\/\/snapui.searchspring.io/i)
	) {
		throw new Error('getContext: did not find a script from Snap CDN or with attribute (type, id) starting with "searchspring"');
	}

	if ((evaluate && !Array.isArray(evaluate)) || (evaluate && !evaluate.reduce((accu, name) => accu && typeof name === 'string', true))) {
		throw new Error('getContext: first parameter must be an array of strings');
	}

	const variables: ContextVariables = {};

	// grab all element attributes and put into variables
	Object.values(scriptElem.attributes).map((attr) => {
		variables[attr.nodeName] = scriptElem.getAttribute(attr.nodeName);
	});

	// evaluate text and put into variables
	evaluate?.forEach((name) => {
		const fn = new Function(`
			var ${evaluate.join(', ')};
			${scriptElem.innerHTML}
			return ${name};
		`);

		variables[name] = fn();
	});

	return variables;
}
