import { toolbar } from './toolbar';
import { resultLayout } from './resultLayout';

export const results: LayoutFunc<SearchController> = (data) => {
	const { pagination } = data.controller.store;
	const totalResults = pagination.totalResults;

	if (totalResults) {
		return [
			{
				name: 'Results-Container',
				layout: {
					flexDirection: 'column',
				},
				items: [
					{
						component: 'HTML',
						props: {
							content: `<span class="search-title">Showing ${pagination.pageSize} of ${pagination.totalResults} results...</span>`,
						},
					},
					...toolbar(data),
					{
						component: 'Results',
						props: {
							resultLayout: resultLayout,
						},
					},
					{
						component: 'Pagination',
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
							content: `<span class="noResultsTitle">Oops, there was no results found for ${data.controller.store.search.query?.string}, please try another term</span>`,
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
