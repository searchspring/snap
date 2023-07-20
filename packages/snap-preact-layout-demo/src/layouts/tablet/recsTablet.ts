// import { useRef } from 'preact/hooks';
import type { RecommendationLayoutFunc } from '@searchspring/snap-preact-components';
import { Layout } from '@searchspring/snap-preact-components';

// import { results as resultsLayout } from '../../containers/acResults';

//TODO: try using createRef up here outside of layout for prev/next buttons

export const recsTablet: RecommendationLayoutFunc = () => {
	return [
		{
			name: 'recommendations',
			layout: {
				flexDirection: 'column',
			},
			items: [
				{
					component: 'String',
					props: {
						content: 'Recommended For You',
					},
				},
				{
					component: 'Results',
					props: {
						// resultLayout:resultLayout,
						layout: Layout.LIST,
						columns: 1,
						rows: 4,
					},
				},
			],
		},
	];
};
