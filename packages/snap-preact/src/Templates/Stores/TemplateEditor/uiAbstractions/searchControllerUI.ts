import { SearchController } from '@searchspring/snap-controller';
import { AbstractionGroup } from '../../../../types';
import { TemplateEditorStore } from '../TemplateEditorStore';

export function searchControllerUI(store: TemplateEditorStore): AbstractionGroup<SearchController>[] {
	return [
		{
			title: 'Result Display Options',
			description: '',
			collapsible: true,
			controls: [
				{
					type: 'checkbox',
					label: 'Infinite Scroll',
					description: 'Enable infinite scroll',
					getValue: (controller) => {
						// need to support both infinite without "enabled" (object simply exists) and with "enabled" in settings
						if (controller?.store.config.settings?.infinite) {
							if (controller.store.config.settings?.infinite?.enabled !== undefined) {
								return controller.store.config.settings.infinite.enabled;
							}
							return true;
						}
						return false;
					},
					shouldShowReset: () => {
						// if the override differs from the initial state, show reset
						const initialConfig = store.initial.controller.search?.infinite;
						const initialEnabled = Boolean(initialConfig?.enabled !== undefined ? initialConfig.enabled : initialConfig);
						const overrideEnabled = Boolean(store.overrides.controller.search?.infinite?.enabled !== undefined);
						return overrideEnabled && initialEnabled !== store.overrides.controller.search?.infinite?.enabled;
					},
					onValueChange: (value, controller) => {
						if (typeof value === 'undefined' || !controller) return;

						store.setControllerOverride({ path: ['infinite', 'enabled'], value: Boolean(value), controller });
					},
					onReset: (controller) => {
						if (!controller) return;

						store.setControllerOverride({ path: ['infinite'], controller });
					},
				},
			],
		},
	];
}
