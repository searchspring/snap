import { LayoutElement } from '@searchspring/snap-preact-components';
export const sidebar = (controller: SearchController): LayoutElement => {
	console.log(controller);
	// do things here...
	return {
		name: 'sidebar',
		layout: {
			flexDirection: 'column',
		},
		items: [
			{
				component: 'FilterSummary',
			},
			{
				component: 'Facets',
			},
		],
	};
};
