import { v4 as uuidv4 } from 'uuid';

import { FinderStore, StoreServices } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { MockClient } from '@searchspring/snap-shared';

import { FinderControllerConfig } from '../types';
import { FinderController } from './FinderController';

const globals = { siteId: 'ga9kq2' };
const configs = [
	{
		id: 'accessoriesFinder',
		url: '',
		selector: '.searchspring-finder_accessories',
		wrapSelect: true,
		type: 'ymm',
		className: 'ss-vehicle-finder',
		fields: [
			{
				field: 'ss_accessory',
				levels: ['Type', 'Year', 'Make', 'Model'],
			},
		],
	},
	{
		id: 'tiresBySize',
		url: '',
		selector: '.searchspring-finder_tires_by_size',
		wrapSelect: false,
		fields: [{ field: 'custom_tire_size_1' }, { field: 'custom_tire_size_2' }, { field: 'custom_wheel_size' }],
	},
];

describe('Finder Controller', () => {
	configs.forEach((baseConfig) => {
		const isHierarchy = 'levels' in baseConfig.fields[0];
		let urlManager: UrlManager, services: StoreServices, config: FinderControllerConfig;

		describe(`${isHierarchy ? 'Hierarchy' : 'Non-Hierarchy'} Type`, () => {
			beforeEach(() => {
				urlManager = new UrlManager(new QueryStringTranslator(), reactLinker).detach();
				services = { urlManager };

				config = Object.assign({}, baseConfig);
				config.id = uuidv4().split('-').join('');
			});

			it(`can persist selections`, async () => {
				config = {
					...config,
					persist: {
						enabled: true,
					},
				};
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				await controller.search();

				const firstSelection = controller.store.selections[0];
				const valueToSelect = firstSelection.values.filter((value: any) => value.count > 10)[0].value;
				firstSelection.select(valueToSelect);

				// save selections
				await controller.find();

				expect(controller.store.selections[0].selected).toBe(valueToSelect);

				/**
				 * Create a new controller with the same id to simulate a new page load
				 */

				const controller2 = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				expect(controller2.store.selections[0].selected).toBe(valueToSelect);

				// all selections should be disabled
				expect(controller2.config.persist?.lockSelections).toBe(true);
				controller2.store.selections.forEach((selection) => {
					expect(selection.disabled).toBe(true);
				});
			});

			it(`sets search params for 'include' and 'autoDrillDown'`, async () => {
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				(controller.client as MockClient).mockData.updateConfig({ search: 'finder.include.ss_accessory' });
				controller.init();

				const params = controller.params;
				expect(params.facets).toStrictEqual({
					include: config.fields.map((field: any) => field.field),
					autoDrillDown: false,
				});
			});

			it(`allows for config globals to overwrite / merge with default parameters`, async () => {
				config = {
					...config,
					globals: {
						facets: {
							include: ['ss-special'],
							autoDrillDown: true,
						},
					},
				};
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				(controller.client as MockClient).mockData.updateConfig({ search: 'finder.include.ss_accessory' });
				controller.init();

				const params = controller.params;
				expect(params.facets).toStrictEqual({
					include: config.fields.map((field: any) => field.field).concat('ss-special'),
					autoDrillDown: true,
				});
			});

			it(`sets root URL params`, async () => {
				config.url = '/search/accessories';
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				(controller.client as MockClient).mockData.updateConfig({ search: 'finder.include.ss_accessory' });
				controller.init();

				expect(controller.urlManager.href).toContain(controller.config.url);
			});

			it('can make selection', async () => {
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				if (isHierarchy) {
					(controller.client as MockClient).mockData.updateConfig({ search: 'finder.include.ss_accessory' });
					controller.init();
					await controller.search();

					expect(controller.store.selections.length).toBe(config.fields[0].levels?.length);

					controller.store.selections.forEach((selection, index) => {
						expect(selection.display).toBe('hierarchy');
						if (index === 0) {
							expect(selection.disabled).toBe(false);
						} else {
							expect(selection.disabled).toBe(true);
						}
					});
					const firstSelection = controller.store.selections[0];
					const field = firstSelection.field;
					const valueToSelect = firstSelection.values.filter((value: any) => value.count > 10)[0].value;

					jest.spyOn(controller, 'search');
					controller.store.selections[0].select(valueToSelect);
					expect(controller.search).toHaveBeenCalled();
					expect(controller.urlManager.state.filter).toEqual({ [field]: [valueToSelect] });
					expect(controller.store.selections[0].field).toBe(field);
					expect(controller.store.selections[0].selected).toBe(valueToSelect);
				} else {
					controller.init();
					await controller.search();

					expect(controller.store.selections.length).toBe(config.fields.length);

					controller.store.selections.forEach((selection) => {
						expect(selection.disabled).toBe(false);
					});
					const firstSelection = controller.store.selections[0];
					const field = firstSelection.field;
					const valueToSelect = firstSelection.values.filter((value: any) => value.count > 10)[0].value;

					jest.spyOn(controller, 'search');
					controller.store.selections[0].select(valueToSelect);
					expect(controller.search).toHaveBeenCalled();

					expect(controller.urlManager.state.filter).toEqual({ [field]: [valueToSelect] });
					expect(controller.store.selections[0].field).toBe(field);
					expect(controller.store.selections[0].selected).toBe(valueToSelect);
				}
			});

			it('can invoke find method', async () => {
				config.url = '/search/accessories';
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});
				(controller.client as MockClient).mockData.updateConfig({ search: 'finder.include.ss_accessory' });
				controller.init();
				await controller.search();

				//@ts-ignore
				delete window.location;
				window.location = {
					...window.location,
					href: '', // jest does not support window location changes
				};

				const beforeFindfn = jest.spyOn(controller.eventManager, 'fire');
				await controller.find();

				expect(beforeFindfn).toHaveBeenCalledWith('beforeFind', { controller });

				expect(window.location.href).toContain(controller.urlManager.href);

				beforeFindfn.mockClear();
			});

			const events = ['beforeSearch', 'afterSearch', 'afterStore'];
			events.forEach((event) => {
				it(`tests ${event} middleware err handled`, async () => {
					const controller = new FinderController(config, {
						client: new MockClient(globals, {}),
						store: new FinderStore(config, services),
						urlManager,
						eventManager: new EventManager(),
						profiler: new Profiler(),
						logger: new Logger(),
						tracker: new Tracker(globals),
					});

					controller.on(event, () => false); // return false to stop middleware
					const spy = jest.spyOn(controller.log, 'warn');

					controller.init();
					await controller.search();

					expect(spy).toHaveBeenCalledWith(`'${event}' middleware cancelled`);
					spy.mockClear();
				});
			});

			it(`tests beforeFind middleware err handled`, async () => {
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				const event = 'beforeFind';
				controller.on(event, () => false); // return false to stop middleware
				const spy = jest.spyOn(controller.log, 'warn');

				controller.init();
				await controller.search();

				await controller.find();

				expect(spy).toHaveBeenCalledWith(`'${event}' middleware cancelled`);
				spy.mockClear();
			});

			it('can call reset method', async () => {
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});
				controller.init();
				await controller.search();

				const firstSelection = controller.store.selections[0];
				const field = firstSelection.field;
				const valueToSelect = firstSelection.values.filter((value: any) => value.count > 10)[0].value;

				controller.store.selections[0].select(valueToSelect);
				expect(controller.urlManager.state.filter).toEqual({ [field]: [valueToSelect] });
				expect(controller.store.selections[0].field).toBe(field);
				expect(controller.store.selections[0].selected).toBe(valueToSelect);
				expect(controller.store.selections[0].values).not.toBe(controller.store.selections[1].values);

				controller.reset();
				await controller.search(); // reset() calls search() however is async, call again to assert
				expect(controller.urlManager.state.filter).not.toBeDefined();
				expect(controller.store.selections[0].field).toBe(field);
				expect(controller.store.selections[0].selected).toBeFalsy();

				// re-select
				controller.store.selections[0].select(valueToSelect);
				expect(controller.urlManager.state.filter).toEqual({ [field]: [valueToSelect] });
				expect(controller.store.selections[0].field).toBe(field);
				expect(controller.store.selections[0].selected).toBe(valueToSelect);
				expect(controller.store.selections[0].values).not.toBe(controller.store.selections[1].values);
			});

			const middlewareEvents = ['beforeSearch', 'afterSearch', 'afterStore'];
			middlewareEvents.forEach((event) => {
				it(`logs error if middleware throws in ${event}`, async () => {
					const controller = new FinderController(config, {
						client: new MockClient(globals, {}),
						store: new FinderStore(config, services),
						urlManager,
						eventManager: new EventManager(),
						profiler: new Profiler(),
						logger: new Logger(),
						tracker: new Tracker(globals),
					});

					const middleware = jest.fn(() => {
						throw new Error('middleware error');
					});
					controller.on(event, middleware);

					expect(middleware).not.toHaveBeenCalled();

					const logErrorfn = jest.spyOn(controller.log, 'error');
					await controller.search();

					expect(middleware).toHaveBeenCalledTimes(1);
					expect(logErrorfn).toHaveBeenCalledWith(`error in '${event}' middleware`);

					logErrorfn.mockClear();
				});
			});

			it(`logs error if middleware throws in beforeFind`, async () => {
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				const event = 'beforeFind';
				const middleware = jest.fn(() => {
					throw new Error('middleware error');
				});
				controller.on(event, middleware);

				expect(middleware).not.toHaveBeenCalled();

				const logErrorfn = jest.spyOn(controller.log, 'error');
				controller.init();
				await controller.search();

				await controller.find();

				expect(middleware).toHaveBeenCalledTimes(1);
				expect(logErrorfn).toHaveBeenCalledWith(`error in '${event}' middleware`);

				logErrorfn.mockClear();
			});

			it('logs error if 429', async () => {
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				const handleError = jest.spyOn(controller, 'handleError');

				controller.client.finder = jest.fn(() => {
					throw 429;
				});

				await controller.search();

				expect(controller.store.error).toStrictEqual({
					code: 429,
					type: 'warning',
					message: 'Too many requests try again later',
				});

				expect(handleError).toHaveBeenCalledWith(429);
				handleError.mockClear();
			});

			it('logs error if 500', async () => {
				const controller = new FinderController(config, {
					client: new MockClient(globals, {}),
					store: new FinderStore(config, services),
					urlManager,
					eventManager: new EventManager(),
					profiler: new Profiler(),
					logger: new Logger(),
					tracker: new Tracker(globals),
				});

				const handleError = jest.spyOn(controller, 'handleError');

				controller.client.finder = jest.fn(() => {
					throw 500;
				});

				await controller.search();

				expect(controller.store.error).toStrictEqual({
					code: 500,
					type: 'error',
					message: 'Invalid Search Request or Service Unavailable',
				});

				expect(handleError).toHaveBeenCalledWith(500);
				handleError.mockClear();
			});
		});
	});
});
