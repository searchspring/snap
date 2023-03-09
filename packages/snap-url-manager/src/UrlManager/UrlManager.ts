import { Translator, TranslatorConfig, UrlState } from '../types';

import Immutable from 'seamless-immutable';
import type { ImmutableObject } from 'seamless-immutable';

type omission = {
	path: Array<string>;
	values?: Array<any>;
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

export class UrlManager {
	private translator: Translator;

	urlState: ImmutableObject<UrlState> = Immutable({}) as ImmutableObject<UrlState>;
	private globalState: ImmutableObject<UrlState> = Immutable({}) as ImmutableObject<UrlState>;
	private localState: ImmutableObject<UrlState> = Immutable({}) as ImmutableObject<UrlState>;
	private mergedState: ImmutableObject<UrlState> = Immutable({}) as ImmutableObject<UrlState>;

	private prevState?: ImmutableObject<UrlState>;

	private watcherPool: WatcherPool;

	constructor(
		translator: Translator,
		public linker?: (urlManager: UrlManager) => Record<string, unknown>,
		globalState?: UrlState | ImmutableObject<UrlState>,
		localState?: UrlState | ImmutableObject<UrlState>,
		watcherPool?: WatcherPool,
		private omissions: Array<omission> = [],
		public detached?: { url: string }
	) {
		this.localState = Immutable(localState || {});
		this.globalState = Immutable(globalState || {});

		this.translator = translator;

		// set globals based on urlRoot of translator config when serializeUrlRoot is set
		const translatorConfig = this.getTranslatorConfig();
		if (translatorConfig.urlRoot && translatorConfig.settings?.serializeUrlRoot) {
			this.globalState = this.globalState.merge(Immutable(this.translator.deserialize(translatorConfig.urlRoot as string)), {
				deep: true,
				merger: arrayConcatMerger,
			});
		}

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

	private without(obj: ImmutableObject<UrlState>, fullPath: Array<string>, values?: Array<unknown>): ImmutableObject<UrlState> {
		// TODO: refactor - find way to remove updateNode function

		const path = fullPath.slice(0, -1);
		const lastKey = fullPath[fullPath.length - 1];

		if (!path.length) {
			if (!values?.length) {
				return obj.without(lastKey);
			}

			return updateNode(lastKey, obj);
		}

		if (!obj.getIn(path)) {
			return obj;
		}

		return obj.updateIn(path, (node: ImmutableObject<any>) => {
			return updateNode(lastKey, node);
		});

		function updateNode(key: string, node: ImmutableObject<any>): ImmutableObject<any> {
			if (node[lastKey] === undefined) {
				return node;
			}

			if (node[lastKey] instanceof Array) {
				if (!values || !values.length) {
					return node.without(lastKey);
				}

				return node.set(
					lastKey,
					node[lastKey].filter((value: any) => {
						return !values.some((removeValue) => {
							return compareObjects(value, removeValue);
						});
					})
				);
			}

			if (typeof node == 'object') {
				return node.without(lastKey);
			}

			return node;
		}
	}

	private getTranslatorUrl(): string {
		if (this.detached) {
			return this.detached.url;
		}

		return this.translator.getCurrentUrl();
	}

	refresh(): void {
		this.prevState = this.mergedState;

		this.urlState = this.omissions.reduce((state: ImmutableObject<UrlState>, om: omission) => {
			return this.without(state, om.path, om.values);
		}, Immutable(this.translator.deserialize(this.getTranslatorUrl())));

		this.mergedState = this.globalState.merge(this.urlState, {
			deep: true,
			merger: arrayConcatMerger,
		});
		this.mergedState = this.mergedState.merge(this.localState, {
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

	set(...args: Array<unknown>): UrlManager {
		const { path, state } = this.unpackPathAndState(args[0], args[1]);

		const newState = path.length ? this.localState.setIn(path, removeArrayDuplicates(state)) : removeArrayDuplicates(state);
		const omissions = removeArrayDuplicates(
			this.omissions.concat(path.length ? { path } : Object.keys(this.urlState).map((key) => ({ path: [key] })))
		);

		return new UrlManager(this.translator, this.linker, this.globalState, newState, this.watcherPool, omissions, this.detached);
	}

	merge(...args: Array<unknown>): UrlManager {
		const { path, state } = this.unpackPathAndState(args[0], args[1]);

		const newState = path.length
			? this.localState.updateIn(path, (oldState: any) => {
					if (oldState instanceof Array) {
						const newValues = Array.isArray(state) ? state : [state];
						return removeArrayDuplicates(oldState.concat(newValues));
					} else if (typeof oldState == 'object') {
						if (Array.isArray(state)) {
							return state.length ? removeArrayDuplicates([oldState].concat(state)) : oldState;
						} else {
							return oldState.merge(state, { deep: true, merger: arrayConcatMerger });
						}
					} else if (typeof oldState != 'undefined') {
						// not an object or array
						const newValues = (Array.isArray(state) ? state : [state]).filter((value) => !compareObjects(value, oldState));
						return newValues.length ? removeArrayDuplicates([oldState].concat(newValues)) : oldState;
					} else if (typeof oldState == 'undefined') {
						const urlState = this.urlState.getIn(path);
						if (urlState instanceof Array && !Array.isArray(state)) {
							return [state];
						}
					}

					return state;
			  })
			: this.localState.merge(state, { deep: true, merger: arrayConcatMerger });

		return new UrlManager(this.translator, this.linker, this.globalState, newState, this.watcherPool, this.omissions, this.detached);
	}

	remove(_path: Array<string> | string, values?: Array<any> | any): UrlManager {
		const { path } = this.unpackPathAndState(_path, {});
		values = typeof values != 'undefined' ? (values instanceof Array ? values : [values]) : [];

		const without = this.without(this.localState, path, values);
		const omissions = removeArrayDuplicates(this.omissions.concat({ path, values: values as Array<any> }));

		return new UrlManager(this.translator, this.linker, this.globalState, without, this.watcherPool, omissions, this.detached);
	}

	reset(): UrlManager {
		// reset detached url
		if (this.detached) {
			this.detached.url = '';
		}

		return new UrlManager(
			this.translator,
			this.linker,
			this.globalState,
			{},
			this.watcherPool,
			Object.keys(this.urlState).map((k) => ({ path: [k] })),
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
			this.globalState,
			this.localState,
			this.watcherPool,
			this.omissions,
			this.detached
		);
	}

	withGlobals(globals: UrlState): UrlManager {
		this.globalState = this.globalState.merge(Immutable(globals), {
			deep: true,
			merger: arrayConcatMerger,
		});

		return new UrlManager(this.translator, this.linker, this.globalState, this.localState, this.watcherPool, this.omissions, this.detached);
	}

	getTranslatorConfig(): TranslatorConfig {
		return this.translator.getConfig();
	}

	get href(): string {
		return this.translator.serialize(this.state);
	}

	go(config?: { [any: string]: unknown }): void {
		if (this.detached) {
			this.detached.url = this.href;
		} else {
			this.translator.go(this.href, config);
		}

		this.watcherPool.notify();
	}

	detach(reset = false): UrlManager {
		return new UrlManager(this.translator, this.linker, this.globalState, this.localState, new WatcherPool(), this.omissions, {
			url: reset ? '' : this.getTranslatorUrl(),
		});
	}

	get link(): Record<string, any> {
		if (!this.linker) {
			return {};
		}

		return this.linker(this);
	}

	subscribe(cb: (prev?: ImmutableObject<UrlState>, next?: ImmutableObject<UrlState>) => void): () => void {
		return this.watcherPool.subscribe(() => {
			const prevState = this.prevState;
			const state = this.mergedState;

			cb(prevState, state);
		});
	}
}

function removeArrayDuplicates(array: Array<any> | any): Array<any> | any {
	if (Array.isArray(array) && array.length) {
		return array.reduce(
			(accu, item) => {
				if (!accu.some((keep: unknown) => compareObjects(keep, item))) {
					accu.push(item);
				}

				return accu;
			},
			[array[0]]
		);
	}
	return array;
}

function arrayConcatMerger(current: unknown, other: unknown): Array<any> | undefined {
	if (current instanceof Array && other instanceof Array) {
		return removeArrayDuplicates([...current, ...other]);
	}
}

function compareObjects(obj1: unknown, obj2: unknown): boolean {
	if (!obj1 && !obj2) {
		return true;
	} else if ((!obj1 && obj2) || (obj1 && !obj2)) {
		return false;
	}

	const primitives = ['string', 'number', 'boolean', 'undefined'];

	const typeA = typeof obj1;
	const typeB = typeof obj2;

	if (typeA !== typeB) return false;

	if (primitives.includes(typeA)) return obj1 === obj2;

	const isArrayA = Array.isArray(obj1);
	const isArrayB = Array.isArray(obj2);

	if (isArrayA !== isArrayB) {
		return false;
	}

	if (isArrayA) {
		// compare arrays
		if ((obj1 as Array<any>).length != (obj2 as Array<any>).length) return false;

		for (let i = 0; i < (obj1 as Array<any>).length; i++) {
			if (!compareObjects((obj1 as Array<any>)[i], (obj2 as Array<any>)[i])) {
				return false;
			}
		}
	} else {
		// compare object keys
		if (!compareObjects(Object.keys(obj1 as Record<string, any>).sort(), Object.keys(obj2 as Record<string, any>).sort())) {
			return false;
		}

		// compare object values
		let result = true;
		Object.keys(obj1 as Record<string, any>).forEach((key: string) => {
			if (!compareObjects((obj1 as Record<string, any>)[key], (obj2 as Record<string, any>)[key])) {
				result = false;
			}
		});

		return result;
	}

	return true;
}
