import { results as resultsLayout } from '../containers/acResults';

export const acMobile: LayoutFunc<AutocompleteController> = (data) => {
	const { pagination, hasQuery } = data.controller.store;

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
								flexDirection: 'column',
							},
							items: [
								{
									component: 'GroupedTerms',
									props: {
										controller: data.controller,
										retainHistory: Boolean(pagination.totalPages),
										horizontal: true,
									},
								},
								{
									name: 'resultsContainer',
									layout: {
										flexDirection: 'column',
									},
									items: [
										...resultsLayout(data, 'mobile'),
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
