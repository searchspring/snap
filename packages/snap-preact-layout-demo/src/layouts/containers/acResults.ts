import { resultLayout, listResultLayout } from './resultLayout';

export const results: LayoutFunc<SearchController | AutocompleteController> = ({ controller }, data: { size: 'desktop' | 'tablet' | 'mobile' }) => {
	const { pagination } = controller.store;
	const totalResults = pagination.totalResults;

	const resultGridMap = {
		mobile: {
			resultLayout: resultLayout,
			columns: 2,
			rows: 1,
		},
		tablet: {
			resultLayout: listResultLayout,
			columns: 1,
			rows: 3,
		},
		desktop: {
			resultLayout: resultLayout,
			columns: 3,
			rows: 2,
		},
	};

	if (totalResults) {
		return [
			{
				name: 'Results-Container',
				layout: {
					flexDirection: 'column',
				},
				items: [
					{
						component: 'Results',
						props: {
							...resultGridMap[data.size],
						},
					},
				],
			},
		];
	} else if (totalResults === 0) {
		return [
			{
				name: 'NoResults-Container',
				layout: {
					flexDirection: 'column',
				},
				items: [
					{
						component: 'HTML',
						props: {
							content: `Oops, there was no results found for ${controller.store.search.query?.string}, please try another term`,
							className: 'noResultsTitle',
						},
					},
					{
						component: 'HTML',
						props: {
							content: `maybe something else to be said like contact info or somethign`,
							className: 'moreInfo',
						},
					},
					// {
					//     component: 'Recommendation',
					//     props: {
					//         title: "Recommended For You"
					//     }
					// }
				],
			},
		];
	} else {
		return [];
	}
};
