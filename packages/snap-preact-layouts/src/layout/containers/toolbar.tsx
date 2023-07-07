import type { LayoutElement } from '@searchspring/snap-preact-components';

export const toolbar: LayoutElement = {
	name: 'toolbar',
	layout: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
	},
	items: [
		{
			layout: {
				justifyContent: 'flex-start',
			},
			items: [
				{
					component: 'PerPage',
					props: {
						className: 'ss-toolbar-col',
					},
				},
				{
					component: 'SortBy',
					props: {
						className: 'ss-toolbar-col',
					},
				},
			],
		},
		{
			layout: {
				justifyContent: 'flex-end',
			},
			component: 'Pagination',
			props: {
				className: 'ss-toolbar-col',
			},
		},
	],
};
