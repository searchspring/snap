import { sidebar } from '../containers/sidebar';
import { toolbar } from '../containers/toolbar';
import type { LayoutElement } from '@searchspring/snap-preact-components';

export const desktopLayout: LayoutElement[] = [
	{
		name: 'main-container',
		layout: {
			justifyContent: 'space-between',
		},
		items: [
			{
				name: 'sidebar-wrapper',
				layout: {
					flexDirection: 'column',
					width: '20%',
				},
				items: [sidebar],
			},
			{
				name: 'content',
				layout: {
					width: '75%',
					flexDirection: 'column',
				},
				items: [
					{
						component: 'String',
						props: {
							content: 'Showing {{store.pagination.pageSize}} of {{ store.pagination.totalResults }} results...',
							className: 'search-title',
						},
					},
					toolbar,
					{
						component: 'Results',
					},
					{
						component: 'Pagination',
					},
				],
			},
		],
	},
];
