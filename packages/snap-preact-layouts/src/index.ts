import { Snap } from '@searchspring/snap-preact';

/*
	configuration and instantiation
 */

const siteId = '8uyt2m';

const config: SnapConfig = {
	mode: 'development', // should be removed for 'production' usage
	features: {
		integratedSpellCorrection: {
			enabled: true,
		},
	},
	url: {
		parameters: {
			core: {
				query: { name: 'q' },
			},
		},
	},
	client: {
		globals: {
			siteId,
		},
	},

	controllers: {
		search: [
			{
				config: {
					id: 'search',
					plugins: [],
					settings: {
						redirects: {
							merchandising: false,
						},
						restorePosition: {
							enabled: true,
						},
					},
				},
				targeters: [
					{
						selector: '#searchspring-layout',
						hideTarget: true,
						component: async () => {
							return (await import('./layout/SearchLayout')).SearchLayout;
						},
					},
				],
			},
		],
		autocomplete: [
			{
				config: {
					id: 'autocomplete',
					selector: 'input.searchspring-ac',
					settings: {
						trending: {
							limit: 5,
						},
						history: {
							limit: 5,
						},
					},
				},
				targeters: [
					{
						selector: 'input.searchspring-ac',
						hideTarget: true,
						component: async () => {
							return (await import('./layout/AutocompleteLayout')).AutocompleteLayout;
						},
					},
				],
			},
		],
	},
};

new Snap(config);
