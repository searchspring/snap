import { SnapTemplates } from '@searchspring/snap-preact';
// import { CustomResult } from './components/Result';
// import { globalStyles } from './styles';

new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		language: 'fr',
		currency: 'aud',
	},
	components: {
		result: {
			CustomResult: async () => (await import('./components/Result')).CustomResult,
		},
		badge: {
			// CustomPill: async () => (await import('./components/Result')).Result,
		},
	},
	// plugins: [['scrollToTop', {}]],
	themes: {
		global: {
			extends: 'base',
			variables: {
				breakpoints: [0, 720, 1024, 1600],
				colors: {
					primary: '#6d7175',
					secondary: '#202223',
					accent: '#333333',
				},
			},
			overrides: {
				components: {
					// overrides here...
				},
			},
		},
	},
	search: {
		targets: [
			{
				// plugins: [['shopifyIntegration', { config }], ['shopifyMarkets', { config }]],
				selector: '#searchspring-layout',
				// theme: 'myTheme',
				component: 'Search',
				// resultComponent: 'Result',
			},
		],
	},
	autocomplete: {
		inputSelector: 'input.searchspring-ac',
		targets: [
			{
				selector: 'input.searchspring-ac',
				// theme: 'myTheme',
				component: 'Autocomplete',
				// resultComponent: 'CustomResult',
			},
		],
	},
});
