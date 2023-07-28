import { sidebar } from '../containers/sidebar';
import { ContentType } from '@searchspring/snap-store-mobx';

export const searchMobile: LayoutFunc<SearchController> = (data) => {
	return [
		{
			name: 'mobile-facets',

			items: [
				{
					component: 'Slideout',
					props: {
						buttonContent: 'Refine Filters',
						children: sidebar(data),
					},
				},
			],
		},
		{
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
					props: {
						columns: 2,
					},
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
