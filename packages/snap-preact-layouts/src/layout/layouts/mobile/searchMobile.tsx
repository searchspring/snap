import { sidebar } from '../../containers/sidebar';
import { toolbar } from '../../containers/toolbar';
import { ContentType } from '@searchspring/snap-store-mobx';
import type { SearchLayoutFunc } from '@searchspring/snap-preact-components';

export const mobileLayout: SearchLayoutFunc = () => {
	return [
		{
			name: 'mobile-facets',

			items: [
				{
					component: 'Slideout',
					props: {
						buttonContent: 'Refine Search',
					},
					items: [sidebar()],
				},
			],
		},
		{
			...toolbar,
			layout: {
				flexDirection: 'column',
				width: '100%',
				justifyContent: 'space-between',
			},
			items: [
				{
					layout: {
						justifyContent: 'space-between',
					},
					items: [
						{
							component: 'PerPage',
						},
						{
							component: 'SortBy',
						},
					],
				},
				{
					layout: {
						justifyContent: 'flex-end',
					},
					component: 'Pagination',
				},
			],
		},
		{
			component: 'FilterSummary',
		},
		{
			name: 'main-container',
			layout: {
				// gap: '40px',
			},
			items: [
				{
					name: 'Results',
					component: 'Results',
				},
			],
		},
		{
			name: 'footer',
			items: [
				{
					component: 'Banner',
					props: { type: ContentType.FOOTER },
				},
				{
					component: 'Pagination',
				},
			],
		},
	];
};
