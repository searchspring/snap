import { v4 as uuidv4 } from 'uuid';

import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';

import { ControllerEnvironment } from '../types';
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
			};

			// @ts-ignore
			const controller = new RecommendationController(configWithoutTag, {
				client: new MockClient(globals, {}),
				store: new RecommendationStore({}, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});
		}).toThrow();
	});

	it(`adds a test param when in development environment`, async function () {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore({}, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		controller.environment = ControllerEnvironment.DEVELOPMENT;
		expect(controller.environment).toBe('development');

		const params = controller.params;
		expect(params.test).toBeTruthy();
	});

	const events = ['beforeSearch', 'afterSearch', 'afterStore'];
	events.forEach((event) => {
		it(`tests ${event} middleware cancellation handled`, async function () {
			const controller = new RecommendationController(recommendConfig, {
				client: new MockClient(globals, {}),
				store: new RecommendationStore({}, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
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
			const controller = new RecommendationController(recommendConfig, {
				client: new MockClient(globals, {}),
				store: new RecommendationStore({}, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals),
			});

			const spy = jest.spyOn(console, 'error');
			controller.on(event, () => {
				throw 'errrrrr!';
			}); // throw an error

			controller.init();
			await controller.search();

			expect(spy).toHaveBeenCalledTimes(1);
			spy.mockClear();
		});
	});
});
