import { sidebar } from '../containers/sidebar';
import { toolbar } from '../containers/toolbar';

import type { SearchLayoutFunc } from '@searchspring/snap-preact-components';
import { ContentType } from '@searchspring/snap-store-mobx';

export const tabletLayout: SearchLayoutFunc = () => {
	return [
		{
			name: 'header',
			layout: {
				justifyContent: 'flex-end',
			},
			items: [toolbar],
		},
		{
			name: 'main-container',
			layout: {
				// gap: '40px',
			},
			items: [sidebar(), { component: 'Results' }],
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
