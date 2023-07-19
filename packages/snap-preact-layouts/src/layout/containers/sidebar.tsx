import { SearchLayoutElement } from '@searchspring/snap-preact-components';
export const sidebar = (): SearchLayoutElement => {
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
