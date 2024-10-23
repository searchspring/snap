import { pluginBackgroundFilters } from './pluginBackgroundFilters';
import { MockClient } from '@searchspring/snap-shared';
import { SearchStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { SearchController } from '@searchspring/snap-controller';
import { PluginBackgroundFilter, PluginControl } from '../types';

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager: urlManager,
};
let searchConfig = {
	id: 'search',
};

const globals = { siteId: '8uyt2m' };
const searchConfigDefault = {
	id: 'search',
	globals: {
		filters: [],
	},
	settings: {},
};
let controller: any;
let errorLogMock: any;

// function to recreate fresh services for each test (otherwise globals are shared)
const createControllerServices = () => {
	return {
		client: new MockClient(globals, {}),
		store: new SearchStore(searchConfig, services),
		urlManager,
		eventManager: new EventManager(),
		profiler: new Profiler(),
		logger: new Logger(),
		tracker: new Tracker(globals),
	};
};

describe('common/pluginBackgroundFilters', () => {
	beforeEach(() => {
		searchConfig = { ...searchConfigDefault };
		controller = new SearchController(searchConfig, createControllerServices());
		errorLogMock = jest.spyOn(controller.log, 'error').mockImplementation(() => {});
		expect(controller.config.globals).toBeDefined();
		expect(controller.config.globals!.filters).toEqual([]);
		expect(errorLogMock).not.toHaveBeenCalled();
	});

	afterEach(() => {
		errorLogMock.mockClear();
		expect(errorLogMock).not.toHaveBeenCalled();
	});

	it('it has background filters on globals via config', async () => {
		const filters: (PluginBackgroundFilter & PluginControl)[] = [
			{
				type: 'value',
				field: 'color',
				value: 'red',
			},
			{
				type: 'range',
				field: 'price',
				value: { low: 10, high: 20 },
			},
		];
		pluginBackgroundFilters(controller, { filters });
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual(filters.map((filter) => ({ ...filter, background: true })));
		expect(errorLogMock).not.toHaveBeenCalled();
	});

	it('it has background filters only to applicable controllerIds', async () => {
		const filters: (PluginBackgroundFilter & PluginControl)[] = [
			{
				type: 'value',
				field: 'color',
				value: 'red',
				controllerIds: ['search', 'autocomplete'],
			},
			{
				type: 'value',
				field: 'brand',
				value: 'nike',
				controllerIds: [/^se.*ch$/],
			},
			{
				type: 'range',
				field: 'price',
				value: { low: 10, high: 20 },
				controllerIds: ['autocomplete'],
			},
		];
		pluginBackgroundFilters(controller, { filters });
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual(
			filters.slice(0, 2).map((filter) => {
				const filterObj = { ...filter, background: true };
				delete filterObj.controllerIds;
				return filterObj;
			})
		);
		expect(errorLogMock).not.toHaveBeenCalled();
	});

	it('it has background filters only to applicable controllerTypes', async () => {
		const filters: (PluginBackgroundFilter & PluginControl)[] = [
			{
				type: 'value',
				field: 'color',
				value: 'red',
				controllerTypes: ['search', 'autocomplete', 'recommendation'],
			},
			{
				type: 'value',
				field: 'brand',
				value: 'nike',
				// @ts-ignore - bad controller type
				controllerTypes: ['dne'],
			},
			{
				type: 'range',
				field: 'price',
				value: { low: 10, high: 20 },
				controllerTypes: ['recommendation', 'autocomplete'], // should not match
			},
		];
		pluginBackgroundFilters(controller, { filters });
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual(
			filters.slice(0, 1).map((filter) => {
				const filterObj = { ...filter, background: true };
				delete filterObj.controllerTypes;
				return filterObj;
			})
		);
		expect(errorLogMock).not.toHaveBeenCalled();
	});

	it('it error logs invalid background filter', async () => {
		const filters: (PluginBackgroundFilter & PluginControl)[] = [
			{
				type: 'value',
				field: 'color',
				value: '', // no value to make this invalid
			},
		];
		pluginBackgroundFilters(controller, { filters });
		await controller.init();

		expect(controller.config.globals!.filters).toEqual([]);
		expect(errorLogMock).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
	});

	it('it has background filters from context and config', async () => {
		const filters: (PluginBackgroundFilter & PluginControl)[] = [
			{
				type: 'value',
				field: 'color',
				value: 'red',
			},
			{
				type: 'range',
				field: 'price',
				value: { low: 10, high: 20 },
			},
		];
		const contextMock = {
			backgroundFilters: filters,
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);

		expect(controller.context.backgroundFilters).toStrictEqual(filters);

		pluginBackgroundFilters(controller, { filters });
		await controller.init();

		expect(controller.config.globals!.filters).toStrictEqual([
			...filters.map((filter) => ({ ...filter, background: true })),
			...contextMock.backgroundFilters.map((filter) => ({ ...filter, background: true })),
		]);
		expect(errorLogMock).not.toHaveBeenCalled();
	});

	it('it has invalid background filters', async () => {
		const filters = {
			// not an array
			type: 'value',
			field: 'color',
			value: 'red',
		};

		const contextMock = {
			backgroundFilters: filters,
		};
		const controller = new SearchController(searchConfig, createControllerServices(), contextMock);
		const warnLogMock = jest.spyOn(controller.log, 'warn').mockImplementation(() => {});

		expect(controller.context.backgroundFilters).toStrictEqual(filters);

		pluginBackgroundFilters(controller, { filters: [] });
		await controller.init();

		expect(controller.config.globals!.filters).toEqual([]);
		expect(warnLogMock).toHaveBeenCalledWith(expect.any(String));
	});
});
