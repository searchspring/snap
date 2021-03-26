import { UrlTranslator, UrlState } from '../types';

import Immutable from 'seamless-immutable';
import { ImmutableObject } from 'seamless-immutable';

//
//import { checkState } from './typecheck';
//
//console.log('??', process.env.NODE_ENV);
//
const arrayConcatMerger = (current: unknown, other: unknown) => {
	if (current instanceof Array && other instanceof Array) {
		return [...current, ...other];
	}
};

class WatcherPool {
	private callbacks: Array<() => void> = [];

	constructor() {
		// nothing to do here
	}

	subscribe(cb: () => void) {
		this.callbacks.push(cb);

		return () => (this.callbacks = this.callbacks.filter((_cb) => _cb != cb));
	}

	notify() {
		this.callbacks.forEach((cb) => cb());
	}
}

export default class UrlManager {
	private translator: UrlTranslator;

	private urlState: ImmutableObject<UrlState> = Immutable({}) as ImmutableObject<UrlState>;
	private localState: ImmutableObject<UrlState> = Immutable({}) as ImmutableObject<UrlState>;
	private mergedState: ImmutableObject<UrlState> = Immutable({}) as ImmutableObject<UrlState>;

	private prevState?: ImmutableObject<UrlState>;

	private watcherPool: WatcherPool;

	constructor(
		translator: UrlTranslator,
		public linker?: (urlManager: UrlManager) => Record<string, unknown>,
		localState?: UrlState | ImmutableObject<UrlState>,
		watcherPool?: WatcherPool,
		private omissions: Array<Array<string>> = [],
		private detached?: { url: string }
	) {
		this.localState = Immutable(localState || {});

		this.translator = translator;

		if (watcherPool) {
			this.watcherPool = watcherPool;
		} else {
			this.watcherPool = new WatcherPool();

			if (this.translator.bindExternalEvents instanceof Function) {
				this.translator.bindExternalEvents(() => this.watcherPool.notify());
			}
		}

		this.subscribe(() => {
			this.refresh();
		});

		this.refresh();
	}

	private without(obj: ImmutableObject<UrlState>, fullPath: Array<string>) {
		const path = fullPath.slice(0, -1);
		const value = fullPath[fullPath.length - 1];

		if (!path.length) {
			return obj.without(value);
		}

		if (!obj.getIn(path)) {
			return obj;
		}

		return obj.updateIn(path, (node: ImmutableObject<any>) => {
			if (node instanceof Array) {
				return node.filter((_value) => _value != value);
			}

			if (typeof node == 'object') {
				return node.without(value);
			}
		});
	}

	private getTranslatorUrl(): string {
		if (this.detached) {
			return this.detached.url;
		}

		return this.translator.getCurrentUrl();
	}

	refresh(): void {
		this.prevState = this.mergedState;

		this.urlState = this.omissions.reduce((state: ImmutableObject<UrlState>, om: Array<string>) => {
			return this.without(state, om);
		}, Immutable(this.translator.deserialize(this.getTranslatorUrl())));

		this.mergedState = this.urlState.merge(this.localState, {
			deep: true,
			merger: arrayConcatMerger,
		});
	}

	get state(): ImmutableObject<UrlState> {
		return this.mergedState;
	}

	private unpackPathAndState(stateOrPath: any, _state?: any) {
		const path = stateOrPath instanceof Array ? stateOrPath : typeof stateOrPath == 'string' ? stateOrPath.split('.') : [];

		const state = !(stateOrPath instanceof Array) && typeof stateOrPath == 'object' ? stateOrPath : _state === undefined ? {} : _state;

		return { path, state };
	}

	private getPathsFromObj(...args: Array<unknown>): Array<Array<string>> {
		const { path, state } = this.unpackPathAndState(args[0], args[1]);

		if (!path.length) {
			return Object.keys(state).map((k) => [k]);
		}

		return Object.keys(state).reduce((acc: Array<Array<string>>, key: string): Array<Array<string>> => {
			const value: unknown = state[key];

			if (value instanceof Array) {
				return [...acc, path.concat([key])];
			} else if (typeof value == 'object') {
				return [...acc, ...this.getPathsFromObj(path.concat(key), value)];
			}

			return [...acc, path.concat([key])];
		}, []);
	}

	set(...args: Array<unknown>): UrlManager {
		const { path, state } = this.unpackPathAndState(args[0], args[1]);

		const newState = path.length ? this.localState.setIn(path, state) : state;

		const omissions = this.omissions.concat(path.length ? [path] : this.getPathsFromObj(this.urlState), this.getPathsFromObj(path, state));

		return new UrlManager(this.translator, this.linker, newState, this.watcherPool, omissions, this.detached);
	}

	merge(...args: Array<unknown>): UrlManager {
		const { path, state } = this.unpackPathAndState(args[0], args[1]);

		const newState = path.length
			? this.localState.updateIn(path, (oldState: any) => {
					if (oldState instanceof Array) {
						return oldState.concat(state);
					} else if (typeof oldState == 'object') {
						return oldState.merge(state, { deep: true, merger: arrayConcatMerger });
					} else if (typeof oldState != 'undefined') {
						return [oldState].concat([state]);
					}

					return state;
			  })
			: this.localState.merge(state, { deep: true, merger: arrayConcatMerger });

		return new UrlManager(this.translator, this.linker, newState, this.watcherPool, this.omissions, this.detached);
	}

	remove(_path: string | Array<string>): UrlManager {
		const path: Array<string> = _path instanceof Array ? _path : _path.split('.');

		return new UrlManager(
			this.translator,
			this.linker,
			this.without(this.localState, path),
			this.watcherPool,
			this.omissions.concat([path]),
			this.detached
		);
	}

	reset(): UrlManager {
		return new UrlManager(
			this.translator,
			this.linker,
			{},
			this.watcherPool,
			Object.keys(this.urlState).map((k) => [k]),
			this.detached
		);
	}

	withConfig(config: Record<string, unknown> | ((config: Record<string, unknown>) => Record<string, unknown>)): UrlManager {
		if (config instanceof Function) {
			config = config(this.translator.getConfig());
		}

		return new UrlManager(
			new (Object.getPrototypeOf(this.translator).constructor)(config),
			this.linker,
			this.localState,
			this.watcherPool,
			this.omissions,
			this.detached
		);
	}

	getTranslatorConfig(): Record<string, unknown> {
		return this.translator.getConfig();
	}

	get href(): string {
		return this.translator.serialize(this.state as UrlState);
	}

	go(): void {
		if (this.detached) {
			this.detached.url = this.href;
		} else {
			this.translator.go(this.href);
		}

		this.watcherPool.notify();
	}

	detach(reset = false): UrlManager {
		return new UrlManager(this.translator, this.linker, this.localState, new WatcherPool(), this.omissions, {
			url: reset ? '' : this.getTranslatorUrl(),
		});
	}

	get link(): Record<string, any> {
		if (!this.linker) {
			return {};
		}

		return this.linker(this);
	}

	subscribe(cb: (next: ImmutableObject<UrlState>, prev?: ImmutableObject<UrlState>) => void) {
		return this.watcherPool.subscribe(() => {
			const prevState = this.prevState;
			const state = this.mergedState;

			cb(state, prevState);
		});
	}
}
