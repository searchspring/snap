import { SnapTemplates } from '@searchspring/snap-preact';
// import { CustomResult } from './components/Result';
// import { globalStyles } from './styles';

new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'usd',
	},
	components: {
		result: {
			CustomResult: async () => (await import('./components/Result')).CustomResult,
		},
		badge: {
			// CustomPill: async () => (await import('./components/Result')).Result,
		},
	},
	themes: {
		global: {
			extends: 'bocachica',
			variables: {
				breakpoints: [768, 1024, 1280],
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
				selector: '#searchspring-layout',
				// theme: 'myTheme',
				component: 'Search',
				// resultComponent: 'CustomResult',
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
