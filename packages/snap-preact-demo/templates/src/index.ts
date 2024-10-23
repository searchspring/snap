import { SnapTemplates } from '@searchspring/snap-preact';
// import { css } from '@searchspring/snap-preact/components';
// import { CustomResult } from './components/Result';
// import { globalStyles } from './styles';

new SnapTemplates({
	config: {
		siteId: '8uyt2m',
		language: 'en',
		currency: 'usd',
		platform: 'shopify',
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
					// button: {
					// 	backgroundColor: 'red',
					// 	// @ts-ignore - test
					// 	styleScript: (props) => {
					// 		return css({
					// 			backgroundColor: `${props.backgroundColor || 'pink'}`
					// 		});
					// 	},
					// 	style: {
					// 		backgroundColor: 'green',
					// 	}
					// },
					// recommendationBundle: {
					// 	style: {
					// 		'& .ss__button': {
					// 			backgroundColor: 'blue',
					// 		}
					// 	},
					// 	// @ts-ignore - test
					// 	styleScript: (props) => {
					// 		return css({
					// 			'& .ss__button': {
					// 				// backgroundColor: 'orange',
					// 				margin: '11px'
					// 			}
					// 		});
					// 	},
					// }
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
