// import { useRef } from 'preact/hooks';
import { ResultsLayout } from '@searchspring/snap-preact-components';

// import { results as resultsLayout } from '../../containers/acResults';

//TODO: try using createRef up here outside of layout for prev/next buttons

export const recsTablet: LayoutFunc = () => {
	return [
		{
			name: 'recommendations',
			layout: {
				flexDirection: 'column',
			},
			items: [
				{
					component: 'HTML',
					props: {
						content: 'Recommended For You',
					},
				},
				{
					component: 'Results',
					props: {
						// resultLayout:resultLayout,
						layout: ResultsLayout.LIST,
						columns: 1,
						rows: 4,
					},
				},
			],
		},
	];
};
