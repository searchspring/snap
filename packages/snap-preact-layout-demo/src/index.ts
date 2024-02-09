import { SnapTemplates } from '@searchspring/snap-preact';
import { Result } from './components/Result';

new SnapTemplates({
	config: {
		language: 'en',
		currency: 'usd',
		// components: {
		// 	global: Result,
		// 	ProductCardAlt: ResultAlt,
		// },
		themes: {
			global: {
				name: 'bocachica',
				overrides: {
					components: {
						noResults: {
							templates: {
								recommendation: {
									template: 'Recommendation',
									// resultComponent: 'Product', TODO: support resultComponent
								},
							},
						},
						autocomplete: {
							templates: {
								recommendation: {
									template: 'Recommendation',
									// resultComponent: 'Product',
								},
							},
						},
					},
				},
			},
		},
	},
	search: {
		targets: [
			{
				selector: '#searchspring-layout',
				// template: 'Search',
				template: 'HorizontalSearch',
				resultComponent: Result,
			},
		],
	},
	recommendation: {
		settings: {
			branch: BRANCHNAME,
		},
		targets: [
			{
				component: 'Recs',
				template: 'Recommendation',
				resultComponent: Result,
			},
			{
				component: 'Carousel',
				template: 'Recommendation',
				resultComponent: Result,
			},
			{
				component: 'HomePageComponent',
				template: 'Recommendation',
				resultComponent: Result,
			},
		],
	},
	autocomplete: {
		inputSelector: 'input.searchspring-ac',
		targets: [
			{
				selector: 'input.searchspring-ac',
				template: 'Autocomplete',
				resultComponent: Result,
			},
		],
	},
});
