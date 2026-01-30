type ContextVariables = {
	[variable: string]: any;
};

const JAVASCRIPT_KEYWORDS = new Set([
	'break',
	'case',
	'catch',
	'class',
	'const',
	'continue',
	'debugger',
	'default',
	'delete',
	'do',
	'else',
	'export',
	'extends',
	'finally',
	'for',
	'function',
	'if',
	'import',
	'in',
	'instanceof',
	'new',
	'return',
	'super',
	'switch',
	'this',
	'throw',
	'try',
	'typeof',
	'var',
	'void',
	'while',
	'with',
	'yield',
	'let',
	'static',
	'enum',
	'await',
	'implements',
	'package',
	'protected',
	'interface',
	'private',
	'public',
]);

export function getContext(evaluate: string[] = [], scriptOrSelector?: HTMLScriptElement | string): ContextVariables {
	let script: HTMLScriptElement | undefined;

	if (!scriptOrSelector || typeof scriptOrSelector === 'string') {
		const scripts = Array.from(
			document.querySelectorAll((scriptOrSelector as string) || 'script[id^=searchspring], script[src*="snapui.searchspring.io"]')
		);

		script = scripts
			.sort((a, b) => {
				// order them by innerHTML (so that popped script has innerHTML)
				return a.innerHTML.length - b.innerHTML.length;
			})
			.pop() as HTMLScriptElement;
	} else if (scriptOrSelector && scriptOrSelector.tagName === 'SCRIPT') {
		// script is a 'script element'
		script = scriptOrSelector as HTMLScriptElement;
	}

	if (!script) {
		throw new Error('getContext: did not find a script tag');
	}

	if (!scriptOrSelector && !script.id?.match(/^searchspring/i) && !script.src?.match(/\/\/snapui.searchspring.io/i)) {
		throw new Error('getContext: did not find a script from Snap CDN or with attribute \'id\' starting with "searchspring"');
	}

	if ((evaluate && !Array.isArray(evaluate)) || (evaluate && !evaluate.reduce((accu, name) => accu && typeof name === 'string', true))) {
		throw new Error('getContext: first parameter must be an array of strings');
	}

	const siteIdString = 'siteId';

	const attributeVariables: ContextVariables = {};

	// grab element attributes and put into variables
	Object.values(script?.attributes).map((attr) => {
		const name = attr.nodeName;
		if (evaluate.includes(name)) {
			attributeVariables[name] = script?.getAttribute(name);
		}
	});

	const scriptVariables: ContextVariables = {};
	const scriptInnerHTML = script?.innerHTML;

	// attempt to grab inner HTML variables
	const scriptInnerVars = scriptInnerHTML
		// first remove all string literals (including template literals) to avoid false matches
		.replace(/`(?:\\[\s\S]|[^`\\])*`|'(?:\\[\s\S]|[^'\\])*'|"(?:\\[\s\S]|[^"\\])*"/g, '')
		// then find variable assignments
		.match(/([a-zA-Z_$][a-zA-Z_$0-9]*)\s*=/g)
		?.map((match) => match.replace(/[\s=]/g, ''));

	const combinedVars = evaluate.concat(scriptInnerVars || []);

	// de-dupe vars
	const evaluateVars = combinedVars.filter((item, index) => {
		const isKeyword = JAVASCRIPT_KEYWORDS.has(item);
		// console error if keyword
		if (isKeyword) {
			console.error(`getContext: JavaScript keyword found: '${item}'! Please use a different variable name.`);
		}
		return combinedVars.indexOf(item) === index && !isKeyword;
	});

	// evaluate text and put into variables
	evaluate?.forEach((name) => {
		try {
			const fn = new Function(`
				var ${evaluateVars.join(', ')};
				${scriptInnerHTML}
				return ${name};
			`);
			scriptVariables[name] = fn();
		} catch (err) {
			// if evaluation fails, set to undefined
			const isKeyword = JAVASCRIPT_KEYWORDS.has(name);
			if (!isKeyword) {
				console.error(`getContext: error evaluating '${name}'`);
				console.error(err);
			}
			scriptVariables[name] = undefined;
		}
	});

	const variables = {
		...removeUndefined(attributeVariables),
		...removeUndefined(scriptVariables),
	};

	if (evaluate.includes(siteIdString)) {
		// if we didnt find a siteId in the context, lets grab the id from the src url.
		if (!variables[siteIdString]) {
			const siteId = script.getAttribute('src')?.match(/.*snapui.searchspring.io\/([a-zA-Z0-9]{6})\//);
			if (siteId && siteId.length > 1) {
				variables.siteId = siteId[1];
			}
		}
	}

	return variables;
}

function removeUndefined(variables: ContextVariables) {
	Object.keys(variables).forEach((key) => {
		if (typeof variables[key] === 'undefined') delete variables[key];
	});
	return variables;
}
