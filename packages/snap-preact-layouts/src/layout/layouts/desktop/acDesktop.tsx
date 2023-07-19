import { results as resultsLayout } from '../../containers/acResults';
import type { AutocompleteLayoutFunc } from '@searchspring/snap-preact-components';

export const acDesktop: AutocompleteLayoutFunc = ({ controller }) => {
	const { pagination, hasQuery } = controller.store;

	return hasQuery
		? [
				{
					name: 'autocomplete-container',
					layout: {
						justifyContent: 'space-between',
					},
					items: [
						{
							name: 'content',
							layout: {
								gap: '10px',
							},
							items: [
								{
									component: 'GroupedTerms',
									props: {
										controller: controller,
										retainHistory: Boolean(pagination.totalPages),
									},
								},

								// {
								// 	layout: {
								// 		flexDirection: "column"
								// 	},
								// 	items: [

								// 		{
								// 			name: 'suggested terms',
								// 			component: 'Terms2',
								// 			props: {
								// 				title: 'Suggestions',
								// 				terms: controller.store.terms,
								// 			}
								// 		},
								// 		{
								// 			name: 'popular terms',
								// 			component: 'Terms2',
								// 			props: {
								// 				title: "Suggestions",
								// 				terms: !controller.store.terms ? controller.store.trending : undefined
								// 			}
								// 		},
								// 		{
								// 			name: 'historical terms',
								// 			component: 'Terms2',
								// 			props: {
								// 				title: 'Search History',
								// 				terms: controller.store.history
								// 			}
								// 		}
								// 	]
								// },

								{
									component: 'Facets',
									props: {
										onFacetOptionClick: () => {
											console.log('hi mom');
										},
									},
								},
								{
									name: 'resultsContainer',
									layout: {
										flexDirection: 'column',
									},
									items: [
										resultsLayout(controller, 'desktop'),
										{
											component: 'SeeMore',
											layout: {
												textAlign: 'right',
											},
										},
									],
								},
							],
						},
					],
				},
		  ]
		: [
				{
					name: 'autocomplete-container',
					layout: {
						justifyContent: 'space-between',
					},
					items: [
						{
							name: 'content',
							items: [
								{
									component: 'GroupedTerms',
								},
							],
						},
					],
				},
		  ];
};
