import { observable, action, makeObservable } from 'mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { StoreServices } from '../../types';

export class StateStore {
	locks: {
		terms: Lock;
		facets: Lock;
	};
	focusedInput: HTMLInputElement | undefined = undefined;
	input = '';
	url: UrlManager;

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

	reset(): void {
		this.input = '';
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

	reset(): void {
		this.state = this.startState;
	}

	get locked(): boolean {
		return this.state;
	}

	lock(): void {
		this.state = true;
	}

	unlock(): void {
		this.state = false;
	}
}
