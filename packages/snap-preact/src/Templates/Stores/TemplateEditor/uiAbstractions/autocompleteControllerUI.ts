import { AutocompleteController } from '@searchspring/snap-controller';
import { AbstractionGroup } from '../../../../types';
import { TemplateEditorStore } from '../TemplateEditorStore';

export function autocompleteControllerUI(store: TemplateEditorStore): AbstractionGroup<AutocompleteController>[] {
	return [
		{
			title: '',
			description: '',
			controls: [
				{
					type: 'dropdown',
					label: 'History Terms',
					description: '',
					options: ['Disabled', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
					getValue: (controller: AutocompleteController) => {
						return controller.store.config.settings?.history?.enabled ? controller.store.config.settings.history.limit ?? 'Disabled' : 'Disabled';
					},
					shouldShowReset: () => {
						const initialConfig = store.initial.controller.autocomplete?.history;
						const initialEnabled = Boolean(
							initialConfig?.enabled !== undefined ? initialConfig.enabled : initialConfig?.limit && initialConfig.limit > 0
						);
						const overrideConfig = store.overrides.controller.autocomplete?.history;
						const overrideEnabled = Boolean(overrideConfig?.enabled !== undefined);

						return (overrideEnabled && initialEnabled !== overrideEnabled) || initialConfig?.limit !== overrideConfig?.limit;
					},
					onValueChange: (value, controller) => {
						const initialConfig = store.initial.controller.autocomplete?.history;
						const initialValue = initialConfig?.enabled ? initialConfig?.limit : 'Disabled';

						if (value === 'Disabled' && initialValue !== 'Disabled') {
							store.setControllerOverride({ path: ['history'], value: { enabled: false, limit: undefined, showResults: undefined }, controller });
						} else if (value !== 'Disabled' && initialValue === 'Disabled') {
							store.setControllerOverride({ path: ['history'], value: { enabled: true, limit: Number(value) }, controller });
						} else {
							store.setControllerOverride({
								path: ['history'],
								value: { enabled: undefined, limit: undefined, showResults: undefined },
								controller,
							});
						}

						updateAutocompleteControllerState(controller);
					},
					onReset: (controller) => {
						const resetValues = { enabled: undefined, limit: undefined, showResults: undefined };
						if (store.initial.controller.autocomplete?.history?.enabled) {
							delete resetValues.showResults;
						}
						store.setControllerOverride({ path: ['history'], value: resetValues, controller });
						updateAutocompleteControllerState(controller);
					},
				},
				{
					type: 'dropdown',
					label: 'Trending Terms',
					description: '',
					options: ['Disabled', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
					getValue: (controller: AutocompleteController) => {
						return controller.store.config.settings?.trending?.enabled ? controller.store.config.settings.trending.limit ?? 'Disabled' : 'Disabled';
					},
					shouldShowReset: () => {
						const initialConfig = store.initial.controller.autocomplete?.trending;
						const initialEnabled = Boolean(
							initialConfig?.enabled !== undefined ? initialConfig.enabled : initialConfig?.limit && initialConfig.limit > 0
						);
						const overrideConfig = store.overrides.controller.autocomplete?.trending;
						const overrideEnabled = Boolean(overrideConfig?.enabled !== undefined);

						return overrideEnabled && (initialEnabled !== overrideEnabled || initialConfig?.limit !== overrideConfig?.limit);
					},
					onValueChange: async (value, controller) => {
						const initialConfig = store.initial.controller.autocomplete?.trending;
						const initialValue = initialConfig?.enabled ? initialConfig?.limit : 'Disabled';

						if (value === 'Disabled' && initialValue !== 'Disabled') {
							store.setControllerOverride({ path: ['trending'], value: { enabled: false, limit: undefined, showResults: undefined }, controller });
						} else if (value !== 'Disabled' && initialValue === 'Disabled') {
							store.setControllerOverride({ path: ['trending'], value: { enabled: true, limit: Number(value) }, controller });
						} else if (value !== 'Disabled' && initialValue !== value) {
							store.setControllerOverride({ path: ['trending'], value: { enabled: true, limit: Number(value) }, controller });
						} else {
							store.setControllerOverride({
								path: ['trending'],
								value: { enabled: undefined, limit: undefined, showResults: undefined },
								controller,
							});
						}

						updateAutocompleteControllerState(controller);
					},
					onReset: (controller) => {
						const resetValues = { enabled: undefined, limit: undefined, showResults: undefined };
						if (store.initial.controller.autocomplete?.trending?.enabled) {
							delete resetValues.showResults;
						}
						store.setControllerOverride({ path: ['trending'], value: resetValues, controller });
						updateAutocompleteControllerState(controller);
					},
				},
				{
					type: 'dropdown',
					label: 'Initial Results',
					description: '',
					getDisplayState: (controller: AutocompleteController) => {
						const enabled = controller.store.config.settings?.history?.enabled || controller.store.config.settings?.trending?.enabled;
						return enabled ? 'visible' : 'disabled';
					},
					options: (controller: AutocompleteController) => {
						const historyEnabled = controller.store.config.settings?.history?.enabled;
						const trendingEnabled = controller.store.config.settings?.trending?.enabled;

						const opts = ['Disabled'];
						if (historyEnabled) opts.push('History');
						if (trendingEnabled) opts.push('Trending');
						return opts;
					},
					getValue: (controller: AutocompleteController) => {
						if (controller.store.config.settings?.trending?.showResults) return 'Trending';
						if (controller.store.config.settings?.history?.showResults) return 'History';
						return 'Disabled';
					},
					shouldShowReset: () => {
						// see what the initial state is
						let initialValue = 'Disabled';
						const initialConfig = store.initial.controller.autocomplete;
						if (initialConfig?.trending?.showResults && initialConfig?.trending?.enabled !== false) {
							initialValue = 'Trending';
						} else if (initialConfig?.history?.showResults && initialConfig?.history?.enabled !== false) {
							initialValue = 'History';
						}

						// see what the override state is
						let overrideValue = 'Disabled';
						const overrideConfig = store.overrides.controller.autocomplete;
						if (overrideConfig?.trending?.showResults && overrideConfig?.trending?.enabled !== false) {
							overrideValue = 'Trending';
						} else if (overrideConfig?.history?.showResults && overrideConfig?.history?.enabled !== false) {
							overrideValue = 'History';
						}

						return initialValue !== overrideValue;
					},
					onValueChange: (value, controller) => {
						if (value === 'Disabled') {
							store.setControllerOverride({ path: ['history', 'showResults'], controller });
							store.setControllerOverride({ path: ['trending', 'showResults'], controller });
						} else if (value === 'History') {
							store.setControllerOverride({ path: ['history', 'showResults'], value: true, controller });
							store.setControllerOverride({ path: ['trending', 'showResults'], controller });
						} else if (value === 'Trending') {
							store.setControllerOverride({ path: ['history', 'showResults'], controller });
							store.setControllerOverride({ path: ['trending', 'showResults'], value: true, controller });
						}

						updateAutocompleteControllerState(controller);
					},
					onReset: (controller) => {
						store.setControllerOverride({ path: ['history', 'showResults'], controller });
						store.setControllerOverride({ path: ['trending', 'showResults'], controller });
						updateAutocompleteControllerState(controller);
					},
				},
			],
		},
	];
}

export async function updateAutocompleteControllerState(controller: AutocompleteController) {
	controller.reset();
	controller.store.initHistory();

	const trendingResultsEnabled =
		controller.config.settings?.trending?.enabled ||
		(controller.config.settings?.trending && controller.config.settings?.trending?.enabled == undefined);
	const historyResultsEnabled =
		controller.config.settings?.history?.enabled ||
		(controller.config.settings?.history && controller.config.settings?.history?.enabled == undefined);

	if (trendingResultsEnabled) {
		await controller.searchTrending({ limit: controller.config.settings?.trending?.limit });
		controller.config.settings?.trending?.showResults &&
			controller.store.trending.length &&
			!controller.store.results &&
			controller.store.trending[0].preview();
	} else {
		controller.store.updateTrendingTerms({ trending: { queries: [] } });
	}

	if (!trendingResultsEnabled && historyResultsEnabled) {
		controller.config.settings?.history?.showResults &&
			controller.store.history.length &&
			!controller.store.results &&
			controller.store.history[0].preview();
	}
}
