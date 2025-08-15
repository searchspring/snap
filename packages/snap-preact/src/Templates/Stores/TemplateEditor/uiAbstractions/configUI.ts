import { AbstractionGroup } from '../../../../types';
import { TemplateEditorStore } from '../TemplateEditorStore';

export const configUI = (store: TemplateEditorStore): AbstractionGroup[] => {
	return [
		{
			description: '',
			controls: [
				{
					type: 'text',
					label: 'SiteId',
					description: 'site id used to connect to the searchspring service',
					getDisplayState: () => 'disabled',
					getValue: () => {
						// value is derived in the editorstore at construction time
						return store.overrides.config.siteId ?? store.initial.config.siteId ?? '';
					},
					shouldShowReset: () => {
						return typeof store.overrides.config.siteId !== 'undefined';
					},
					onValueChange: (value) => {
						store.setConfigOverride({ path: ['siteId'], value });
					},
					onReset: () => {
						store.setConfigOverride({ path: ['siteId'], value: undefined });
					},
				},
				{
					type: 'dropdown',
					label: 'Platform',
					description: 'Storefront platform used for the project',
					getDisplayState: () => 'disabled',
					getOptions: () => [
						{
							options: [
								{ label: 'Shopify', value: 'shopify' },
								{ label: 'BigCommerce', value: 'bigCommerce' },
								{ label: 'Magento 2', value: 'magento2' },
								{ label: 'Other', value: 'other' },
							],
						},
					],
					getValue: () => {
						return store.overrides.config.platform || store.initial.config.platform || 'other';
					},
					shouldShowReset: () => {
						// if the override differs from the initial state, show reset
						return typeof store.overrides.config.platform !== 'undefined';
					},
					onValueChange: (value) => {
						store.setConfigOverride({ path: ['platform'], value });
					},
					onReset: () => {
						store.setConfigOverride({ path: ['platform'], value: undefined });
					},
				},
				{
					type: 'dropdown',
					label: 'Language',
					description: 'Language used for the project',
					getDisplayState: () => 'visible',
					getOptions: () => [
						{
							options: [
								{ label: 'English', value: 'en' },
								{ label: 'French', value: 'fr' },
								{ label: 'Spanish', value: 'es' },
							],
						},
					],
					getValue: () => {
						return store.overrides.config.language || store.initial.config.language || 'en';
					},
					shouldShowReset: () => {
						// if the override differs from the initial state, show reset
						return typeof store.overrides.config.language !== 'undefined';
					},
					onValueChange: (value) => {
						store.setConfigOverride({ path: ['language'], value });
					},
					onReset: async () => {
						store.setConfigOverride({ path: ['language'], value: undefined });
					},
				},
				{
					type: 'dropdown',
					label: 'Currency',
					description: 'Currency used for the project',
					getDisplayState: () => 'visible',
					getOptions: () => [
						{
							options: [
								{ label: 'USD', value: 'usd' },
								{ label: 'EUR', value: 'eur' },
								{ label: 'AUD', value: 'aud' },
							],
						},
					],
					getValue: () => {
						return store.overrides.config.currency || store.initial.config.currency || 'usd';
					},
					shouldShowReset: () => {
						// if the override differs from the initial state, show reset
						return typeof store.overrides.config.currency !== 'undefined';
					},
					onValueChange: async (value) => {
						store.setConfigOverride({ path: ['currency'], value });
					},
					onReset: async () => {
						store.setConfigOverride({ path: ['currency'], value: undefined });
					},
				},
			],
		},
	];
};
