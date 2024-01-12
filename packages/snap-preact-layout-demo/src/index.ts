import { SnapTemplates } from '@searchspring/snap-preact';
import { Result } from './components/Result';

new SnapTemplates({
	config: {
		language: 'en',
		currency: 'usd',
		siteId: 'rp9hld',
		themes: {
			global: {
				name: 'bocachica',
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
