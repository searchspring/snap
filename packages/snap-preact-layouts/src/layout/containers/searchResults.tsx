import type { LayoutElement } from '@searchspring/snap-preact-components';
import { toolbar } from './toolbar';
import { resultLayout } from './resultLayout';

export const results = (controller: SearchController): LayoutElement => {
	const { pagination } = controller.store;
	const totalResults = pagination.totalResults;

	if (totalResults) {
		return {
			name: 'Results-Container',
			layout: {
				flexDirection: 'column',
			},
			items: [
				{
					component: 'String',
					props: {
						content: `Showing ${pagination.pageSize} of ${pagination.totalResults} results...`,
						className: 'search-title',
					},
				},
				toolbar,
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
		};
	} else if (totalResults === 0) {
		return {
			name: 'NoResults-Container',
			layout: {
				flexDirection: 'column',
			},
			items: [
				{
					component: 'String',
					props: {
						content: `Oops, there was no results found for ${controller.store.search.query?.string}, please try another term`,
						className: 'noResultsTitle',
					},
				},
				{
					component: 'String',
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
		};
	} else {
		return {};
	}
};
