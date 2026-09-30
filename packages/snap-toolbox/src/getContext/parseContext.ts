/**
 * Static parser for context scripts: reads variable assignments of literal values without evaluating JavaScript,
 * so `getContext` works (and triggers no violations) under a Content Security Policy without 'unsafe-eval'.
 *
 * A single pass scanner in the style of a hand written JSON parser. Grammar:
 *
 *   script    := ( ';' | statement )*
 *   statement := name '=' value ( ';' | end-of-script | newline-before-next-statement )
 *   value     := string | number | 'true' | 'false' | 'null' | 'undefined' | array | object
 *   array     := '[' ( value ( ',' value )* ','? )? ']'
 *   object    := '{' ( key ':' value ( ',' key ':' value )* ','? )? '}'   key := name | string | number
 *   string    := single or double quoted with JSON style escapes (\n \t \r \b \f \v \uXXXX \" \' \\ \/)
 *   number    := decimal digits, optional fraction, optional leading '-'
 *
 * Comments (`//` and `/* ... *\/`) may appear wherever whitespace may.
 *
 * The one rule that matters: whenever this parser succeeds, its result must equal what evaluating the script would
 * produce. Anything it does not understand (functions, expressions, member access, template literals, references to
 * other variables, less common literal forms) throws so the caller falls back to evaluation - there is
 * no partial result. When in doubt, throw. `parseContext.fuzz.test.ts` checks this equivalence against `new Function`.
 */

export const JAVASCRIPT_KEYWORDS = new Set(
	`break case catch class const continue debugger default delete do else export extends finally for function if import
	in instanceof new return super switch this throw try typeof var void while with yield let static enum await
	implements package protected interface private public`.split(/\s+/)
);

const LITERAL_VALUES = new Map<string, any>(Object.entries({ true: true, false: false, null: null, undefined: undefined }));

// string literals (single, double and template quoted) - removed before looking for assignments
const STRING_LITERALS = /`(?:\\[\s\S]|[^`\\])*`|'(?:\\[\s\S]|[^'\\])*'|"(?:\\[\s\S]|[^"\\])*"/g;

/** The names a script assigns to (`name =`, but not `==` or `=>`), which `getContext` declares when it has to evaluate the script. */
export function findAssignedNames(script: string): string[] {
	return (
		(script.replace(STRING_LITERALS, '').match(/([a-zA-Z_$][a-zA-Z_$0-9]*)\s*=(?![=>])/g) || [])
			.map((match) => match.replace(/[\s=]/g, ''))
			// literal names (e.g. `true =` inside a comment) cannot be declared
			.filter((name) => !LITERAL_VALUES.has(name))
	);
}

const ESCAPES = new Map(Object.entries({ n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v' }));

// \p{Zl} and \p{Zp} are the U+2028 and U+2029 line terminators
const LINE_TERMINATOR = /[\n\r\p{Zl}\p{Zp}]/u;
// sticky patterns, matched at the current position
const TRIVIA = /\s+|\/\/[^\n\r\p{Zl}\p{Zp}]*|\/\*[\s\S]*?\*\//uy;
const NAME = /[A-Za-z_$][\w$]*/y;
const ASSIGNMENT_START = /[A-Za-z_$][\w$]*\s*=(?!=)/y;
const DECIMAL = /\d+(\.\d+)?/y;
const HEX4 = /[0-9a-fA-F]{4}/y;

export type ParseContextResult = { success: true; variables: Map<string, any> } | { success: false; reason: string };

/** Parses a context script; `reason` says what (and on which line) could not be read when any part of it is unsupported. */
export function parseContext(script: string): ParseContextResult {
	try {
		return { success: true, variables: new ContextParser(script).parseScript() };
	} catch (err) {
		// unsupported syntax, or anything unexpected (e.g. a stack overflow on absurd nesting): fall back to evaluation
		return { success: false, reason: (err as Error)?.message ?? String(err) };
	}
}

class ContextParser {
	private pos = 0;

	constructor(private readonly src: string) {}

	parseScript(): Map<string, any> {
		const variables = new Map<string, any>();
		for (this.skipTrivia(); !this.atEnd(); this.skipTrivia()) {
			if (this.tryConsume(';')) continue;
			const [name, value] = this.parseStatement();
			variables.set(name, value);
		}
		return variables;
	}

	private parseStatement(): [name: string, value: any] {
		const name = this.parseName();
		if (JAVASCRIPT_KEYWORDS.has(name) || LITERAL_VALUES.has(name)) this.fail(`'${name}' cannot be assigned`);
		this.skipTrivia();
		this.consume('=');
		this.skipTrivia();
		const value = this.parseValue();
		// a statement ends with ';', the end of the script, or (automatic semicolon insertion) another assignment on a new line
		const crossedNewline = this.skipTrivia();
		if (!this.atEnd() && !this.tryConsume(';') && !(crossedNewline && this.atAssignmentStart())) this.fail(`expected ';'`);
		return [name, value];
	}

	private parseValue(): any {
		const ch = this.peek();
		if (ch === '"' || ch === "'") return this.parseString();
		if (ch === '[') return this.parseArray();
		if (ch === '{') return this.parseObject();
		if (ch === '-' || /\d/.test(ch)) return this.parseNumber();
		if (/[A-Za-z_$]/.test(ch)) {
			const word = this.parseName();
			if (LITERAL_VALUES.has(word)) return LITERAL_VALUES.get(word);
			this.fail(`unsupported value '${word}'`); // a variable, global or function: needs evaluation
		}
		this.fail(`unexpected '${ch}'`);
	}

	private parseString(): string {
		const quote = this.next();
		let value = '';
		for (;;) {
			const ch = this.next();
			if (ch === '' || ch === '\n' || ch === '\r') this.fail('unterminated string');
			if (ch === quote) return value;
			value += ch === '\\' ? this.parseEscape() : ch;
		}
	}

	private parseEscape(): string {
		const ch = this.next();
		if (ch === 'u') return String.fromCharCode(parseInt(this.match(HEX4) ?? this.fail('invalid \\u escape'), 16));
		if (ESCAPES.has(ch)) return ESCAPES.get(ch) as string;
		// legacy octal (\0-\9), \x, \u{...} and line continuations are left to evaluation
		if (ch === '' || ch === 'x' || /\d/.test(ch) || LINE_TERMINATOR.test(ch)) this.fail('unsupported escape sequence');
		return ch; // any other escaped character stands for itself: \\ \' \" \/ ...
	}

	private parseNumber(): number {
		const negative = this.tryConsume('-');
		const digits = this.match(DECIMAL) ?? this.fail('expected a number');
		// leading zeros (legacy octal) and anything glued to the digits (hex, exponents, bigint, separators, `1.`) are left to evaluation
		if (/^0\d/.test(digits) || /[\w$.]/.test(this.peek())) this.fail('unsupported number');
		return negative ? -Number(digits) : Number(digits);
	}

	private parseArray(): any[] {
		this.consume('[');
		const items: any[] = [];
		for (this.skipTrivia(); !this.tryConsume(']'); this.skipTrivia()) {
			items.push(this.parseValue());
			this.skipTrivia();
			if (!this.tryConsume(',') && this.peek() !== ']') this.fail(`expected ',' or ']'`);
		}
		return items;
	}

	private parseObject(): { [key: string]: any } {
		this.consume('{');
		const obj: { [key: string]: any } = {};
		for (this.skipTrivia(); !this.tryConsume('}'); this.skipTrivia()) {
			const key = this.parseObjectKey();
			if (key === '__proto__') this.fail(`unsupported key '__proto__'`); // would set the prototype when evaluated
			this.skipTrivia();
			this.consume(':');
			this.skipTrivia();
			// an own property, never a setter
			Object.defineProperty(obj, key, { value: this.parseValue(), enumerable: true, writable: true, configurable: true });
			this.skipTrivia();
			if (!this.tryConsume(',') && this.peek() !== '}') this.fail(`expected ',' or '}'`);
		}
		return obj;
	}

	private parseObjectKey(): string {
		const ch = this.peek();
		if (ch === '"' || ch === "'") return this.parseString();
		if (/\d/.test(ch)) return String(this.parseNumber());
		return this.parseName(); // keywords are valid keys
	}

	private parseName(): string {
		return this.match(NAME) ?? this.fail('expected a name');
	}

	/** Skips whitespace and comments; returns whether a line terminator was crossed (including inside a comment). */
	private skipTrivia(): boolean {
		let crossedNewline = false;
		for (let skipped = this.match(TRIVIA); skipped !== undefined; skipped = this.match(TRIVIA)) {
			if (LINE_TERMINATOR.test(skipped)) crossedNewline = true;
		}
		if (this.src.startsWith('/*', this.pos)) this.fail('unterminated comment');
		return crossedNewline;
	}

	private atAssignmentStart(): boolean {
		ASSIGNMENT_START.lastIndex = this.pos;
		return ASSIGNMENT_START.test(this.src);
	}

	private atEnd(): boolean {
		return this.pos >= this.src.length;
	}

	private peek(): string {
		return this.src[this.pos] ?? '';
	}

	private next(): string {
		return this.src[this.pos++] ?? '';
	}

	private tryConsume(ch: string): boolean {
		return this.peek() === ch && ++this.pos > 0;
	}

	private consume(ch: string): void {
		if (!this.tryConsume(ch)) this.fail(`expected '${ch}'`);
	}

	/** Matches a sticky pattern at the current position and advances past it. */
	private match(pattern: RegExp): string | undefined {
		pattern.lastIndex = this.pos;
		const found = pattern.exec(this.src);
		if (found) this.pos = pattern.lastIndex;
		return found?.[0];
	}

	private fail(message: string): never {
		const line = (this.src.slice(0, this.pos).match(/\r\n|[\n\r\p{Zl}\p{Zp}]/gu) || []).length + 1;
		throw new Error(`${message} (line ${line})`);
	}
}
