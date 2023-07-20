import { sidebar } from '../containers/sidebar';
import { results } from '../containers/searchResults';

import type { SearchLayoutFunc } from '@searchspring/snap-preact-components';

export const desktopLayout: SearchLayoutFunc = (data) => {
	return [
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
					items: [sidebar()],
				},
				{
					name: 'content',
					layout: {
						width: '75%',
						flexDirection: 'column',
					},
					items: [results(data.controller)],
				},
			],
		},
	];
};
