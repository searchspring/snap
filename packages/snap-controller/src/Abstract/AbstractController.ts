import { LogMode } from '@searchspring/snap-logger';
import { DomTargeter } from '@searchspring/snap-toolbox';

import type { ControllerServices, ControllerConfig, Attachments } from '../types';
import type { Client } from '@searchspring/snap-client';
import type { AbstractStore } from '@searchspring/snap-store-mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { EventManager, Middleware } from '@searchspring/snap-event-manager';
import type { Profiler } from '@searchspring/snap-profiler';
import type { Logger } from '@searchspring/snap-logger';
import type { Tracker } from '@searchspring/snap-tracker';
import type { Target, OnTarget } from '@searchspring/snap-toolbox';

export abstract class AbstractController {
	public config: ControllerConfig;
	public client;
	public store: AbstractStore;
	public urlManager: UrlManager;
	public eventManager: EventManager;
	public profiler: Profiler;
	public log: Logger;
	public tracker: Tracker;
	public targets: {
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
		this.environment = process.env.NODE_ENV as LogMode;
	}

	public createTargeter(target: Target, onTarget: OnTarget, document?: Document): DomTargeter {
		const targeter = new DomTargeter([target], onTarget, document);
		this.targets[target.selector] = targeter;

		return targeter;
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
		Object.keys(this.targets).forEach((target) => {
			this.targets[target].retarget();
		});
	}

	public abstract search(): Promise<void>;

	public async plugin(func: (cntrlr: AbstractController) => Promise<void>): Promise<void> {
		await func(this);
	}

	public on<T>(event: string, ...func: Middleware<T>[]): void {
		this.eventManager.on(event, ...func);
	}

	public use(attachments: Attachments): void {
		// TODO: ensure config middleware is proper type
		// attach middleware
		if (attachments?.plugin) {
			let pluginArray;
			if (Array.isArray(attachments.plugin)) {
				pluginArray = attachments.plugin;
			} else {
				pluginArray = [attachments.plugin];
			}

			pluginArray.forEach((plugin) => {
				this.plugin(plugin);
			});
		}

		if (attachments?.on) {
			Object.keys(attachments.on).forEach((eventName) => {
				const eventMiddleware = attachments.on[eventName];
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
