import { LogMode } from '@searchspring/snap-logger';
import { DomTargeter, cookies } from '@searchspring/snap-toolbox';

import { URL } from '../utils/URL';

import type { Client } from '@searchspring/snap-client';
import type { AbstractStore } from '@searchspring/snap-store-mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { EventManager, Middleware } from '@searchspring/snap-event-manager';
import type { Profiler } from '@searchspring/snap-profiler';
import type { Logger } from '@searchspring/snap-logger';
import type { Tracker } from '@searchspring/snap-tracker';
import type { Target, OnTarget } from '@searchspring/snap-toolbox';

import type { ControllerServices, ControllerConfig, Attachments } from '../types';

const SS_DEV_COOKIE = 'ssdev';
export abstract class AbstractController {
	public id: string;
	public type = 'abstract';
	public config: ControllerConfig;
	public client; //todo: add typing
	public store: AbstractStore;
	public urlManager: UrlManager;
	public eventManager: EventManager;
	public profiler: Profiler;
	public log: Logger;
	public tracker: Tracker;
	public targeters: {
		[key: string]: DomTargeter;
	} = {};

	private _initialized = false;
	private _environment = LogMode.PRODUCTION;

	get initialized(): boolean {
		return this._initialized;
	}

	constructor(config: ControllerConfig, { client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices) {
		if (typeof config != 'object' || typeof config.id != 'string' || !config.id.match(/^[a-zA-Z0-9_]*$/)) {
			throw new Error(`Invalid config passed to controller. The "id" attribute must be an alphanumeric string.`);
		}

		if (typeof client != 'object' || typeof client.search != 'function') {
			throw new Error(`Invalid service 'client' passed to controller. Missing "search" function.`);
		}

		if (typeof store != 'object' || typeof store.update != 'function') {
			throw new Error(`Invalid service 'store' passed to controller. Missing "update" function.`);
		}

		if (typeof urlManager != 'object' || typeof urlManager.subscribe != 'function') {
			throw new Error(`Invalid service 'urlManager' passed to controller. Missing "subscribe" function.`);
		}

		if (typeof eventManager != 'object' || typeof eventManager.on != 'function') {
			throw new Error(`Invalid service 'eventManager' passed to controller. Missing "on" function.`);
		}

		if (typeof eventManager != 'object' || typeof eventManager.fire != 'function') {
			throw new Error(`Invalid service 'eventManager' passed to controller. Missing "fire" function.`);
		}

		if (typeof profiler != 'object' || typeof profiler.setNamespace != 'function') {
			throw new Error(`Invalid service 'profiler' passed to controller. Missing "setNamespace" function.`);
		}

		if (typeof profiler != 'object' || typeof profiler.create != 'function') {
			throw new Error(`Invalid service 'profiler' passed to controller. Missing "create" function.`);
		}

		if (typeof logger != 'object' || typeof logger.dev != 'function') {
			throw new Error(`Invalid service 'logger' passed to controller. Missing "dev" function.`);
		}
		if (typeof tracker != 'object' || typeof tracker.track != 'object') {
			throw new Error(`Invalid service 'tracker' passed to controller. Missing "track" object.`);
		}

		window.searchspring = window.searchspring || {};
		window.searchspring.controller = window.searchspring.controller || {};

		if (window.searchspring.controller[config.id]) {
			throw new Error(`Controller with id '${config.id}' is already defined`);
		}

		window.searchspring.controller[config.id] = this;

		this.id = config.id;
		this.config = config;
		this.client = client;
		this.store = store;
		this.urlManager = urlManager;
		this.eventManager = eventManager;
		this.profiler = profiler;
		this.log = logger;
		this.tracker = tracker;

		// configure the logger
		this.log.setNamespace(this.config.id);

		// set namespaces
		this.profiler.setNamespace(this.config.id);

		if (!this.tracker.namespace) {
			this.tracker.setNamespace(this.config.id);
		}
		// set environment
		if (URL(window.location.href)?.params.query.filter((param) => param.key === 'dev').length > 0) {
			cookies.set(SS_DEV_COOKIE, '1', 'Lax', 0);
		}
		const dev = cookies.get(SS_DEV_COOKIE);
		this.environment = (dev === '1' ? 'development' : process.env.NODE_ENV) as LogMode;
	}

	public createTargeter(target: Target, onTarget: OnTarget, document?: Document): DomTargeter {
		return this.addTargeter(new DomTargeter([target], onTarget, document));
	}

	public addTargeter(target: DomTargeter): DomTargeter {
		const firstTarget = target.getTargets()[0];
		const targetName: string = (firstTarget?.name as string) ?? firstTarget?.selector;
		if (targetName && !this.targeters[targetName]) {
			this.targeters[targetName] = target;
			return target;
		}
	}

	public set environment(env: LogMode) {
		if (Object.values(LogMode).includes(env)) {
			this._environment = env;
			this.log.setMode(env);
		}
	}

	public get environment(): LogMode {
		return this._environment;
	}

	public async init(): Promise<void> {
		if (this._initialized) {
			this.log.warn(`'init' middleware recalled`);
		}
		const initProfile = this.profiler.create({ type: 'event', name: 'init', context: this.config }).start();

		try {
			try {
				await this.eventManager.fire('init', {
					controller: this,
				});
			} catch (err) {
				if (err?.message == 'cancelled') {
					this.log.warn(`'init' middleware cancelled`);
				} else {
					this.log.error(`error in 'init' middleware`);
					throw err;
				}
			}
		} catch (err) {
			if (err) {
				console.error(err);
			}
		}

		if (!this._initialized) {
			// subscribe to urlManager changes
			this.urlManager.subscribe((prev, next) => {
				try {
					const prevString = JSON.stringify(prev);
					const nextString = JSON.stringify(next);

					if (prevString !== nextString) {
						this.search();
					}
				} catch (err) {
					this.log.error('URL state is invalid', err);
				}
			});

			this._initialized = true;
		}

		initProfile.stop();
		this.log.profile(initProfile);
	}

	public retarget(): void {
		Object.keys(this.targeters).forEach((target) => {
			this.targeters[target].retarget();
		});
	}

	public abstract search(): Promise<void>;

	public async plugin(func: (cntrlr: AbstractController, ...args) => Promise<void>, ...args: unknown[]): Promise<void> {
		await func(this, ...args);
	}

	public on<T>(event: string, ...func: Middleware<T>[]): void {
		this.eventManager.on(event, ...func);
	}

	public use(attachments: Attachments): void {
		// attach plugins
		if (attachments?.plugins) {
			try {
				if (!Array.isArray(attachments?.plugins)) {
					throw 'invalid format';
				}

				attachments?.plugins.forEach((plugin) => {
					if (!Array.isArray(plugin)) {
						throw 'invalid format';
					}
					const [func, ...args] = plugin;
					this.plugin(func, ...args);
				});
			} catch (err) {
				this.log.warn('plugins not attached - use format [func, ...args?][]');
			}
		}

		// attach event middleware
		if (attachments?.middleware) {
			Object.keys(attachments.middleware).forEach((eventName) => {
				const eventMiddleware = attachments.middleware[eventName];
				let middlewareArray;
				if (Array.isArray(eventMiddleware)) {
					middlewareArray = eventMiddleware;
				} else {
					middlewareArray = [eventMiddleware];
				}
				middlewareArray.forEach((middleware) => {
					this.on(eventName, middleware);
				});
			});
		}
	}
}
