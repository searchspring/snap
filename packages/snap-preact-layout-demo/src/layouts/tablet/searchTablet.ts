import { sidebar } from '../containers/sidebar';
import { toolbar } from '../containers/toolbar';
import { ContentType } from '@searchspring/snap-store-mobx';

export const searchTablet: LayoutFunc<SearchController> = (data) => {
	return [
		{
			name: 'header',
			layout: {
				justifyContent: 'flex-end',
			},
			items: toolbar(data),
		},
		{
			name: 'main-container',
			layout: {
				gap: '40px',
			},
			items: [
				...sidebar(data),
				{
					component: 'Results',
					props: {
						columns: 3,
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
