import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';

import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager, Middleware, Next } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { MockClient } from '@searchspring/snap-shared';
import { DomTargeter } from '@searchspring/snap-toolbox';

import { AbstractController } from './AbstractController';
import type { ControllerConfig } from '../types';

describe('Search Controller', () => {
	const globals = { siteId: 'ga9kq2' };

	let controllerConfigDefault: ControllerConfig = {
		id: 'abstract',
	};

	class TestController extends AbstractController {
		async search() {
			return;
		}
	}

	let searchConfig: ControllerConfig;
	const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
	const services = { urlManager };

	beforeEach(() => {
		searchConfig = { ...controllerConfigDefault };
		searchConfig.id = uuidv4().split('-').join('');
	});

	it('throws if invalid config', async () => {
		expect(() => {
			// @ts-ignore
			const controller = new TestController(
				// @ts-ignore
				{ id: 123 },
				{
					client: new MockClient(globals, {}),
					store: new SearchStore(searchConfig, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				}
			);
		}).toThrow();
	});

	it('throws if invalid services', async () => {
		expect(() => {
			const controller = new TestController(searchConfig, {
				// @ts-ignore
				client: 'invalid',
				store: new SearchStore(searchConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
		}).toThrow();

		expect(() => {
			const controller = new TestController(searchConfig, {
				client: new MockClient(globals, {}),
				// @ts-ignore
				store: 'invalid',
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
		}).toThrow();

		expect(() => {
			const controller = new TestController(searchConfig, {
				client: new MockClient(globals, {}),
				store: new SearchStore(searchConfig, services),
				// @ts-ignore
				urlManager: 'invalid',
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
		}).toThrow();

		expect(() => {
			const controller = new TestController(searchConfig, {
				client: new MockClient(globals, {}),
				store: new SearchStore(searchConfig, services),
				urlManager,
				// @ts-ignore
				eventManager: 'invalid',
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
		}).toThrow();

		expect(() => {
			const controller = new TestController(searchConfig, {
				client: new MockClient(globals, {}),
				store: new SearchStore(searchConfig, services),
				urlManager,
				eventManager: new EventManager(),
				// @ts-ignore
				profiler: 'invalid',
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
		}).toThrow();

		expect(() => {
			const controller = new TestController(searchConfig, {
				client: new MockClient(globals, {}),
				store: new SearchStore(searchConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				// @ts-ignore
				logger: 'invalid',
				tracker: new Tracker(globals),
			});
		}).toThrow();

		expect(() => {
			const controller = new TestController(searchConfig, {
				client: new MockClient(globals, {}),
				store: new SearchStore(searchConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				// @ts-ignore
				tracker: 'invalid', // invalid tracker
			});
		}).toThrow();
	});

	it('is uninitialized when constructed', async () => {
		const controller = new TestController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		expect(controller.initialized).toBe(false);
	});

	it('warns if init is recalled', async () => {
		const controller = new TestController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const spy = jest.spyOn(controller.log, 'warn');

		await controller.init();
		expect(spy).toHaveBeenCalledTimes(0);
		await controller.init();
		expect(spy).toHaveBeenCalledWith(`'init' middleware recalled`);
	});

	it('can attach middleware via controller.plugin', async () => {
		const controller = new TestController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const initfn = jest.fn();
		const paramPlugin = (controller: AbstractController) => {
			controller.on('init', async ({ controller }: { controller: AbstractController }, next: Next) => {
				initfn();
				await next();
			});
		};

		// @ts-ignore
		controller.plugin(paramPlugin);

		expect(initfn).not.toHaveBeenCalled();

		await controller.init();

		expect(initfn).toHaveBeenCalled();
	});

	it('can attach middleware via controller.use', async () => {
		const controller = new TestController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const initfn = jest.fn();

		const initMiddleware: Middleware<{ controller: AbstractController }> = async ({ controller }: { controller: AbstractController }, next: Next) => {
			initfn();
			await next();
		};

		const plugin = (controller: AbstractController) => {
			controller.on('init', async ({ controller }: { controller: AbstractController }, next: Next) => {
				initfn();
				await next();
			});
		};

		const paramPlugin = (controller: AbstractController, ...params: any[]) => {
			controller.on('init', async ({ controller }: { controller: AbstractController }, next: Next) => {
				initfn();
				await next();
			});
		};

		controller.use({
			middleware: {
				init: [initMiddleware],
			},
			plugins: [
				// @ts-ignore
				[plugin],
				// @ts-ignore
				[paramPlugin, 'param1', 'param2'],
			],
		});

		expect(initfn).not.toHaveBeenCalled();

		await controller.init();

		expect(initfn).toHaveBeenCalledTimes(3);
	});

	it('throws if controller.use is invalid format', async () => {
		const controller = new TestController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});
		const initfn = jest.fn();
		const spy = jest.spyOn(controller.log, 'warn');

		const plugin = (controller: AbstractController) => {
			controller.on('init', async ({ controller }: { controller: AbstractController }, next: Next) => {
				initfn();
				await next();
			});
		};

		// test if plugins is not an array
		controller.use({
			// @ts-ignore
			plugins: plugin,
		});
		expect(spy).toHaveBeenCalledWith('plugins not attached - use format [func, ...args?][]');
		spy.mockClear();

		// test if plugins is not an array of arrays
		controller.use({
			plugins: [
				// @ts-ignore
				plugin,
			],
		});
		expect(spy).toHaveBeenCalledWith('plugins not attached - use format [func, ...args?][]');
		spy.mockClear();

		// test if middleware is not an array (should be converted to an array internally)
		const initMiddleware: Middleware<{ controller: AbstractController }> = async ({ controller }: { controller: AbstractController }, next: Next) => {
			initfn();
			await next();
		};

		controller.use({
			middleware: {
				init: initMiddleware,
			},
		});
		await controller.init();
		expect(initfn).toBeCalledTimes(1);
	});

	it('can create a targeter', () => {
		const controller = new TestController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.createTargeter(
			{
				name: 'newtarget',
				selector: 'ss__dne',
			},
			() => {
				// will not run
			}
		);

		expect(controller.targeters).toHaveProperty('newtarget');
	});

	it('can create a targeter', () => {
		const controller = new TestController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.createTargeter(
			{
				name: 'newTargeter',
				selector: 'ss__dne',
			},
			() => {
				// will not run
			}
		);

		expect(controller.targeters).toHaveProperty('newTargeter');
	});

	it('can add a targeter', () => {
		const controller = new TestController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		const targeter = new DomTargeter(
			[
				{
					name: 'addedTargeter',
					selector: 'ss__dne',
				},
			],
			() => {
				// will not run
			}
		);

		controller.addTargeter(targeter);

		expect(controller.targeters).toHaveProperty('addedTargeter');
	});

	it('can call retarget on all targeters', () => {
		const controller = new TestController(searchConfig, {
			client: new MockClient(globals, {}),
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.createTargeter(
			{
				name: 'newTargeter',
				selector: 'ss__dne',
			},
			() => {
				// will not run
			}
		);

		expect(controller.targeters).toHaveProperty('newTargeter');

		const targeter = new DomTargeter(
			[
				{
					name: 'addedTargeter',
					selector: 'ss__dne',
				},
			],
			() => {
				// will not run
			}
		);

		controller.addTargeter(targeter);

		expect(controller.targeters).toHaveProperty('addedTargeter');

		const retargetFn = jest.fn();

		// mocking target functions of controller targeters
		controller.targeters.newTargeter.retarget = retargetFn;
		controller.targeters.addedTargeter.retarget = retargetFn;

		controller.retarget();

		expect(retargetFn).toHaveBeenCalledTimes(2);
	});
});
