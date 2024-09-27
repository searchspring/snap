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
			// CustomResult: async () => (await import('./components/Result')).CustomResultSecondary,
		},
		badge: {
			// CustomPill: async () => (await import('./components/Result')).Result,
		},
	},
	themes: {
		global: {
			extends: 'bocachica',
			variables: {
				colors: {
					primary: '#3A23AD',
					secondary: '#4c3ce2',
					accent: '#00cee1',
					active: {
						foreground: '#333333',
						background: '#f8f6fd',
						accent: '#3A23AD',
					},
					hover: {
						foreground: '#333333',
						background: '#f8f6fd',
						accent: '#3A23AD',
					},
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
