import type { Middleware, Callback } from './types';

export class MiddlewareManager<T> {
	private functions: Middleware<T>[];

	constructor() {
		this.functions = [];
	}

	public use(...func: Middleware<T>[]): void {
		this.functions.push(...func);
	}

	public remove(func: Middleware<T>): void {
		const stringyFunc: string = func.toString();

		this.functions = this.functions.filter((fn) => {
			return func.name !== fn.name || fn.toString() != stringyFunc;
		});
	}

	public clear(): void {
		this.functions = [];
	}

	public async dispatch(context?: T): Promise<void> {
		const cancelling = await runFunctionsWithAbortWrapper(context || ({} as T), this.functions);

		if (cancelling == true) {
			throw new Error('cancelled');
		}
	}
}

async function runFunctionsWithAbortWrapper<T>(context: T, functions: Middleware<T>[]): Promise<boolean> {
	let cancelled = false;

	await runFunctions(context, functions, (proceed) => {
		if (proceed === false) cancelled = true;
	});

	return cancelled;
}

async function runFunctions<T>(context: T, functions: Middleware<T>[], callback: Callback): Promise<void> {
	if (!functions.length) {
		return;
	}

	const func = functions[0];

	const proceed = await func(context, async () => {
		await runFunctions(context, functions.slice(1), callback);
	});

	callback(proceed);
}
