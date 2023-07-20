import { results as resultsLayout } from '../containers/acResults';
import type { AutocompleteLayoutFunc } from '@searchspring/snap-preact-components';

export const acTablet: AutocompleteLayoutFunc = ({ controller }) => {
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
										resultsLayout(controller, 'tablet'),
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
