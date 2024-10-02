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
				layoutOptions: [
					{
						value: 2,
						label: 'two',
						overrides: {
							components: {
								toolbar: {
									hideSortBy: true,
								},
								results: {
									columns: 2,
								},
							},
						},
					},
					{
						value: 4,
						label: 'four',
						default: true,
						overrides: {
							components: {
								results: {
									columns: 4,
								},
							},
						},
					},
				],
				responsive: [
					{
						components: {
							pagination: {
								hideLast: true,
							},
						},
						layoutOptions: [
							{
								value: 1,
								label: 'one',
								overrides: {
									components: {
										toolbar: {
											hideSortBy: true,
										},
										results: {
											columns: 1,
										},
									},
								},
							},
							{
								value: 3,
								label: 'three',
								default: true,
								overrides: {
									components: {
										results: {
											columns: 3,
										},
									},
								},
							},
						],
					},
					{
						// layoutOptions: [],
					},
					{},
				],
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
