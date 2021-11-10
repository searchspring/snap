import { getCurrentScript } from '../getCurrentScript/getCurrentScript';

type ContextVariables = {
	[variable: string]: any;
};

export function getScriptContext(evaluate?: string[], script?: HTMLScriptElement | string): ContextVariables {
	if (!script || typeof script !== 'object' || script.tagName !== 'SCRIPT') {
		script = getCurrentScript(typeof script == 'string' ? script : undefined);

		if (!script) {
			throw new Error(`getScriptContext could not find a valid script tag or invalid selector`);
		}
	}

	const scriptElem = script as HTMLScriptElement;

	// check script type
	if (!scriptElem.getAttribute('type')?.match(/^searchspring/) && !scriptElem.id?.match(/^searchspring/)) {
		throw new Error('script type or id attribute must start with "searchspring"');
	}

	if ((evaluate && !Array.isArray(evaluate)) || (evaluate && !evaluate.reduce((accu, name) => accu && typeof name === 'string', true))) {
		throw new Error('getScriptContext first parameter must be an array of strings');
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
		console.error('getScriptContext: failed to parse variables - error in context');
		console.error(err);
	}

	return variables;
}
