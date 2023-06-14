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

	const siteIdString = 'siteId';

	const variables: ContextVariables = {};

	// evaluate text and put into variables
	evaluate?.forEach((name) => {
		const fn = new Function(`
			var ${evaluate.join(', ')};
			${scriptElem.innerHTML.replace(/\\/g, '%5C')}

			return ${name};
		`);
		variables[name] = fn();
	});

	// grab element attributes and put into variables
	Object.values(scriptElem.attributes).map((attr) => {
		const name = attr.nodeName;
		if (evaluate.includes(name)) {
			variables[name] = scriptElem.getAttribute(name);
		}
	});

	// remove undefined entries
	Object.keys(variables).forEach((key) => {
		if (typeof variables[key] === 'undefined') delete variables[key];
	});

	if (evaluate.includes(siteIdString)) {
		// if we didnt find a siteId in the context, lets grab the id from the src url.
		if (!variables[siteIdString]) {
			const siteId = script.getAttribute('src')?.match(/.*snapui.searchspring.io\/([a-zA-Z0-9]{6})\//);
			if (siteId && siteId.length > 1) {
				variables.siteId = siteId[1];
			}
		}
	}

	console.log(variables);

	const decodeNestedVariables = (obj: any) => {
		return Object.fromEntries(
			Object.entries(obj).map(([key, val]): any => {
				console.log('key', key);
				console.log('val', val);
				if (Array.isArray(val)) {
					return [val]; // recurse
				} else if (val && typeof val === 'object') {
					return [key, decodeNestedVariables(val)]; // recurse
				} else {
					return [key, decodeURIComponent(val as string)];
				}
			})
		);
	};

	console.log(decodeNestedVariables(variables));
	return decodeNestedVariables(variables);
	// return variables
}
