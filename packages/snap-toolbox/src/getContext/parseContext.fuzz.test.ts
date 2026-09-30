import { parseContext, findAssignedNames, JAVASCRIPT_KEYWORDS } from './parseContext';

/**
 * Differential test: whenever the static parser claims success, evaluating the same script the way `getContext` does
 * (`new Function`) must succeed and produce identical values. Any divergence is a regression for every integration,
 * since the parser is the primary path for all context scripts.
 *
 * Generated scripts follow the shape of live context scripts (sizes, nesting, the escapes json encoders emit); `SHAPES`
 * are hand written scripts in the forms platforms render, used as-is and as seeds for corruption.
 *
 * Deterministic - tune with `FUZZ_ITERATIONS` (per phase) and `FUZZ_SEED` for longer local runs.
 */

const ITERATIONS = Number(process.env.FUZZ_ITERATIONS) || 1500;
const SEED = Number(process.env.FUZZ_SEED) || 1;

type Evaluated = { syntaxError?: string; values: Record<string, any> };

// mirrors the evaluation branch of getContext: caller names + the names it finds assigned, de-duped, keywords dropped
function evaluateLikeGetContext(script: string, requested: string[]): Evaluated {
	const combined = requested.concat(findAssignedNames(script));
	const evaluateVars = combined.filter((item, index) => combined.indexOf(item) === index && !JAVASCRIPT_KEYWORDS.has(item));

	const values: Record<string, any> = {};
	let syntaxError: string | undefined;
	evaluateVars.forEach((name) => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-implied-eval
			const fn = new Function(`
					var ${evaluateVars.join(', ')};
					${script}
					return ${name};
				`);
			values[name] = fn();
		} catch (err) {
			if (err instanceof SyntaxError) syntaxError = err.message;
			values[name] = { __error: (err as Error).constructor.name };
		}
	});
	return { values, syntaxError };
}

// canonical representation for comparison - values evaluated via `new Function` come from the jest sandbox realm, so
// `toStrictEqual` rejects them on prototype identity; this keeps the strictness that matters (undefined, -0, NaN, key order)
function canonical(value: any): string {
	if (typeof value === 'number') return Object.is(value, -0) ? '-0' : `${typeof value}:${value}`;
	if (value === null || typeof value !== 'object') return `${typeof value}:${String(value)}`;
	if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
	return `{${Object.keys(value)
		.map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
		.join(',')}}`;
}

// deterministic PRNG (mulberry32)
let seed = SEED;
const rnd = (): number => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = <T>(list: T[]): T => list[Math.floor(rnd() * list.length)];

const NEWLINES = ['\n', '\r\n', '\r', '\u2028', '\n\n'];
// whitespace beyond ascii that platform templates emit (no-break, byte order mark, em and ideographic spaces)
const UNICODE_SPACES = [0xa0, 0xfeff, 0x2003, 0x3000].map((code) => String.fromCharCode(code));
const SPACES = ['', ' ', '  ', '\t', ' \t ', '\v', '\f', ...UNICODE_SPACES];
const NAMES = ['siteId', 'shopper', 'merchandising', 'currency', 'a', '_b', '$c', 'd1', 'items', 'config', 'x', 'y'];
// generated scripts use only the supported grammar; unsupported forms live in EXOTIC and are injected by mutation
const STRING_PARTS = [
	'a',
	'z',
	' ',
	'0',
	'-',
	'_',
	'/',
	':',
	'.',
	'&amp;',
	'<',
	'>',
	'{',
	'}',
	'$',
	'{}',
	'${',
	'\\n',
	'\\t',
	'\\\\',
	"\\'",
	'\\"',
	'\\`',
	'\\$',
	'\\u00e9',
	'\\a',
	'é',
	'\u2028',
	'//',
	'/*',
	'*/',
	';',
	'=',
	'μ',
	// what json encoders (liquid `| json`, php json_encode) emit - `\/` is by far the most common escape in live scripts
	'\\/',
	'https:\\/\\/example.com\\/a',
	'\\u00E9',
	'\\u003c',
	'\\u003E',
	'\\u0026',
	'\\u0027',
	'\\ud83d\\ude00',
	'\\uD83D',
	'\\u' + '2028',
	'{{amount}}',
	'&quot;',
	...UNICODE_SPACES,
];
const KEYS = ['1', '2.5', 'default', 'class', 'constructor', 'toString', 'hasOwnProperty', "'quoted key'", '"other-key"'];
const NUMBERS = ['0', '1', '42', '3.14', '9007199254740993', '-1', '-0', '0.0', '0.5'];
// unsupported forms the parser must reject (evaluation handles them): template literals, exotic numbers and escapes,
// computed keys, variable references - some are syntax errors when evaluated, which the parser must also not accept
const EXOTIC = [
	'`tpl`',
	'`t${x}`',
	'0x1F',
	'0XfF',
	'1e3',
	'2.5E-2',
	'1e400',
	'.5',
	'1.',
	'+7',
	'- 2',
	'010',
	'1_000',
	'10n',
	'\\x41',
	'\\u{1F600}',
	'\\0',
	'\\1',
	'\\\n',
	'[x]',
	'siteId',
	'a',
];
const COMMENTS = ['// c\n', '// c = 1\n', '/* b */', '/* multi\n line = 2 */', "// it's\n", '/* "q */', ''];
const JUNK = [
	'(',
	')',
	'.',
	'+',
	'-',
	'=',
	';',
	',',
	':',
	'{',
	'}',
	'[',
	']',
	"'",
	'"',
	'`',
	'\\',
	'/',
	'*',
	'x',
	'1',
	' ',
	'\n',
	'$',
	'new ',
	'this',
	'window.',
	'()',
	'=>',
	'${',
	'0',
	'n',
	'_',
];

function genString(): string {
	const quote = pick(["'", '"']);
	let body = '';
	const length = Math.floor(rnd() * 8);
	for (let i = 0; i < length; i++) {
		const part = pick(STRING_PARTS);
		body += part === quote ? '\\' + part : part;
	}
	return quote + body + quote;
}

// live context scripts nest up to 5 levels and hold up to 11 statements; generate a little beyond both
const MAX_DEPTH = 6;
const MAX_STATEMENTS = 12;

function genLeaf(): string {
	const roll = rnd();
	if (roll < 0.6) return genString();
	if (roll < 0.85) return pick(NUMBERS);
	return pick(['true', 'false', 'null', 'undefined']);
}

function genValue(depth: number): string {
	const roll = rnd();
	if (depth >= MAX_DEPTH || roll < 0.35) return genString();
	if (roll < 0.5) return pick(NUMBERS);
	if (roll < 0.62) return pick(['true', 'false', 'null', 'undefined']);
	// usually a few items, sometimes a long list of leaves (recommended products, cart items)
	const long = rnd() < 0.05;
	const length = long ? 10 + Math.floor(rnd() * 30) : Math.floor(rnd() * 4);
	const item = () => (long ? genLeaf() : genValue(depth + 1));
	const parts: string[] = [];
	if (roll < 0.82) {
		for (let i = 0; i < length; i++) parts.push(item());
		return '[' + pick(SPACES) + parts.join(',' + pick(SPACES) + pick(['', pick(NEWLINES)])) + (length && rnd() < 0.3 ? ',' : '') + pick(SPACES) + ']';
	}
	for (let i = 0; i < length; i++) {
		parts.push(pick(NAMES.concat(KEYS)) + pick(SPACES) + ':' + pick(SPACES) + item());
	}
	return (
		'{' +
		pick(['', pick(NEWLINES)]) +
		parts.join(',' + pick(['', pick(NEWLINES), pick(SPACES)])) +
		(length && rnd() < 0.3 ? ',' : '') +
		pick(['', pick(NEWLINES)]) +
		'}'
	);
}

function genScript(): string {
	// mostly a few statements, like live scripts, with a tail up to MAX_STATEMENTS
	const statements = 1 + Math.floor(rnd() * rnd() * MAX_STATEMENTS);
	let script = pick(['', pick(NEWLINES), pick(COMMENTS)]);
	for (let i = 0; i < statements; i++) {
		script += pick(COMMENTS) + pick(SPACES) + pick(NAMES) + pick(SPACES) + '=' + pick(SPACES) + genValue(0);
		script += pick([';', ';', ';' + pick(NEWLINES), pick(NEWLINES), ' ;', pick(NEWLINES) + ';', '']) + pick(COMMENTS);
	}
	return script + pick(['', ';', pick(NEWLINES)]);
}

// hand written context scripts in the forms platforms render (made up values, no customer data)
const NBSP = String.fromCharCode(0xa0);
const SHAPES = [
	// shopify theme: shopper with cart, money format, json encoded url
	`
		siteId = 'a1b2c3';
		shopper = {
			id: "7700112233",
			cart: [
				{ uid: "4410", sku: "TEE-100", childSku: "TEE-100-BLK-M", qty: "1", price: "29.99" },
				{ uid: "4411", sku: "CAP-7", childSku: "CAP-7", qty: "2", price: "12.50" },
			],
		};
		currency = 'USD';
		config = { format: "\${{amount}}", url: "https:\\/\\/shop.example.com\\/collections\\/all" };
	`,
	// collection page: liquid json escapes and html entities in names, merchandising segments
	`
		collection = { id: "281234", name: "Men\\u0027s Tops &amp; Tees", handle: "mens-tops-tees" };
		merchandising = { segments: ["country:US", "customer:guest", "device:mobile"] };
		backgroundFilters = [];
		tags = ["Sale", "Caf\\u00e9 \\u003cNew\\u003e", "\\ud83d\\ude00 fun"];
	`,
	// bigcommerce category, single quotes, no final semicolon
	`
		category = { id: '42', path: 'Shop All\\/Lamps &amp; Lighting\\/Floor Lamps' };
		page = { type: 'category' }`,
	// magento: guest shopper, nested currency, keyword keys, trailing commas
	`
		shopper = { id: '' };
		currency = { code: 'EUR', symbol: '\\u20ac', };
		custom = { default: true, class: 'b2b', new: false, 'store-view': 'de_de', };`,
	// grouped recommendations block
	`
		globals = {
			shopper: { id: "snapdev" },
			products: ["SKU-1", "SKU-2", "SKU-3"],
			cart: [],
		};
		profiles = [
			{ tag: "similar", selector: "#recs-similar", options: { limit: 12, branch: "production" } },
			{ tag: "recently-viewed", selector: ".recs-recent" },
		];
	`,
	// legacy recommendations block: newline separated (no semicolons), comment
	`
		// product page recommendations
		profile = "product-page"
		product = "SKU-3"
		seed = ["SKU-3"]
		options = { siteId: "a1b2c3", categories: ["Men\\u0027s", "Sale"], branch: 'production', limit: 20 }
	`,
	// tracking: decimals and integers
	`item = { uid: "123", sku: "SKU-1", price: 19.95, qty: 1, variant: null };`,
	// unicode whitespace between tokens, as some templates emit
	`siteId${NBSP}=${NBSP}'a1b2c3';${NBSP}\n\tshopper${NBSP}= { id:${NBSP}"guest" };`,
];

function mutate(script: string): string {
	const edits = 1 + Math.floor(rnd() * 3);
	for (let i = 0; i < edits; i++) {
		const at = Math.floor(rnd() * (script.length + 1));
		const roll = rnd();
		const insert = rnd() < 0.3 ? pick(EXOTIC) : pick(JUNK);
		if (roll < 0.5) script = script.slice(0, at) + insert + script.slice(at);
		else if (roll < 0.8) script = script.slice(0, at) + script.slice(at + 1);
		else script = script.slice(0, at) + insert + script.slice(at + 1);
	}
	return script;
}

function expectEquivalence(script: string): void {
	const parsed = parseContext(script);
	if (!parsed.success) return;

	const names = Array.from(parsed.variables.keys());
	const evaluated = evaluateLikeGetContext(script, names);
	if (evaluated.syntaxError) {
		throw new Error(`parser accepted a script that evaluation rejects (${evaluated.syntaxError}):\n${JSON.stringify(script)}`);
	}

	const parsedValues: Record<string, any> = {};
	Object.keys(evaluated.values).forEach((name) => {
		parsedValues[name] = parsed.variables.has(name) ? parsed.variables.get(name) : undefined;
	});
	// eslint-disable-next-line jest/no-standalone-expect
	expect({ script, values: canonical(parsedValues) }).toStrictEqual({ script, values: canonical(evaluated.values) });
}

describe(`parseContext equivalence with evaluation (seed ${SEED}, ${ITERATIONS} iterations per phase)`, () => {
	it('matches evaluation on realistic context scripts', () => {
		SHAPES.forEach((script) => {
			expect({ script, success: parseContext(script).success }).toStrictEqual({ script, success: true });
			expectEquivalence(script);
		});
	});

	it('matches evaluation on generated declarative scripts', () => {
		let parsedCount = 0;
		for (let i = 0; i < ITERATIONS; i++) {
			const script = genScript();
			expectEquivalence(script);
			if (parseContext(script).success) parsedCount++;
		}
		// sanity check that the generator mostly produces scripts the parser handles (the rest lack statement separators)
		expect(parsedCount).toBeGreaterThan(ITERATIONS * 0.7);
	});

	it('never crashes or diverges on corrupted scripts', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			expectEquivalence(mutate(genScript()));
		}
	});

	it('never crashes or diverges on corrupted realistic scripts', () => {
		for (let i = 0; i < ITERATIONS; i++) {
			expectEquivalence(mutate(pick(SHAPES)));
		}
	});
});
