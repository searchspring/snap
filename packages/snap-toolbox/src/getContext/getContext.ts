import { parseContext, findAssignedNames, JAVASCRIPT_KEYWORDS } from './parseContext';

type ContextVariables = {
	[variable: string]: any;
};

// what `new Function` throws for the script itself - anything else means the host refused to evaluate (CSP, Trusted Types)
const SCRIPT_ERRORS = ['SyntaxError', 'RangeError', 'InternalError'];

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

	// find the variables the script assigns, to declare them (so they do not leak into the global scope)
	const combinedVars = evaluate.concat(findAssignedNames(scriptInnerHTML));

	// de-dupe vars
	const evaluateVars = combinedVars.filter((item, index) => {
		const isKeyword = JAVASCRIPT_KEYWORDS.has(item);
		// console error if keyword
		if (isKeyword) {
			console.error(`getContext: JavaScript keyword found: '${item}'! Please use a different variable name.`);
		}
		return combinedVars.indexOf(item) === index && !isKeyword;
	});

	// attempt to statically parse the context script - CSP safe (no evaluation)
	const parsed = parseContext(scriptInnerHTML);

	if (parsed.success) {
		// fully declarative script - no evaluation needed
		evaluate?.forEach((name) => {
			scriptVariables[name] = parsed.variables.has(name) ? parsed.variables.get(name) : undefined;
		});
	} else {
		// script contains code the static parser does not support - evaluation required (needs CSP 'unsafe-eval')
		let blocked = false;

		evaluate.forEach((name) => {
			// once evaluation is refused it stays refused, and every further attempt would be another CSP violation
			if (blocked) return;

			let fn: () => any;
			try {
				fn = new Function(`
					var ${evaluateVars.join(', ')};
					${scriptInnerHTML}
					return ${name};
				`) as () => any;
			} catch (err) {
				// a syntax error is the script's own; anything else means the host refused to evaluate
				if (SCRIPT_ERRORS.includes((err as Error)?.name ?? '')) return logEvaluationError(name, err);
				blocked = true;
				console.error(
					`getContext: this site's Content Security Policy ('unsafe-eval') or Trusted Types policy blocks evaluation, and the context script cannot be read without it: ${parsed.reason}. ` +
						`Context scripts must only contain variable assignments of literal values (strings, numbers, booleans, objects, arrays).`
				);
				return;
			}

			try {
				scriptVariables[name] = fn();
			} catch (err) {
				logEvaluationError(name, err);
			}
		});
	}

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

function logEvaluationError(name: string, err: unknown): void {
	// a keyword cannot be returned - it was already reported when the variable list was built
	if (JAVASCRIPT_KEYWORDS.has(name)) return;
	console.error(`getContext: error evaluating '${name}'`);
	console.error(err);
}

function removeUndefined(variables: ContextVariables) {
	Object.keys(variables).forEach((key) => {
		if (typeof variables[key] === 'undefined') delete variables[key];
	});
	return variables;
}
