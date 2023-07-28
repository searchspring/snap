import { useState } from 'preact/hooks';

import { sidebar } from '../containers/sidebar';
import { results } from '../containers/searchResults';

export const searchDesktop: LayoutFunc<SearchController> = (data) => {
	const [showSidebar, setShowSidebar] = useState(true);

	return [
		{
			name: 'main-container',
			layout: {
				justifyContent: 'space-between',
				gap: showSidebar ? '40px' : '0px',
			},
			items: [
				{
					name: 'sidebar-wrapper',
					layout: {
						flexDirection: 'column',
						width: showSidebar ? '200px' : '0px',
						overflow: 'hidden',
						flexShrink: 0,
						style: {
							overflow: 'hidden',
						},
					},
					items: sidebar(data),
				},
				{
					name: 'content',
					layout: {
						flexDirection: 'column',
					},
					items: [
						{
							component: 'Button',
							props: {
								content: showSidebar ? 'hide filters' : 'show filters',
								onClick: () => {
									setShowSidebar(!showSidebar);
								},
							},
						},
						...results(data),
					],
				},
			],
		},
	];
};
