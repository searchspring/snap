import type { Middleware } from './types';
import { MiddlewareManager } from './MiddlewareManager';

export class EventManager {
	public events: Record<string, MiddlewareManager<any>> = {};

	constructor() {
		// noop
	}

	async fire<T>(event: string, context: T): Promise<void> {
		if (this.events[event]) {
			await this.events[event].dispatch(context);
		}

		return Promise.resolve();
	}

	on<T>(event: string, ...func: Middleware<T>[]): void {
		if (!this.events[event]) {
			this.events[event] = new MiddlewareManager<T>();
		}

		this.events[event].use(...func);
	}
}
