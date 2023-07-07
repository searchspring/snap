import type { LayoutElement } from '@searchspring/snap-preact-components';

export const sidebar: LayoutElement = {
	// do things here...

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
