import { sidebar } from '../containers/sidebar';
import { results } from '../containers/results';

import type { LayoutElement } from '@searchspring/snap-preact-components';

export const desktopLayout = (controller: SearchController): LayoutElement[] => {
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
					items: [sidebar(controller)],
				},
				{
					name: 'content',
					layout: {
						width: '75%',
						flexDirection: 'column',
					},
					items: [results(controller)],
				},
			],
		},
	];
};
