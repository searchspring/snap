import 'whatwg-fetch';
import { v4 as uuidv4 } from 'uuid';

import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger, LogMode } from '@searchspring/snap-logger';
import { RecommendationController } from './RecommendationController';
import { MockClient } from '../__mocks__/MockClient';

const globals = { siteId: '8uyt2m' };

const recommendConfig = {
	id: 'search',
	tag: 'trending',
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager,
};

describe('Recommendation Controller', () => {
	beforeEach(() => {
		recommendConfig.id = uuidv4().split('-').join('');
	});

	it(`throws an error when no tag is provided in config`, async function () {
		expect(() => {
			const configWithoutTag = {
				id: recommendConfig.id,
				tag: undefined,
			};
			const client = new MockClient(globals, {});
			// @ts-ignore
			const controller = new RecommendationController(configWithoutTag, {
				client,
				store: new RecommendationStore(configWithoutTag, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals, { client }),
			});
		}).toThrow();
	});

	it(`adds a test param when in development environment`, async function () {
		const client = new MockClient(globals, {});
		const controller = new RecommendationController(recommendConfig, {
			client,
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { client }),
		});

		controller.environment = LogMode.DEVELOPMENT;
		expect(controller.environment).toBe('development');

		const params = controller.params;
		expect(params.test).toBeTruthy();
	});

	const events = ['beforeSearch', 'afterSearch', 'afterStore'];
	events.forEach((event) => {
		it(`tests ${event} middleware cancellation handled`, async function () {
			const client = new MockClient(globals, {});
			const controller = new RecommendationController(recommendConfig, {
				client,
				store: new RecommendationStore(recommendConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals, { client }),
			});

			const spy = jest.spyOn(console, 'log');
			controller.on(event, () => false); // return false to stop middleware

			controller.init();
			await controller.search();

			expect(spy).toHaveBeenCalledTimes(1);
			spy.mockClear();

			// store should not have been updated
			if (['beforeSearch'].includes(event)) {
				expect(controller.store.results.length).toBe(0);
			}
		});
	});

	events.forEach((event) => {
		it(`tests ${event} middleware error handled`, async function () {
			const client = new MockClient(globals, {});
			const controller = new RecommendationController(recommendConfig, {
				client,
				store: new RecommendationStore(recommendConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals, { client }),
			});

			const spy = jest.spyOn(controller.log, 'error');
			controller.on(event, () => {
				throw 'errrrrr!';
			}); // throw an error

			controller.init();
			await controller.search();

			expect(spy).toHaveBeenCalledTimes(2);
			spy.mockClear();
		});
	});
});
