import { observable, action, makeObservable } from 'mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { StoreServices } from '../../types';
import type { AutocompleteRequestModelSearchSourceEnum } from '@searchspring/snapi-types';

export class AutocompleteStateStore {
	public locks: {
		terms: Lock;
		facets: Lock;
	};

	public focusedInput: HTMLInputElement | undefined = undefined;
	public input: string | undefined = undefined;
	public source: AutocompleteRequestModelSearchSourceEnum = 'typed' as AutocompleteRequestModelSearchSourceEnum;
	public url: UrlManager;

	constructor(services: StoreServices) {
		this.locks = {
			terms: new Lock(false),
			facets: new Lock(false),
		};

		this.url = services.urlManager;

		makeObservable(this, {
			focusedInput: observable,
			locks: observable,
			input: observable,
			reset: action,
		});
	}

	public reset(): void {
		this.input = undefined;
		this.locks.terms.reset();
		this.locks.facets.reset();
	}
}

export class Lock {
	private state: boolean;
	private startState: boolean;

	constructor(state = false) {
		this.state = this.startState = state;
	}

	public reset(): void {
		this.state = this.startState;
	}

	public get locked(): boolean {
		return this.state;
	}

	public lock(): void {
		this.state = true;
	}

	public unlock(): void {
		this.state = false;
	}
}
