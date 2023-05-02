import { DomTargeter } from '@searchspring/snap-toolbox';

import type { Client } from '@searchspring/snap-client';
import type { AbstractStore } from '@searchspring/snap-store-mobx';
import type { UrlManager } from '@searchspring/snap-url-manager';
import type { EventManager, Middleware } from '@searchspring/snap-event-manager';
import type { Profiler } from '@searchspring/snap-profiler';
import type { Logger } from '@searchspring/snap-logger';
import type { Tracker, TrackErrorEvent } from '@searchspring/snap-tracker';
import type { Target, OnTarget } from '@searchspring/snap-toolbox';

import type { ControllerServices, ControllerConfig, Attachments, ContextVariables, PluginFunction } from '../types';

export abstract class AbstractController {
	public id: string;
	public type = 'abstract';
	public config: ControllerConfig;
	public client: Client;
	public store: AbstractStore;
	public urlManager: UrlManager;
	public eventManager: EventManager;
	public profiler: Profiler;
	public log: Logger;
	public tracker: Tracker;
	public context: ContextVariables;

	public targeters: {
		[key: string]: DomTargeter;
	} = {};

	protected _initialized = false;

	get initialized(): boolean {
		return this._initialized;
	}

	public handleError = (err: unknown, additionalDetails?: any): void => {
		let event: ErrorEvent | undefined;

		if (err instanceof ErrorEvent) {
			event = err;
		} else if (err instanceof Error) {
			event = new ErrorEvent('error', {
				error: err,
			});
		} else if (typeof err === 'string' || typeof err == 'number') {
			event = new ErrorEvent('error', {
				error: new Error(err.toString()),
			});
		} else if (typeof err === 'object' && Object.keys(err as object).length) {
			try {
				event = new ErrorEvent('error', {
					error: new Error(JSON.stringify(err)),
				});
			} catch (e) {}
		}

		if (event) {
			const {
				filename,
				colno,
				lineno,
				error: { stack },
				message,
				timeStamp,
			} = event;

			const beaconPayload: TrackErrorEvent = {
				filename,
				stack,
				message,
				colno,
				lineno,
				errortimestamp: timeStamp,
				details: additionalDetails ? JSON.stringify(additionalDetails) : undefined,
				context: {
					controller: {
						id: this.id,
						type: this.type,
					},
				},
			};

			this.tracker.track.error(beaconPayload);

			this.eventManager.fire('error', { controller: this, error: err });
		}
	};

	constructor(
		config: ControllerConfig,
		{ client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices,
		context: ContextVariables = {}
	) {
		if (typeof config != 'object' || typeof config.id != 'string' || !config.id.match(/^[a-zA-Z0-9_-]*$/)) {
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

		this.id = config.id;
		this.config = config;
		this.client = client;
		this.store = store;
		this.urlManager = urlManager;
		this.eventManager = eventManager;
		this.profiler = profiler;
		this.log = logger;
		this.tracker = tracker;
		this.context = context;

		// configure the logger
		this.log.setNamespace(this.config.id);

		// set namespaces
		this.profiler.setNamespace(this.config.id);
	}

	public createTargeter(target: Target, onTarget: OnTarget, document?: Document): DomTargeter | undefined {
		return this.addTargeter(new DomTargeter([target], onTarget, document));
	}

	public addTargeter(target: DomTargeter): DomTargeter | undefined {
		const firstTarget = target.getTargets()[0];
		const targetName: string = (firstTarget?.name as string) ?? firstTarget?.selector;
		if (targetName && !this.targeters[targetName]) {
			this.targeters[targetName] = target;
			return target;
		}
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
			} catch (err: any) {
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
				this.handleError(err);
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

	public async plugin(func: PluginFunction, ...args: unknown[]): Promise<void> {
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
				const eventMiddleware = attachments.middleware![eventName];
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
