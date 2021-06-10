import { Tracker } from '@searchspring/snap-tracker';
import type { EventManager, Middleware } from '@searchspring/snap-event-manager';

import type { ControllerServices } from '../types';

enum ControllerEnvironment {
	PRODUCTION = 'production',
	DEVELOPMENT = 'development',
}

type ControllerConfig = {
	id: string;
};
export abstract class AbstractController {
	public config: ControllerConfig;
	public client;
	public store;
	public urlManager;
	public eventManager: EventManager;
	public profiler;
	public log;
	public tracker: Tracker;
	private _environment = ControllerEnvironment.PRODUCTION;

	constructor(config: ControllerConfig, { client, store, urlManager, eventManager, profiler, logger, tracker }: ControllerServices) {
		if (typeof config != 'object' || typeof config.id != 'string' || !config.id.match(/^[a-zA-Z0-9_]*$/)) {
			throw new Error(`Invalid config passed to controller. The "id" attribute must be an alphanumeric string.`);
		}

		if (typeof client != 'object' || typeof client.search != 'function') {
			throw new Error(`Invalid service 'client' passed to controller. Missing "search" function.`);
		}

		if (typeof store != 'object' || typeof store.link != 'function') {
			throw new Error(`Invalid service 'store' passed to controller. Missing "link" function.`);
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
			throw new Error(`Invalid service 'tracking' passed to controller. Missing "track" object.`);
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
		this.log.setGroup(this.config.id);

		// link the controller to the store
		this.store.link(this);

		// set namespaces
		this.profiler.setNamespace(this.config.id);

		if (!this.tracker.namespace) {
			this.tracker.setNamespace(this.config.id);
		}
		// set environment
		this.environment = process.env.NODE_ENV as ControllerEnvironment;
	}

	public set environment(env: ControllerEnvironment) {
		if (Object.values(ControllerEnvironment).includes(env)) {
			this._environment = env;
			this.log.setMode(env);
		}
	}

	public get environment(): ControllerEnvironment {
		return this._environment;
	}

	public async init(): Promise<void> {
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

		initProfile.stop();
		this.log.profile(initProfile);
	}

	public abstract search(): Promise<AbstractController>;

	public async use(func: (cntrlr: AbstractController) => Promise<void>): Promise<void> {
		await func(this);
	}

	public on<T>(event: string, ...func: Middleware<T>[]): void {
		this.eventManager.on(event, ...func);
	}
}
